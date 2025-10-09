import { API_ETH_MOCK_ADDRESS, PERMISSION } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React from 'react';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { SupplyModalContent } from './SupplyModalContent';
import { useProtocolDataContext } from '../../../hooks/useProtocolDataContext';

export const SupplyModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  const { openWithdraw, openWithdrawModalData } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const headerNavList = [
    {
      text: 'Supply',
      onClick: () => {},
      active: true,
      icon:
        openWithdrawModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
    {
      text: 'Withdraw',
      onClick: () => {
        if (openWithdrawModalData) {
          const { funnel, currentMarket, underlyingAsset, name } = openWithdrawModalData;
          openWithdraw(underlyingAsset, currentMarket, name, funnel);
        }
      },
      active: false,
      isDisabled: !openWithdrawModalData?.active,
      icon:
        openWithdrawModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
  ];

  return (
    <BasicModal
      open={type === ModalType.Supply}
      setOpen={close}
      withCutRound={true}
      withCloseButton={false}
      contentMaxWidth={502}
    >
      <ModalWrapper
        isTitleShown={false}
        action="supply"
        title={<Trans>Supply</Trans>}
        underlyingAsset={args.underlyingAsset}
        requiredPermission={PERMISSION.DEPOSITOR}
        headerNavList={headerNavList}
      >
        {(params) => <SupplyModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};
