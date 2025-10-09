import React from 'react';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import css from './styles.module.scss';
import { calcPercentage } from '../../utils/utils';

function sortAssets(assets: ComputedReserveData[]) {
  const convertedAssets = assets.map((asset) => ({
    ...asset,
    availableLiquidity: +asset.availableLiquidity,
    totalDebt: +asset.totalDebt,
  }));

  const topLiquidity = convertedAssets
    .sort((a, b) => b.availableLiquidity - a.availableLiquidity)
    .slice(0, 3);

  const topDebt = convertedAssets.sort((a, b) => b.totalDebt - a.totalDebt).slice(0, 3);

  return { topLiquidity, topDebt };
}

interface PropsTypes {
  reserves: ComputedReserveData[];
  marketTotalLiquidity: number;
  marketTotalBorrowed: number;
}

export const BorrowSupplyTop = ({ reserves, marketTotalLiquidity, marketTotalBorrowed }: PropsTypes) => {
  const { topLiquidity, topDebt } = sortAssets(reserves);
  return (
    <div className={css.borrowSupplyTopWrapper}>
      <span className={css.marketInfoItemTitle}>Top 3 Assets</span>
      <div className={css.borrowSupplyTopBody}>
        <div className={css.supplyTop}>
          <span className={css.tSupplyLabel}>Supply</span>
          <ul className={css.topList}>
            {topLiquidity.map((item, i) => (
              <li key={i} className={css.topItem}>
                <div className={css.topItemInfo}>
                  <span className={css.symbol}>{item.symbol}</span>
                  <span className={css.percentage}>
                    {calcPercentage(+item.availableLiquidityUSD, marketTotalLiquidity)}%
                  </span>
                </div>
                <div className={css.sliderWrapper}>
                  <div
                    className={css.sliderActive}
                    style={{
                      width: `${calcPercentage(
                        +item.availableLiquidityUSD,
                        marketTotalLiquidity
                      )}%`,
                    }}
                  />
                  <div className={css.sliderNonActive} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={css.borrowTop}>
          <span className={css.tSupplyLabel}>Borrow</span>
          <ul className={css.topList}>
            {topDebt.map((item, i) => (
              <li key={i} className={css.topItem}>
                <div className={css.topItemInfo}>
                  <span className={css.symbol}>{item.symbol}</span>
                  <span className={css.percentage}>
                    {calcPercentage(+item.totalDebtUSD, marketTotalBorrowed)}%
                  </span>
                </div>
                <div className={css.sliderWrapper}>
                  <div
                    className={css.sliderActive}
                    style={{
                      width: `${calcPercentage(+item.totalDebtUSD, marketTotalBorrowed)}%`,
                    }}
                  />
                  <div className={css.sliderNonActive} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
