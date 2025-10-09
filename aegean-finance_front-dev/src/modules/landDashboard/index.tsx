import React, { useMemo, useState } from 'react';
import css from './styles.module.scss';
import cn from 'classnames';
import {
  ComputedUserReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { Bag } from '../../assets/svgComponents/Bag';
import { ArrowIcon } from '../../assets/svgComponents/ArrowIcon';
import { fetchIconSymbolAndName } from '../../ui-config/reservePatches';
import { API_ETH_MOCK_ADDRESS, InterestRate } from '@aave/contract-helpers';
import { DashboardReserve } from '../../utils/dashboardSortUtils';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { DASHBOARD } from '../../utils/mixPanelEvents';
import { ROUTES, Link } from '../../components/primitives/Link';
import { useRootStore } from '../../store/root';
import { PercentageIcon } from '../../assets/svgComponents/PercentageIcon';
import { GHO_SYMBOL } from '../../utils/ghoUtilities';

export const LandDashboard = () => {
  const { user } = useAppDataContext();
  const { currentMarket, currentNetworkConfig } = useProtocolDataContext();
  const [supplyInfoOpen, setSupplyInfoOpen] = useState<boolean>(true);
  const [borrowInfoOpen, setBorrowInfoOpen] = useState<boolean>(false);
  const totalBalance = useMemo(
    () => +(user?.totalLiquidityUSD || '0') - +(user?.totalBorrowsUSD || '0'),
    [user]
  );
  const trackEvent = useRootStore((store) => store.trackEvent);

  const suppliedPositions =
    user?.userReservesData
      .filter((userReserve) => userReserve.underlyingBalance !== '0')
      .map((userReserve) => ({
        ...userReserve,
        supplyAPY: userReserve.reserve.supplyAPY, // Note: added only for table sort
        reserve: {
          ...userReserve.reserve,
          ...(userReserve.reserve.isWrappedBaseAsset
            ? fetchIconSymbolAndName({
                symbol: currentNetworkConfig.baseAssetSymbol,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              })
            : {}),
        },
      })) || [];

  // Transform to the DashboardReserve schema so the sort utils can work with it
  const sortedReserves = suppliedPositions as DashboardReserve[];

  let borrowPositions =
    user?.userReservesData.reduce(
      (acc, userReserve) => {
        if (userReserve.variableBorrows !== '0') {
          acc.push({
            ...userReserve,
            borrowRateMode: InterestRate.Variable,
            reserve: {
              ...userReserve.reserve,
              ...(userReserve.reserve.isWrappedBaseAsset
                ? fetchIconSymbolAndName({
                    symbol: currentNetworkConfig.baseAssetSymbol,
                    underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                  })
                : {}),
            },
          });
        }
        if (userReserve.stableBorrows !== '0') {
          acc.push({
            ...userReserve,
            borrowRateMode: InterestRate.Stable,
            reserve: {
              ...userReserve.reserve,
              ...(userReserve.reserve.isWrappedBaseAsset
                ? fetchIconSymbolAndName({
                    symbol: currentNetworkConfig.baseAssetSymbol,
                    underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                  })
                : {}),
            },
          });
        }
        return acc;
      },
      [] as (ComputedUserReserveData & { borrowRateMode: InterestRate })[]
    ) || [];

  // Move GHO to top of borrowed positions list
  const ghoReserve = borrowPositions.filter((pos) => pos.reserve.symbol === GHO_SYMBOL);
  if (ghoReserve.length > 0) {
    borrowPositions = borrowPositions.filter((pos) => pos.reserve.symbol !== GHO_SYMBOL);
    borrowPositions.unshift(ghoReserve[0]);
  }

  const sortedBorrowingReserves = borrowPositions as DashboardReserve[];

  return (
    <section className={css.dashboardContainer}>
      <header className={css.dashboardHeader}>
        <div className={css.platformBalance}>
          <span className={css.balanceLabel}>Total Platform Balance</span>
          <FormattedNumber
            value={totalBalance}
            variant="secondary14"
            symbol={'usd'}
            sx={{
              fontSize: '22px',
              lineHeight: '22px',
              fontFamily: 'Poppins',
              fontWeight: 900,
              color: 'white',
            }}
          />
        </div>
        <div className={css.network}>
          <span className={css.networkText}>{currentNetworkConfig.name}</span>
        </div>
      </header>
      <div className={css.blockItemWrapper}>
        <h2 className={css.blockItemTitle}>Lending position</h2>
        <div className={css.blockItemBody}>
          <div className={css.blockItemSummary} onClick={() => setSupplyInfoOpen((prev) => !prev)}>
            <div className={css.blockItemLeft}>
              <Bag className={css.blockItemSummaryIcon} />
              <h3 className={css.blockItemSummaryTitle}>Lending Supply Balance</h3>
            </div>
            <div className={css.blockItemRight}>
              <div className={css.apyAndBalanceWrapper}>
                <FormattedNumber
                  value={user.totalLiquidityUSD}
                  variant="secondary14"
                  symbol={'usd'}
                  sx={{
                    fontSize: '22px',
                    lineHeight: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: '#3377FF',
                  }}
                />
                <span className={css.apy}>
                  Net APY:{' '}
                  <FormattedNumber
                    value={user.earnedAPY}
                    percent={true}
                    variant="secondary14"
                    symbol="USD"
                    sx={{
                      fontSize: '12px',
                      lineHeight: '18px',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      color: '#94A1CA',
                    }}
                  />
                </span>
              </div>
              <div className={css.arrowIconWrapper}>
                <ArrowIcon className={cn(css.arrowIcon, supplyInfoOpen && css.arrowIconActive)} />
              </div>
            </div>
          </div>
          {supplyInfoOpen && (
            <div className={css.blockItemBody}>
              <div className={css.blockItemContent}>
                <ul className={css.blockItemLabelsList}>
                  {['Asset', 'APY', 'Balance', 'Earned'].map((item, i) => (
                    <li key={i} className={css.blockItemLabelsItem}>
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className={css.assetsList}>
                  {sortedReserves.map((item, i) => (
                    <li key={i} className={css.assetsItem}>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();
                          trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
                            type: 'Row click',
                            market: currentMarket,
                            assetName: item.name,
                            asset: item.underlyingAsset,
                          });
                        }}
                        className={css.assetLink}
                        href={ROUTES.reserveOverview(item.underlyingAsset, currentMarket)}
                      >
                        <div className={css.assetsItemColumn}>
                          {
                            <TokenIcon
                              symbol={item.reserve.iconSymbol}
                              sx={{ width: 30, height: 30 }}
                              fontSize="large"
                            />
                          }
                          <span className={css.assetName}>{item.reserve.iconSymbol}</span>
                        </div>
                        <div className={css.assetsItemColumn}>
                          <FormattedNumber
                            data-cy={`apy`}
                            value={Number(item.supplyAPY)}
                            percent
                            symbol={item.symbol}
                          />
                        </div>
                        <div className={css.assetsItemColumn}>
                          <FormattedNumber
                            data-cy={`apy`}
                            value={Number(item.underlyingBalanceUSD)}
                            symbol={'usd'}
                          />
                        </div>
                        <div className={css.assetsItemColumn}>-</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className={css.blockItemBody}>
          <div className={css.blockItemSummary} onClick={() => setBorrowInfoOpen((prev) => !prev)}>
            <div className={css.blockItemLeft}>
              <PercentageIcon className={css.blockItemSummaryIcon} />
              <h3 className={css.blockItemSummaryTitle}>Lending Borrow Balance</h3>
            </div>
            <div className={css.blockItemRight}>
              <div className={css.apyAndBalanceWrapper}>
                <FormattedNumber
                  value={user?.totalBorrowsUSD}
                  variant="secondary14"
                  symbol={'usd'}
                  sx={{
                    fontSize: '22px',
                    lineHeight: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: '#DA914E',
                  }}
                />
                <span className={css.apy}>
                  Net APY:{' '}
                  <FormattedNumber
                    value={user.debtAPY}
                    percent={true}
                    variant="secondary14"
                    symbol="USD"
                    sx={{
                      fontSize: '12px',
                      lineHeight: '18px',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      color: '#94A1CA',
                    }}
                  />
                </span>
              </div>
              <div className={css.arrowIconWrapper}>
                <ArrowIcon className={cn(css.arrowIcon, borrowInfoOpen && css.arrowIconActive)} />
              </div>
            </div>
          </div>
          {borrowInfoOpen && (
            <div className={css.blockItemBody}>
              <div className={css.blockItemContent}>
                <ul className={css.blockItemLabelsList}>
                  {['Asset', 'APY', 'Balance', 'Earned'].map((item, i) => (
                    <li key={i} className={css.blockItemLabelsItem}>
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className={css.assetsList}>
                  {sortedBorrowingReserves.map((item, i) => (
                    <li key={i} className={css.assetsItem}>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();
                          trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
                            type: 'Row click',
                            market: currentMarket,
                            assetName: item.name,
                            asset: item.underlyingAsset,
                          });
                        }}
                        className={css.assetLink}
                        href={ROUTES.reserveOverview(item.underlyingAsset, currentMarket)}
                      >
                        <div className={css.assetsItemColumn}>
                          {
                            <TokenIcon
                              symbol={item.reserve.iconSymbol}
                              sx={{ width: 30, height: 30 }}
                              fontSize="large"
                            />
                          }
                          <span className={css.assetName}>{item.reserve.iconSymbol}</span>
                        </div>
                        <div className={css.assetsItemColumn}>
                          <FormattedNumber
                            data-cy={`apy`}
                            value={Number(item.supplyAPY)}
                            percent
                            symbol={item.symbol}
                          />
                        </div>
                        <div className={css.assetsItemColumn}>
                          <FormattedNumber
                            data-cy={`apy`}
                            value={Number(item.underlyingBalanceUSD)}
                            symbol={'usd'}
                          />
                        </div>
                        <div className={css.assetsItemColumn}>-</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={css.blockItemWrapper}>
        <h2 className={css.blockItemTitle}>Liquidity Pools</h2>
        <div className={css.comingSoon}>
          <span className={css.cSoonText}>Coming soon...</span>
          <button className={css.learnMoreBtn} disabled={true}>
            Learn more
          </button>
        </div>
      </div>
      <div className={css.blockItemWrapper}>
        <h2 className={css.blockItemTitle}>Reserve Funding</h2>
        <div className={css.comingSoon}>
          <span className={css.cSoonText}>Coming soon...</span>
          <span className={css.middleTextBtn}>ReserveFunding High-Yield Accounts</span>
          <button className={css.learnMoreBtn} disabled={true}>
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
};
