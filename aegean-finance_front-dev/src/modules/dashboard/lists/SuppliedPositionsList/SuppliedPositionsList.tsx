import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Fragment, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { AssetCapsProvider } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { CollateralSwitchTooltip } from '../../../../components/infoTooltips/CollateralSwitchTooltip';
import { CollateralTooltip } from '../../../../components/infoTooltips/CollateralTooltip';
import { TotalSupplyAPYTooltip } from '../../../../components/infoTooltips/TotalSupplyAPYTooltip';
import { ListWrapper } from '../../../../components/lists/ListWrapper';
import { useAppDataContext } from '../../../../hooks/app-data-provider/useAppDataProvider';
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
  DashboardReserve,
  handleSortDashboardReserves,
} from '../../../../utils/dashboardSortUtils';
import { ListTopInfoItem } from '../ListTopInfoItem';
import { DashboardContentNoData } from '../../DashboardContentNoData';
import { ListLoader } from '../ListLoader';
import { SuppliedPositionsListItem } from './SuppliedPositionsListItem';
import { SuppliedPositionsListMobileItem } from './SuppliedPositionsListMobileItem';

const head = [
  {
    title: <Trans>Asset</Trans>,
    sortKey: 'symbol',
    maxWidth: '100%',
  },
  {
    title: <Trans key="APY">APY / Earned</Trans>,
    sortKey: 'supplyAPY',
  },
  {
    title: <Trans key="Balance">Balance</Trans>,
    sortKey: 'underlyingBalance',
  },
  {
    title: (
      <CollateralSwitchTooltip
        event={{
          eventName: GENERAL.TOOL_TIP,
          eventParams: { tooltip: 'Collateral Switch' },
        }}
        text={<Trans>Collateral</Trans>}
        key="Collateral"
        variant="subheader2"
      />
    ),
    sortKey: 'usageAsCollateralEnabledOnUser',
  },
];

export const SuppliedPositionsList = () => {
  const { user, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

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
  const preSortedReserves = suppliedPositions as DashboardReserve[];
  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    'position',
    preSortedReserves
  );

  const RenderHeader: React.FC = () => {
    return (
      <ListHeaderWrapper isWithBorder={true}>
        {head.map((col, i) => (
          <ListColumn
            isRow={col.sortKey === 'symbol'}
            maxWidth={col.sortKey === 'symbol' ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET : undefined}
            key={col.sortKey}
          >
            <ListHeaderTitle
              sortName={sortName}
              sortDesc={sortDesc}
              setSortName={setSortName}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source="Supplied Positions Dashboard"
              isFirst={i === 0}
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}
      </ListHeaderWrapper>
    );
  };

  if (loading)
    return <ListLoader title={<Trans>My supplies</Trans>} head={head.map((col) => col.title)} />;

  return (
    <ListWrapper
      tooltipOpen={tooltipOpen}
      withBorder={true}
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>My Supply</Trans>
        </Typography>
      }
      localStorageName="suppliedAssetsDashboardTableCollapse"
      noData={!sortedReserves.length}
      topInfo={
        <>
          {!!sortedReserves.length && (
            <>
              <ListTopInfoItem
                title={<Trans>APY</Trans>}
                value={user?.earnedAPY || 0}
                percent
                tooltip={
                  <TotalSupplyAPYTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: 'Total Supplied APY' },
                    }}
                  />
                }
              />
              <ListTopInfoItem
                title={<Trans>Collateral</Trans>}
                value={user?.totalCollateralUSD || 0}
                tooltip={
                  <CollateralTooltip
                    setOpen={setTooltipOpen}
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: { tooltip: 'Total Supplied Collateral' },
                    }}
                  />
                }
              />
            </>
          )}
        </>
      }
    >
      {sortedReserves.length ? (
        <>
          {!downToXSM && <RenderHeader />}
          {sortedReserves.map((item) => (
            <Fragment key={item.underlyingAsset}>
              <AssetCapsProvider asset={item.reserve}>
                {downToXSM ? (
                  <SuppliedPositionsListMobileItem {...item} />
                ) : (
                  <SuppliedPositionsListItem {...item} />
                )}
              </AssetCapsProvider>
            </Fragment>
          ))}
        </>
      ) : (
        <DashboardContentNoData text={<Trans>Nothing supplied yet</Trans>} />
      )}
    </ListWrapper>
  );
};
