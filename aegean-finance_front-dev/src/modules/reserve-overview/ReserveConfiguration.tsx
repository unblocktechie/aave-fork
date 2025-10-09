import { Trans } from '@lingui/macro';
import { Box, Divider } from '@mui/material';
import { getFrozenProposalLink } from 'src/components/infoTooltips/FrozenTooltip';
import { PausedTooltipText } from 'src/components/infoTooltips/PausedTooltip';
import { Link } from 'src/components/primitives/Link';
import { Warning } from 'src/components/primitives/Warning';
import { AMPLWarning } from 'src/components/Warnings/AMPLWarning';
import {
  AssetsBeingOffboarded,
  OffboardingWarning,
} from 'src/components/Warnings/OffboardingWarning';
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { BROKEN_ASSETS } from 'src/hooks/useReservesHistory';

import { BorrowInfo } from './BorrowInfo';
import { ReserveEModePanel } from './ReserveEModePanel';
import { SupplyInfo } from './SupplyInfo';
import css from './styles.module.scss';
import cn from 'classnames';
import React, { useState } from 'react';
import { useWalletBalances } from '../../hooks/app-data-provider/useWalletBalances';
import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { WithdrawInfo } from './WithdrawInfo';
import { useIsWrongNetwork } from '../../hooks/useIsWrongNetwork';
import { ChangeNetworkWarning } from '../../components/transactions/Warnings/ChangeNetworkWarning';
import { getNetworkConfig } from '../../utils/marketsAndNetworksConfig';
import { GENERAL } from '../../utils/mixPanelEvents';
import { RepayInfo } from './RepayInfo';
import { useModalContext } from '../../hooks/useModal';

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

const labels = ['Supply', 'Withdraw', 'Borrow', 'Repay'];

export const ReserveConfiguration: React.FC<ReserveConfigurationProps> = ({ reserve }) => {
  const { currentNetworkConfig, currentMarketData, currentMarket, currentChainId } =
    useProtocolDataContext();
  const reserveId =
    reserve.underlyingAsset + currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER;
  const renderCharts =
    !!currentNetworkConfig.ratesHistoryApiUrl &&
    !currentMarketData.disableCharts &&
    !BROKEN_ASSETS.includes(reserveId);
  const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();
  const showSupplyCapStatus: boolean = reserve.supplyCap !== '0';
  const showBorrowCapStatus: boolean = reserve.borrowCap !== '0';
  const { marketReferencePriceInUsd, user, loading } = useAppDataContext();
  const { close } = useModalContext();

  const [activeLabel, setActiveLabel] = useState<string>(labels[0]);
  const { walletBalances } = useWalletBalances(currentMarketData);
  const nativeBalance = walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount || '0';
  const tokenBalance = walletBalances[reserve.underlyingAsset.toLowerCase()]?.amount || '0';

  const offboardingDiscussion = AssetsBeingOffboarded[currentMarket]?.[reserve.symbol];

  const userReserve = user?.userReservesData.find((userReserve) => {
    if (reserve.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return userReserve.reserve.isWrappedBaseAsset;
    return reserve.underlyingAsset === userReserve.underlyingAsset;
  }) as ComputedUserReserveData;

  const { isWrongNetwork, requiredChainId } = useIsWrongNetwork(undefined);

  return (
    <>
      <Box>
        <ul className={css.labelsList}>
          {labels.map((item, i) => (
            <li
              key={i}
              onClick={() => {
                close();
                setActiveLabel(item);
              }}
              className={cn(css.labelItem, item === activeLabel && css.labelItemActive)}
            >
              {item}
            </li>
          ))}
        </ul>
        {isWrongNetwork && (
          <ChangeNetworkWarning
            networkName={getNetworkConfig(requiredChainId).name}
            chainId={requiredChainId}
            event={{
              eventName: GENERAL.SWITCH_NETWORK,
              eventParams: {
                asset: reserve.underlyingAsset,
              },
            }}
          />
        )}
        {reserve.isFrozen && !offboardingDiscussion ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <Trans>
              This asset is frozen due to an Aave community decision.{' '}
              <Link
                href={getFrozenProposalLink(reserve.symbol, currentMarket)}
                sx={{ textDecoration: 'underline' }}
              >
                <Trans>More details</Trans>
              </Link>
            </Trans>
          </Warning>
        ) : offboardingDiscussion ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <OffboardingWarning discussionLink={offboardingDiscussion} />
          </Warning>
        ) : (
          reserve.symbol == 'AMPL' && (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="warning">
              <AMPLWarning />
            </Warning>
          )
        )}

        {reserve.isPaused ? (
          reserve.symbol === 'MAI' ? (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
              <Trans>
                MAI has been paused due to a community decision. Supply, borrows and repays are
                impacted.{' '}
                <Link
                  href={
                    'https://governance.aave.com/t/arfc-add-mai-to-arbitrum-aave-v3-market/12759/8'
                  }
                  sx={{ textDecoration: 'underline' }}
                >
                  <Trans>More details</Trans>
                </Link>
              </Trans>
            </Warning>
          ) : (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
              <PausedTooltipText />
            </Warning>
          )
        ) : null}
      </Box>
      {activeLabel === 'Supply' && !!user.userReservesData.length && (
        <SupplyInfo
          reserve={reserve}
          currentMarketData={currentMarketData}
          renderCharts={renderCharts}
          showSupplyCapStatus={showSupplyCapStatus}
          supplyCap={supplyCap}
          debtCeiling={debtCeiling}
          nativeBalance={nativeBalance}
          tokenBalance={tokenBalance}
          currentNetworkConfig={currentNetworkConfig}
          marketReferencePriceInUsd={marketReferencePriceInUsd}
          user={user}
          loading={loading}
          userReserve={userReserve}
          isWrongNetwork={isWrongNetwork}
        />
      )}

      {(reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) &&
        activeLabel === 'Withdraw' && (
          <WithdrawInfo
            poolReserve={reserve}
            currentNetworkConfig={currentNetworkConfig}
            user={user}
            userReserve={userReserve}
            isWrongNetwork={isWrongNetwork}
          />
        )}

      {activeLabel === 'Borrow' && (
        <>
          <BorrowInfo
            poolReserve={reserve}
            currentMarketData={currentMarketData}
            currentNetworkConfig={currentNetworkConfig}
            renderCharts={renderCharts}
            showBorrowCapStatus={showBorrowCapStatus}
            borrowCap={borrowCap}
            currentMarket={currentMarket}
            userReserve={userReserve}
            isWrongNetwork={isWrongNetwork}
          />
        </>
      )}

      {activeLabel === 'Repay' && (
        <RepayInfo
          poolReserve={reserve}
          userReserve={userReserve}
          currentMarketData={currentMarketData}
          currentMarket={currentMarket}
          tokenBalance={tokenBalance}
          nativeBalance={nativeBalance}
          currentNetworkConfig={currentNetworkConfig}
          marketReferencePriceInUsd={marketReferencePriceInUsd}
          user={user}
          isWrongNetwork={isWrongNetwork}
          currentChainId={currentChainId}
        />
      )}

      {reserve.eModeCategoryId !== 0 && (
        <>
          <Divider sx={{ my: { xs: 6, sm: 10 } }} />
          <ReserveEModePanel reserve={reserve} />
        </>
      )}
    </>
  );
};

/*
<>
  <PanelRow>
    <PanelTitle>Interest rate model</PanelTitle>
    <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <PanelItem title={<Trans>Utilization Rate</Trans>} className="borderless">
          <FormattedNumber
            value={reserve.borrowUsageRatio}
            percent
            variant="main16"
            compact
          />
        </PanelItem>
        <Button
          onClick={() => {
            trackEvent(GENERAL.EXTERNAL_LINK, {
              asset: reserve.underlyingAsset,
              Link: 'Interest Rate Strategy',
              assetName: reserve.name,
            });
          }}
          href={currentNetworkConfig.explorerLinkBuilder({
            address: reserve.interestRateStrategyAddress,
          })}
          endIcon={
            <SvgIcon sx={{ width: 14, height: 14 }}>
              <ExternalLinkIcon />
            </SvgIcon>
          }
          component={Link}
          size="small"
          variant="outlined"
          sx={{ verticalAlign: 'top' }}
        >
          <Trans>Interest rate strategy</Trans>
        </Button>
      </Box>
      <InterestRateModelGraphContainer reserve={reserve} />
    </Box>
  </PanelRow>
</>*/
