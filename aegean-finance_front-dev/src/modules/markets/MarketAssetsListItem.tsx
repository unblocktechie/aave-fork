import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { OffboardingTooltip } from 'src/components/infoTooltips/OffboardingToolTip';
import { RenFILToolTip } from 'src/components/infoTooltips/RenFILToolTip';
import { IsolatedEnabledBadge } from 'src/components/isolationMode/IsolatedBadge';
import { NoData } from 'src/components/primitives/NoData';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { AssetsBeingOffboarded } from 'src/components/Warnings/OffboardingWarning';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';

import { IncentivesCard } from '../../components/incentives/IncentivesCard';
import { AMPLToolTip } from '../../components/infoTooltips/AMPLToolTip';
import { ListColumn } from '../../components/lists/ListColumn';
import { ListItem } from '../../components/lists/ListItem';
import { ROUTES } from '../../components/primitives/Link';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import { MARKETS } from '../../utils/mixPanelEvents';

export const MarketAssetsListItem = ({ ...reserve }: ComputedReserveData) => {
  const router = useRouter();
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const offboardingDiscussion = AssetsBeingOffboarded[currentMarket]?.[reserve.symbol];

  return (
    <ListItem
      px={6}
      minHeight={76}
      onClick={() => {
        trackEvent(MARKETS.DETAILS_NAVIGATION, {
          type: 'Row',
          assetName: reserve.name,
          asset: reserve.underlyingAsset,
          market: currentMarket,
        });
        router.push(ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket));
      }}
      sx={{ cursor: 'pointer', marginBottom: '18px' }}
      button
      data-cy={`marketListItemListItem_${reserve.symbol.toUpperCase()}`}
    >
      <ListColumn isRow align={'right'} minWidth={320}>
        <TokenIcon symbol={reserve.iconSymbol} fontSize="large" sx={{ width: 45, height: 45 }} />
        <Box sx={{ pl: 3.5, overflow: 'hidden' }}>
          <Typography variant="h4" noWrap>
            {reserve.name}
          </Typography>

          <Box
            sx={{
              p: { xs: '0', xsm: '3.625px 0px' },
            }}
          >
            <Typography variant="subheader2" color="white" noWrap>
              {reserve.symbol}
              {reserve.isIsolated && (
                <span style={{ marginLeft: '8px' }}>
                  <IsolatedEnabledBadge />
                </span>
              )}
            </Typography>
          </Box>
        </Box>
        {reserve.symbol === 'AMPL' && <AMPLToolTip />}
        {reserve.symbol === 'renFIL' && <RenFILToolTip />}
        {offboardingDiscussion && <OffboardingTooltip discussionLink={offboardingDiscussion} />}
      </ListColumn>

      <ListColumn align={'right'}>
        <ReserveSubheader value={reserve.totalLiquidityUSD} />
      </ListColumn>

      <ListColumn align={'right'}>
        <IncentivesCard
          value={reserve.supplyAPY}
          incentives={reserve.aIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
          color={'white'}
        />
      </ListColumn>

      <ListColumn align={'right'}>
        {reserve.borrowingEnabled || Number(reserve.totalDebt) > 0 ? (
          <>
            <ReserveSubheader value={reserve.totalDebtUSD} />
          </>
        ) : (
          <NoData variant={'secondary14'} color="text.secondary" />
        )}
      </ListColumn>

      <ListColumn align={'right'}>
        <IncentivesCard
          value={Number(reserve.totalVariableDebtUSD) > 0 ? reserve.variableBorrowAPY : '-1'}
          incentives={reserve.vIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
          color={'white'}
        />
        {!reserve.borrowingEnabled &&
          Number(reserve.totalVariableDebt) > 0 &&
          !reserve.isFrozen && <ReserveSubheader value={'Disabled'} />}
      </ListColumn>
      {/*
      <ListColumn>
        <IncentivesCard
          value={Number(reserve.totalStableDebtUSD) > 0 ? reserve.stableBorrowAPY : '-1'}
          incentives={reserve.sIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled && Number(reserve.totalStableDebt) > 0 && !reserve.isFrozen && (
          <ReserveSubheader value={'Disabled'} />
        )}
      </ListColumn> */}
    </ListItem>
  );
};
