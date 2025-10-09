import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { EyeIcon } from '@heroicons/react/solid';
import { Box, Button, ListItemText, Menu, MenuItem, SvgIcon } from '@mui/material';
import { useState } from 'react';
import { NoData } from 'src/components/primitives/NoData';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';
import { DASHBOARD } from 'src/utils/mixPanelEvents';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { ListColumn } from '../../../../components/lists/ListColumn';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListItemCanBeCollateral } from '../ListItemCanBeCollateral';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { PlusIcon } from '../../../../assets/svgComponents/PlusIcon';
import { useRouter } from 'next/router';

export const SupplyAssetsListItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  supplyCap,
  totalLiquidity,
  supplyAPY,
  aIncentivesData,
  underlyingAsset,
  isActive,
  isFreezed,
  isIsolated,
  usageAsCollateralEnabledOnUser,
  detailsAddress,
  isPaused,
}: DashboardReserve) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const currentMarket = useRootStore((store) => store.currentMarket);
  const { openSupply, openSwitch, setOpenWithdrawModalData } = useModalContext();
  const router = useRouter();
  // Disable the asset to prevent it from being supplied if supply cap has been reached
  const { supplyCap: supplyCapUsage, debtCeiling } = useAssetCaps();
  const isMaxCapReached = supplyCapUsage.isMaxed;

  const trackEvent = useRootStore((store) => store.trackEvent);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const disableSupply =
    !isActive || isPaused || isFreezed || Number(walletBalance) <= 0 || isMaxCapReached;

  const onDetailsClick = () => {
    trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
      type: 'Button',
      market: currentMarket,
      assetName: name,
      asset: underlyingAsset,
    });
    setAnchorEl(null);
  };

  const handleSwitchClick = () => {
    openSwitch(underlyingAsset);
    setAnchorEl(null);
  };

  return (
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={detailsAddress}
      data-cy={`dashboardSupplyListItem_${symbol.toUpperCase()}`}
      currentMarket={currentMarket}
      showDebtCeilingTooltips
      pl={14}
      onClick={() => {
        router.push(ROUTES.reserveOverview(detailsAddress, currentMarket));
      }}
    >
      <Box sx={{ mr: 5 }}>
        {/*<Button
          disabled={disableSupply}
          variant="contained"
          onClick={() => {
            openSupply(underlyingAsset, currentMarket, name, 'dashboard');
          }}
        >
          <Trans>Supply</Trans>
        </Button>*/}
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
            if (!disableSupply) {
              openSupply(underlyingAsset, currentMarket, name, 'dashboard');
              setOpenWithdrawModalData({
                underlyingAsset,
                currentMarket,
                name: name,
                funnel: 'dashboard',
                active: false,
              });
            }
          }}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PlusIcon />
        </Button>
        <Menu
          id="supply-item-extra-menu"
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'supply-extra-button',
            sx: {
              py: 0,
            },
          }}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          keepMounted={true}
          PaperProps={{
            sx: {
              minWidth: '120px',
              py: 0,
            },
          }}
        >
          <MenuItem
            sx={{ gap: 2 }}
            onClick={handleSwitchClick}
            disabled={!isFeatureEnabled.switch(currentMarketData)}
          >
            <SvgIcon fontSize="small">
              <SwitchHorizontalIcon />
            </SvgIcon>
            <ListItemText>Switch</ListItemText>
          </MenuItem>
          <MenuItem
            sx={{ gap: 2 }}
            component={Link}
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
            onClick={onDetailsClick}
          >
            <SvgIcon fontSize="small">
              <EyeIcon />
            </SvgIcon>
            <ListItemText>Details</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <ListValueColumn
        symbol={symbol}
        value={Number(walletBalance)}
        subValue={walletBalanceUSD}
        withTooltip={false}
        disabled={Number(walletBalance) === 0 || isMaxCapReached}
        capsComponent={
          <CapsHint
            capType={CapType.supplyCap}
            capAmount={supplyCap}
            totalAmount={totalLiquidity}
            withoutText
          />
        }
      />

      <ListAPRColumn value={Number(supplyAPY)} incentives={aIncentivesData} symbol={symbol} />

      <ListColumn>
        {debtCeiling.isMaxed ? (
          <NoData variant="main14" color="text.secondary" />
        ) : (
          <ListItemCanBeCollateral
            isIsolated={isIsolated}
            usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
          />
        )}
      </ListColumn>
    </ListItemWrapper>
  );
};
