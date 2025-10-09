import { API_ETH_MOCK_ADDRESS, PERMISSION } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { BorrowModalContent } from './BorrowModalContent';
import { GhoBorrowModalContent } from './GhoBorrowModalContent';

export const BorrowModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  const { currentMarket } = useProtocolDataContext();

  const [borrowUnWrapped, setBorrowUnWrapped] = useState(true);
  const [trackEvent, displayGho] = useRootStore((store) => [store.trackEvent, store.displayGho]);

  const { openRepay, openRepayModalData } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const handleBorrowUnwrapped = (borrowUnWrapped: boolean) => {
    trackEvent(GENERAL.OPEN_MODAL, {
      modal: 'Unwrap Asset',
      asset: args.underlyingAsset,
      assetWrapped: borrowUnWrapped,
    });
    setBorrowUnWrapped(borrowUnWrapped);
  };

  const headerNavList = [
    {
      text: 'Borrow',
      onClick: () => {},
      active: true,
      isSecondaryColors: true,
      icon:
        openRepayModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
    {
      text: 'Repay',
      onClick: () => {
        if (openRepayModalData) {
          const { funnel, currentMarket, underlyingAsset, name, currentRateMode, isFrozen } =
            openRepayModalData;
          openRepay(underlyingAsset, currentRateMode, isFrozen, currentMarket, name, funnel);
        }
      },
      active: false,
      isSecondaryColors: true,
      isDisabled: !openRepayModalData?.active,
      icon:
        openRepayModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
  ];

  return (
    <BasicModal
      open={type === ModalType.Borrow}
      setOpen={close}
      withCutRound={true}
      withCloseButton={false}
      contentMaxWidth={502}
    >
      <ModalWrapper
        isTitleShown={false}
        action="borrow"
        title={<Trans>Borrow</Trans>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol={!borrowUnWrapped}
        requiredPermission={PERMISSION.BORROWER}
        headerNavList={headerNavList}
      >
        {(params) =>
          displayGho({ symbol: params.symbol, currentMarket }) ? (
            <GhoBorrowModalContent {...params} />
          ) : (
            <BorrowModalContent
              {...params}
              unwrap={borrowUnWrapped}
              setUnwrap={handleBorrowUnwrapped}
            />
          )
        }
      </ModalWrapper>
    </BasicModal>
  );
};
