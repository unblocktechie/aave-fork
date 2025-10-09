import { Skeleton, Switch, Tooltip } from '@mui/material';
import { useRootStore } from 'src/store/root';
import css from './styles.module.scss';

import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from '../../hooks/app-data-provider/useWalletBalances';
import React from 'react';
import {
  getMaxAmountAvailableToBorrow,
  getMaxGhoMintAmount,
} from '../../utils/getMaxAmountAvailableToBorrow';
import BigNumber from 'bignumber.js';
import { valueToBigNumber } from '@aave/math-utils';
import { InterestRate } from '@aave/contract-helpers';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { formatUnits } from 'ethers/lib/utils';

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetails = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const { reserves, user, ghoReserveData } = useAppDataContext();
  const reserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;
  const [, displayGho] = useRootStore((store) => [
    store.poolComputed.minRemainingBaseTokenBalance,
    store.displayGho,
  ]);
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const currentMarket = useRootStore((store) => store.currentMarket);

  const isGho = displayGho({ symbol: reserve.symbol, currentMarket });

  const { walletBalances, loading: loadingWalletBalance } = useWalletBalances(currentMarketData);
  let balance = walletBalances[reserve.underlyingAsset];

  let maxAmountToBorrow = '0';
  let maxAmountToSupply = '0';

  if (isGho) {
    const maxMintAmount = getMaxGhoMintAmount(user, reserve);
    maxAmountToBorrow = BigNumber.min(
      maxMintAmount,
      valueToBigNumber(ghoReserveData.aaveFacilitatorRemainingCapacity)
    ).toString();
    maxAmountToSupply = '0';
  } else {
    maxAmountToBorrow = getMaxAmountAvailableToBorrow(
      reserve,
      user,
      InterestRate.Variable
    ).toString();

    console.log(user);
    const userReserve = user.userReservesData.find(
      (userReserve) => userReserve.reserve.id === reserve.id
    );

    const userSupply = formatUnits(
      BigInt(userReserve?.scaledATokenBalance || 0),
      userReserve?.reserve.decimals || 18
    );

    maxAmountToSupply = BigNumber.min(
      valueToBigNumber(userSupply),
      valueToBigNumber(reserve.availableLiquidity)
    ).toString();
  }

  return (
    <div className={css.topInfoPanelContainer}>
      <div className={css.topInfoPanelItem}>
        {loadingWalletBalance ? (
          <Skeleton width={80} height={50} />
        ) : (
          <>
            <span className={css.topInfoPanelTitle}>Supply Balance</span>
            <span className={css.topInfoPanelValue}>
              <Tooltip title={maxAmountToSupply}>
                <span className={css.panelValue}>
                  <FormattedNumber value={maxAmountToSupply} visibleDecimals={6} />
                </span>
              </Tooltip>
              <span className={css.panelSymbol}>{reserve.symbol}</span>
            </span>
          </>
        )}
      </div>
      <div className={css.topInfoPanelItem}>
        {loadingWalletBalance ? (
          <Skeleton width={100} height={56} />
        ) : (
          <>
            <span className={css.topInfoPanelTitle}>Borrow Balance</span>
            <span className={css.topInfoPanelValue}>
              <Tooltip title={maxAmountToBorrow}>
                <span className={css.panelValue}>
                  <FormattedNumber value={maxAmountToBorrow} />
                </span>
              </Tooltip>
              <span className={css.panelSymbol}>{reserve.symbol}</span>
            </span>
          </>
        )}
      </div>
      <div className={css.topInfoPanelItem}>
        {loadingWalletBalance ? (
          <Skeleton width={100} height={56} />
        ) : (
          <>
            <span className={css.topInfoPanelTitle}>Wallet balance</span>
            <span className={css.topInfoPanelValue}>
              <Tooltip title={balance.amount}>
                <span className={css.panelValue}>
                  <FormattedNumber value={balance.amount} />
                </span>
              </Tooltip>
              <span className={css.panelSymbol}>{reserve.symbol}</span>
            </span>
          </>
        )}
      </div>
      <div className={css.topInfoPanelItem}>
        {loadingWalletBalance ? (
          <Skeleton width={100} height={56} />
        ) : (
          <>
            <span className={css.topInfoPanelTitle}>Collateral</span>
            <Switch
              sx={{ height: 30, marginTop: '-10px' }}
              checked={reserve.reserveLiquidationThreshold !== '0'}
            />
          </>
        )}
      </div>

      {/*<TopInfoPanelItem title={<Trans>Supply Balance</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.totalLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#94A1CA"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Available liquidity</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.availableLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#94A1CA"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Utilization Rate</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={poolReserve?.borrowUsageRatio}
          percent
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#94A1CA"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Oracle price</Trans>} loading={loading} hideIcon>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <FormattedNumber
            value={poolReserve?.priceInUSD}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
            symbolsColor="#94A1CA"
          />
          {loading ? (
            <Skeleton width={16} height={16} sx={{ ml: 1, background: '#383D51' }} />
          ) : (
            <CircleIcon tooltipText="View oracle contract" downToSM={downToSM}>
              <Link
                onClick={() =>
                  trackEvent(GENERAL.EXTERNAL_LINK, {
                    Link: 'Oracle Price',
                    oracle: poolReserve?.priceOracle,
                    assetName: poolReserve.name,
                    asset: poolReserve.underlyingAsset,
                  })
                }
                href={currentNetworkConfig.explorerLinkBuilder({
                  address: poolReserve?.priceOracle,
                })}
                sx={iconStyling}
              >
                <SvgIcon sx={{ fontSize: downToSM ? '12px' : '14px' }}>
                  <ExternalLinkIcon />
                </SvgIcon>
              </Link>
            </CircleIcon>
          )}
        </Box>
      </TopInfoPanelItem>*/}
    </div>
  );
};
