import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { LegendOrdinal } from '@visx/legend';
import css from './styles.module.scss';
import BigNumber from 'bignumber.js';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import { calcPercentage } from 'src/utils/utils';

interface PropsTypes {
  stats: {
    tSupplied: number;
    tBorrowed: number;
    tLiquidity: number;
  };
  aggregatedStats: { totalLiquidity: BigNumber; totalDebt: BigNumber };
}

export const MarketBorrowSupplyChart = ({ stats, aggregatedStats }: PropsTypes) => {
  const data = [
    { label: 'Total Supply', value: stats.tSupplied },
    { label: 'Total Borrowed', value: stats.tBorrowed },
  ];
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const value = (d: any) => d.value;

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.label),
    range: ['#00D395', '#EA9650'],
  });

  const width = 128;
  const height = 128;
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius / 1.9;
  const outerRadius = (index: number) => (index === 0 ? radius : radius * 0.93);

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <div className={css.marketChartWrapper}>
      <span className={css.marketInfoItemTitle}>Market Overview</span>
      <div className={css.marketChartBody}>
        <svg width={width} height={height} style={{ marginTop: 10 }}>
          <Group top={height / 2} left={width / 2}>
            <Pie
              data={data}
              pieValue={value}
              innerRadius={innerRadius}
              cornerRadius={0}
              padAngle={0.001}
            >
              {(pie) => {
                return pie.arcs.map((arc, index) => {
                  const arcData = arc.data;
                  const path = pie.path.outerRadius(outerRadius(index))(arc);
                  return (
                    <g key={`arc-${arcData.label}-${index}`}>
                      <path d={path || undefined} fill={colorScale(arcData.label) || undefined} />
                    </g>
                  );
                });
              }}
            </Pie>
          </Group>
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
        </svg>
        <div className={css.marketChartInfo}>
          <div className={css.tSupply}>
            <span className={css.dot} /> <span className={css.tSupplyLabel}>Total Supply</span>
            <br />
            <FormattedNumber
              value={aggregatedStats.totalLiquidity.minus(aggregatedStats.totalDebt).toString()}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              compact
              symbol={'USD'}
              symbolsColor="white"
              symbolsVariant={symbolsVariant}
              sx={{
                fontFamily: 'Poppins',
                fontSize: 16,
                lineHeight: '16px',
                fontWeight: 600,
                color: 'white',
                paddingLeft: 3,
              }}
            />{' '}
            <span className={css.percentage}>
              ({calcPercentage(stats.tSupplied, stats.tLiquidity)}%)
            </span>
          </div>
          <div className={cn(css.tSupply, css.tBorrowed)}>
            <span className={css.dot} /> <span className={css.tSupplyLabel}>Total Borrowed</span>
            <br />
            <FormattedNumber
              value={aggregatedStats.totalDebt.toString()}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              compact
              symbol={'USD'}
              symbolsColor="white"
              symbolsVariant={symbolsVariant}
              sx={{
                fontFamily: 'Poppins',
                fontSize: 16,
                lineHeight: '16px',
                fontWeight: 600,
                color: 'white',
                paddingLeft: 3,
              }}
            />{' '}
            <span className={css.percentage}>
              ({calcPercentage(stats.tBorrowed, stats.tLiquidity)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
