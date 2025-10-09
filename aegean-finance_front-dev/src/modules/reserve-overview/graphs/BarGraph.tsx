import React, { useMemo, useCallback } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { AreaProps, formatDate, TooltipData } from './ApyGraph';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { max } from 'd3-array';
import { Typography, useTheme } from '@mui/material';
import css from '../styles.module.scss';
import { toNormalFixed } from '../../../utils/utils';

// Припустимо, що `data` вже сортовано за датою і є у нашому компоненті як prop
const BarGraph = withTooltip<AreaProps, TooltipData>(
  ({
    width,
    height,
    data,
    tooltipLeft,
    tooltipData,
    showTooltip,
    hideTooltip,
    selectedTimeRange,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    const theme = useTheme();

    const tooltipStyles = {
      ...defaultStyles,
      padding: '8px 12px',
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.15px',
      border: '1px solid #3377FF',
    };
    const tooltipStylesDark = {
      ...tooltipStyles,
      background: theme.palette.background.default,
    };

    const xScale = useMemo(
      () =>
        scaleBand({
          range: [0, width],
          round: true,
          domain: data.map((d) => d.date),
          padding: 0.25,
        }),
      [data, width]
    );

    const yScale = useMemo(
      () =>
        scaleLinear({
          range: [height, 0],
          round: true,
          domain: [0, max(data, (d) => d.availableLiquidity as any)],
        }),
      [data, height]
    );

    const handleMouseOver = useCallback(
      (event, d) => {
        const coords = localPoint(event) || { x: 0, y: 0 };
        showTooltip({
          tooltipData: d,
          tooltipLeft: coords.x,
          tooltipTop: coords.y,
        });
      },
      [showTooltip]
    );
    return (
      <>
        <svg width={'100%'} height={height} className={css.graphWrapper}>
          <Group width={'100%'}>
            {data.map((d, i) => (
              <Bar
                key={`bar-${i}`}
                x={xScale(d.date)}
                y={yScale(d.availableLiquidity)}
                height={height - yScale(d.availableLiquidity)}
                width={xScale.bandwidth()}
                fill="#16316E"
                onMouseOver={(event) => handleMouseOver(event, d)}
                onMouseOut={hideTooltip}
              />
            ))}
          </Group>
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              top={20}
              left={(tooltipLeft || 0) + 40}
              style={theme.palette.mode === 'light' ? tooltipStyles : tooltipStylesDark}
            >
              <div style={{ display: 'flex' }}>
                <Typography variant="caption" color="#94A1CA" sx={{ mr: 2 }}>
                  {formatDate(new Date(tooltipData.date), selectedTimeRange)}
                </Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <Typography variant="caption" color="#94A1CA" sx={{ mr: 2 }}>
                  Available Liquidity
                </Typography>
                <Typography variant="main12" color="text.primary">
                  ${toNormalFixed(tooltipData.availableLiquidity, 4)}
                </Typography>
              </div>
            </TooltipWithBounds>
          </div>
        )}
      </>
    );
  }
);

export default withTooltip(BarGraph);
