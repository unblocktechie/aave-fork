import { API_ETH_MOCK_ADDRESS, PERMISSION } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { getGhoReserve } from 'src/utils/ghoUtilities';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { WithdrawAndSwitchModalContent } from './WithdrawAndSwitchModalContent';
import { WithdrawModalContent } from './WithdrawModalContent';
import { WithdrawType, WithdrawTypeSelector } from './WithdrawTypeSelector';

export const WithdrawModal = () => {
  const { type, close, args, mainTxState } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  const [withdrawUnWrapped, setWithdrawUnWrapped] = useState(true);
  const [withdrawType, setWithdrawType] = useState(WithdrawType.WITHDRAW);
  const { currentMarketData } = useProtocolDataContext();
  const { reserves } = useAppDataContext();

  const ghoReserve = getGhoReserve(reserves);
  const { openSupplyModalData, openSupply } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const isWithdrawAndSwapPossible =
    isFeatureEnabled.withdrawAndSwitch(currentMarketData) &&
    args.underlyingAsset !== ghoReserve?.underlyingAsset;

  const handleClose = () => {
    setWithdrawType(WithdrawType.WITHDRAW);
    close();
  };

  const headerNavList = [
    {
      text: 'Supply',
      onClick: () => {
        if (openSupplyModalData) {
          const { funnel, currentMarket, underlyingAsset, name } = openSupplyModalData;
          openSupply(underlyingAsset, currentMarket, name, funnel);
        }
      },
      active: false,
      isDisabled: !openSupplyModalData?.active,
      icon:
        openSupplyModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
    {
      text: 'Withdraw',
      onClick: () => {},
      active: true,
      isDisabled: !openSupplyModalData?.active,
      icon:
        openSupplyModalData?.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()
          ? currentNetworkConfig.baseAssetSymbol
          : undefined,
    },
  ];

  return (
    <BasicModal
      open={type === ModalType.Withdraw}
      setOpen={handleClose}
      withCutRound={true}
      withCloseButton={false}
      contentMaxWidth={502}
    >
      <ModalWrapper
        isTitleShown={false}
        title={<Trans>Withdraw</Trans>}
        underlyingAsset={args.underlyingAsset}
        keepWrappedSymbol={!withdrawUnWrapped}
        requiredPermission={PERMISSION.DEPOSITOR}
        headerNavList={headerNavList}
      >
        {(params) => (
          <>
            {isWithdrawAndSwapPossible && !mainTxState.txHash && (
              <WithdrawTypeSelector withdrawType={withdrawType} setWithdrawType={setWithdrawType} />
            )}
            {withdrawType === WithdrawType.WITHDRAW && (
              <WithdrawModalContent
                {...params}
                unwrap={withdrawUnWrapped}
                setUnwrap={setWithdrawUnWrapped}
              />
            )}
            {withdrawType === WithdrawType.WITHDRAWSWITCH && (
              <>
                <WithdrawAndSwitchModalContent {...params} />
              </>
            )}
          </>
        )}
      </ModalWrapper>
    </BasicModal>
  );
};
