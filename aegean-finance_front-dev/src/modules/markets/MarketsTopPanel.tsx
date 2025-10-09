import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { marketContainerProps } from 'pages/markets.page';
import * as React from 'react';

import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import css from './styles.module.scss';
import { MarketBorrowSupplyChart } from './MarketBorrowSupplyChart';
import { normalize } from '@aave/math-utils';
import { BorrowSupplyTop } from './BorrowSupplyTop';

export const MarketsTopPanel = () => {
  const { reserves, loading } = useAppDataContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const aggregatedStats = reserves.reduce(
    (acc, reserve) => {
      return {
        totalLiquidity: acc.totalLiquidity.plus(reserve.totalLiquidityUSD),
        totalDebt: acc.totalDebt.plus(reserve.totalDebtUSD),
      };
    },
    {
      totalLiquidity: valueToBigNumber(0),
      totalDebt: valueToBigNumber(0),
    }
  );

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel containerProps={marketContainerProps} pageTitle={<Trans>Market Overview</Trans>}>
      <div className={css.marketInfoItemWrapper}>
        <div className={css.marketInfoItem}>
          <span className={css.marketInfoItemTitle}>Total Supply</span>
          <div className={css.valueWrapper}>
            {loading ? (
              <Skeleton width={130} height={34} />
            ) : (
              <>
                $
                <FormattedNumber
                  value={aggregatedStats.totalLiquidity.minus(aggregatedStats.totalDebt).toString()}
                  variant={valueTypographyVariant}
                  visibleDecimals={2}
                  compact
                  symbolsColor="white"
                  symbolsVariant={symbolsVariant}
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: 34,
                    lineHeight: '34px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className={css.marketInfoItem}>
          <span className={css.marketInfoItemTitle}>Total Borrow</span>
          <div className={css.valueWrapper}>
            {loading ? (
              <Skeleton width={100} height={34} />
            ) : (
              <>
                $
                <FormattedNumber
                  value={aggregatedStats.totalDebt.toString()}
                  variant={valueTypographyVariant}
                  visibleDecimals={2}
                  compact
                  symbolsColor="white"
                  symbolsVariant={symbolsVariant}
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: 34,
                    lineHeight: '34px',
                    fontWeight: 700,
                    color: 'white',
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className={css.chartAndTopWrapper}>
        <MarketBorrowSupplyChart
          aggregatedStats={aggregatedStats}
          stats={{
            tBorrowed: +normalize(aggregatedStats.totalDebt, 0) || 0,
            tSupplied:
              +normalize(aggregatedStats.totalLiquidity.minus(aggregatedStats.totalDebt), 0) || 0,
            tLiquidity: +normalize(aggregatedStats.totalLiquidity, 0) || 0,
          }}
        />
        <BorrowSupplyTop
          reserves={reserves}
          marketTotalLiquidity={+normalize(aggregatedStats.totalLiquidity, 0) || 0}
          marketTotalBorrowed={+normalize(aggregatedStats.totalDebt, 0) || 0}
        />
      </div>
    </TopInfoPanel>
  );
};
