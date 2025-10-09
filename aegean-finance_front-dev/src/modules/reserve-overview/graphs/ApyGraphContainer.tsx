import { Trans } from '@lingui/macro';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { ParentSize } from '@visx/responsive';
import React, { useState } from 'react';
import type { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ReserveRateTimeRange, useReserveRatesHistory } from 'src/hooks/useReservesHistory';
import { MarketDataType } from 'src/utils/marketsAndNetworksConfig';

import { ESupportedTimeRanges } from '../TimeRangeSelector';
import { ApyGraph } from './ApyGraph';
import css from '../styles.module.scss';
import { GraphTimeRangeSelector } from './GraphTimeRangeSelector';
import { ReserveSubheader } from '../../../components/ReserveSubheader';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import BigNumber from 'bignumber.js';
import BarGraph from './BarGraph';
import { toNormalFixed } from '../../../utils/utils';
import { useAssetCaps } from '../../../hooks/useAssetCaps';

type Field =
  | 'liquidityRate'
  | 'stableBorrowRate'
  | 'variableBorrowRate'
  | 'totalATokenSupply'
  | 'availableLiquidity';

type Fields = { name: Field; color: string; text: string }[];

type ApyGraphContainerKey = 'supply' | 'borrow';

type ApyGraphContainerProps = {
  graphKey: ApyGraphContainerKey;
  reserve: ComputedReserveData;
  currentMarketData: MarketDataType;
  aggregatedStats: { totalLiquidity: BigNumber; totalDebt: BigNumber };
};

/**
 * NOTES:
 * This may not be named accurately.
 * This container uses the same graph but with different fields, so we use a 'graphKey' to determine which to show
 * This likely may need to be turned into two different container components if the graphs become wildly different.
 * This graph gets its data via an external API call, thus having loading/error states
 */

export const ApyGraphContainer = ({
  graphKey,
  reserve,
  currentMarketData,
  aggregatedStats,
}: ApyGraphContainerProps): JSX.Element => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<ReserveRateTimeRange>(
    ESupportedTimeRanges.OneMonth
  );
  const CHART_HEIGHT = 255;
  const isPolygonMarket = currentMarketData.chainId === 80001 || currentMarketData.chainId === 137;
  const CHART_HEIGHT_LOADING_FIX = 3.5;
  let reserveAddress = '';
  if (reserve) {
    if (currentMarketData.v3) {
      reserveAddress = `${reserve.underlyingAsset}${currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER}${currentMarketData.chainId}`;
    } else {
      reserveAddress = `${reserve.underlyingAsset}${currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER}`;
    }
  }
  const { loading, error, refetch, data } = useReserveRatesHistory(
    reserveAddress,
    selectedTimeRange
  );
  const { borrowCap } = useAssetCaps();
  // Supply fields
  const supplyFields: Fields = isPolygonMarket
    ? [{ name: 'totalATokenSupply', color: '#2EBAC6', text: 'Total supply' }]
    : [{ name: 'liquidityRate', color: '#2EBAC6', text: 'Supply APR' }];
  // Borrow fields
  const borrowFields: Fields = [
    ...(reserve.stableBorrowRateEnabled
      ? ([
          {
            name: 'stableBorrowRate',
            color: '#E7C6DF',
            text: 'Borrow APR, stable',
          },
        ] as const)
      : []),
    {
      name: 'variableBorrowRate',
      color: '#B6509E',
      text: 'Borrow APR, variable',
    },
  ];

  const fields = graphKey === 'supply' ? supplyFields : borrowFields;
  const graphDetails = [
    { label: 'Price', value: `$${toNormalFixed(reserve.priceInUSD, 2)}` },
    { label: 'Market Liqudity', value: aggregatedStats?.totalLiquidity || '0', formatted: true },
    { label: 'Borrowcap used', value: `${borrowCap?.percentUsed || 0}%` },
    //{ label: 'Reserves?', value: '269.88 ETH' },
    { label: 'Reserve Factor', value: `${reserve.reserveFactor}` },
    //{ label: 'Collateral Factor?', value: '75%' }, //(+user.healthFactor * +reserve.totalDebt) / +reserve.totalLiquidity
    //{ label: `${reserve.iconSymbol} Minted?`, value: '122,288,703' },
    {
      label: 'Exchange Rate',
      value: `1 ${reserve.iconSymbol}= ${reserve.formattedPriceInMarketReferenceCurrency} ETH`,
    },
  ];

  const graphLoading = (
    <Box
      sx={{
        height: CHART_HEIGHT + CHART_HEIGHT_LOADING_FIX,
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={20} sx={{ mb: 2, opacity: 0.5 }} />
      <Typography variant="subheader1" color="text.muted">
        <Trans>Loading data...</Trans>
      </Typography>
    </Box>
  );

  const graphError = (
    <Box
      sx={{
        height: CHART_HEIGHT + CHART_HEIGHT_LOADING_FIX,
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="subheader1">
        <Trans>Something went wrong</Trans>
      </Typography>
      <Typography variant="caption" sx={{ mb: 3 }}>
        <Trans>No data, reload the graph or choose other period.</Trans>
      </Typography>
      <Button variant="outlined" color="primary" onClick={refetch}>
        <Trans>Reload</Trans>
      </Button>
    </Box>
  );
  return (
    <Box sx={{ mt: 10, mb: 4 }}>
      <ul className={css.graphInfoList}>
        <li className={css.graphInfoItem} style={{ gap: 2 }}>
          <span className={css.graphInfoLabel}>Net Rate</span>
          <span className={css.graphInfoValue}>
            <FormattedNumber
              value={reserve.supplyAPR}
              percent
              variant="main16"
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
          </span>
        </li>
        <li className={css.graphInfoItem} style={{ gap: 2 }}>
          <span className={css.graphInfoLabel}>Supply APY</span>
          <span className={css.graphInfoValue}>
            <FormattedNumber
              value={reserve.supplyAPY}
              percent
              variant="main16"
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
          </span>
        </li>
        <li className={css.graphInfoItem}>
          <span className={css.graphInfoLabel}>Total Supply</span>
          <span className={css.graphInfoValue}>
            $<ReserveSubheader value={reserve.totalLiquidityUSD} isWithoutSymbol={true} />
          </span>
        </li>
      </ul>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          pr: '24px',
        }}
      >
        <div />
        <GraphTimeRangeSelector
          disabled={loading}
          timeRange={selectedTimeRange}
          onTimeRangeChanged={setSelectedTimeRange}
        />
      </Box>
      {loading && graphLoading}
      {error && graphError}
      {!loading && data.length > 0 && (
        <ParentSize>
          {({ width }) => (
            <ApyGraph
              width={width}
              height={CHART_HEIGHT}
              data={data}
              fields={fields}
              selectedTimeRange={selectedTimeRange}
              avgFieldName={graphKey === 'supply' ? 'liquidityRate' : 'variableBorrowRate'}
            />
          )}
        </ParentSize>
      )}
      {isPolygonMarket && graphKey === 'supply' && (
        <ParentSize>
          {({ width }) => (
            <BarGraph
              width={width}
              height={100}
              data={data}
              fields={[
                { name: 'availableLiquidity', color: '#2EBAC6', text: 'Available Liquidity' },
              ]}
              selectedTimeRange={selectedTimeRange}
              avgFieldName={graphKey === 'supply' ? 'liquidityRate' : 'variableBorrowRate'}
            />
          )}
        </ParentSize>
      )}
      <ul className={css.graphDetailsList}>
        {graphDetails.map((item, i) => (
          <li key={i} className={css.graphDetailsItem}>
            <span className={css.graphDetailsLabel}>{item.label}</span>
            {item.formatted ? (
              <FormattedNumber
                value={item.value.toString()}
                symbol="USD"
                visibleDecimals={2}
                compact
                symbolsColor="white"
                sx={{ fontFamily: 'Poppins', fontWeight: 600, color: 'white' }}
              />
            ) : (
              <span className={css.graphDetailsValue}>{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
};
