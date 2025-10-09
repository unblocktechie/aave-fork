import { Trans } from '@lingui/macro';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { IncentivesCard } from '../../../../components/incentives/IncentivesCard';
import { Row } from '../../../../components/primitives/Row';
import { useModalContext } from '../../../../hooks/useModal';
import { useProtocolDataContext } from '../../../../hooks/useProtocolDataContext';
import { isFeatureEnabled } from '../../../../utils/marketsAndNetworksConfig';
import { ListItemUsedAsCollateral } from '../ListItemUsedAsCollateral';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';

export const SuppliedPositionsListMobileItem = ({
  reserve,
  underlyingBalance,
  underlyingBalanceUSD,
  usageAsCollateralEnabledOnUser,
  underlyingAsset,
}: DashboardReserve) => {
  const { user } = useAppDataContext();
  const { currentMarketData, currentMarket } = useProtocolDataContext();
  const {
    openSupply,
    openSwap,
    openCollateralChange,
    setOpenWithdrawModalData,
    setOpenSupplyModalData,
  } = useModalContext();
  const { debtCeiling } = useAssetCaps();
  const isSwapButton = isFeatureEnabled.liquiditySwap(currentMarketData);
  const {
    symbol,
    iconSymbol,
    name,
    supplyAPY,
    isIsolated,
    aIncentivesData,
    isFrozen,
    isActive,
    isPaused,
  } = reserve;

  const canBeEnabledAsCollateral =
    !debtCeiling.isMaxed &&
    reserve.reserveLiquidationThreshold !== '0' &&
    ((!reserve.isIsolated && !user.isInIsolationMode) ||
      user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset ||
      (reserve.isIsolated && user.totalCollateralMarketReferenceCurrency === '0'));

  const disableSwap = !isActive || isPaused || reserve.symbol == 'stETH';
  const disableWithdraw = !isActive || isPaused;
  const disableSupply = !isActive || isFrozen || isPaused;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      showSupplyCapTooltips
      showDebtCeilingTooltips
      onClick={() => {
        if (isSwapButton && !disableSwap) {
          openSwap(underlyingAsset);
        } else {
          if (!disableSupply) {
            openSupply(underlyingAsset, currentMarket, reserve.name, 'dashboard');
            setOpenWithdrawModalData({
              underlyingAsset,
              currentMarket,
              name: reserve.name,
              funnel: 'dashboard',
              active: !disableWithdraw,
            });
            setOpenSupplyModalData({
              underlyingAsset,
              currentMarket,
              name: reserve.name,
              funnel: 'dashboard',
              active: !disableSupply,
            });
          }
        }
      }}
    >
      <Row
        caption={<Trans>Supply APY</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(supplyAPY)}
          incentives={aIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <ListValueRow
        title={<Trans>Supply balance</Trans>}
        value={Number(underlyingBalance)}
        subValue={Number(underlyingBalanceUSD)}
        disabled={Number(underlyingBalance) === 0}
        color={'#3377FF'}
      />

      <Row
        caption={<Trans>Used as collateral</Trans>}
        align={isIsolated ? 'flex-start' : 'center'}
        captionVariant="description"
        mb={2}
      >
        <ListItemUsedAsCollateral
          disabled={reserve.isPaused}
          isIsolated={isIsolated}
          usageAsCollateralEnabledOnUser={usageAsCollateralEnabledOnUser}
          canBeEnabledAsCollateral={canBeEnabledAsCollateral}
          onToggleSwitch={() =>
            openCollateralChange(
              underlyingAsset,
              currentMarket,
              reserve.name,
              'dashboard',
              usageAsCollateralEnabledOnUser
            )
          }
        />
      </Row>
    </ListMobileItemWrapper>
  );
};
