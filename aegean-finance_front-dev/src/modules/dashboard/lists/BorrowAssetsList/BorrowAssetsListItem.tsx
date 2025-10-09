import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { DASHBOARD } from 'src/utils/mixPanelEvents';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { InterestRate } from '@aave/contract-helpers';
import { PlusIcon } from '../../../../assets/svgComponents/PlusIcon';
import { Button } from '@mui/material';
import { ROUTES } from '../../../../components/primitives/Link';
import { useRouter } from 'next/router';

export const BorrowAssetsListItem = ({
  symbol,
  iconSymbol,
  name,
  availableBorrows,
  availableBorrowsInUSD,
  borrowCap,
  totalBorrows,
  variableBorrowRate,
  vIncentivesData,
  underlyingAsset,
  isFreezed,
}: DashboardReserve) => {
  const { openBorrow, setOpenBorrowModalData, setOpenRepayModalData } = useModalContext();
  const { currentMarket } = useProtocolDataContext();

  const disableBorrow = isFreezed || Number(availableBorrows) <= 0;
  const router = useRouter();

  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={underlyingAsset}
      data-cy={`dashboardBorrowListItem_${symbol.toUpperCase()}`}
      currentMarket={currentMarket}
      pl={14}
      onClick={() => {
        router.push(ROUTES.reserveOverview(underlyingAsset, currentMarket));
      }}
    >
      <Button
        id="supply-extra-button"
        sx={{
          position: 'absolute',
          left: 13,
          top: 12,
          width: '25px',
          maxWidth: '25px',
          minWidth: '25px',
          height: '25px',
          maxHeight: '25px',
          p: 0,
          borderRadius: '50%',
          background: '#2F3F70',
          '&:hover': {
            background: '#3377FF',
          },
          'MuiButton-root': {
            width: '25px',
            maxWidth: '25px',
            minWidth: '25px',
            height: '25px',
            maxHeight: '25px',
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disableBorrow) {
            trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
              type: 'Button',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
            });
            setOpenBorrowModalData({
              underlyingAsset,
              currentMarket,
              name,
              funnel: 'dashboard',
              active: !disableBorrow,
            });
            setOpenRepayModalData({
              underlyingAsset,
              currentRateMode: InterestRate.Stable,
              isFrozen: false,
              currentMarket,
              name,
              funnel: 'dashboard',
              active: false,
            });
            openBorrow(underlyingAsset, currentMarket, name, 'dashboard');
          }
        }}
        aria-controls={'basic-menu'}
        aria-haspopup="true"
      >
        <PlusIcon />
      </Button>
      <ListValueColumn
        symbol={symbol}
        value={Number(availableBorrows)}
        subValue={Number(availableBorrowsInUSD)}
        disabled={Number(availableBorrows) === 0}
        withTooltip={false}
        capsComponent={
          <CapsHint
            capType={CapType.borrowCap}
            capAmount={borrowCap}
            totalAmount={totalBorrows}
            withoutText
          />
        }
      />
      <ListAPRColumn
        value={Number(variableBorrowRate)}
        incentives={vIncentivesData}
        symbol={symbol}
      />
      {/* <ListAPRColumn
        value={Number(stableBorrowRate)}
        incentives={sIncentivesData}
        symbol={symbol}
      /> */}
      {/*<ListButtonsColumn>
        <Button
          disabled={disableBorrow}
          variant="contained"
          onClick={() => {
            openBorrow(underlyingAsset, currentMarket, name, 'dashboard');
          }}
        >
          <Trans>Borrow</Trans>
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
          onClick={() => {
            trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
              type: 'Button',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
            });
          }}
        >
          <Trans>Details</Trans>
        </Button>
      </ListButtonsColumn>*/}
    </ListItemWrapper>
  );
};
