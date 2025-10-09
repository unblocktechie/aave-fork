import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { AlertTitle, Box, Typography } from '@mui/material';
import { CapsCircularStatus } from 'src/components/caps/CapsCircularStatus';
import { LiquidationPenaltyTooltip } from 'src/components/infoTooltips/LiquidationPenaltyTooltip';
import { LiquidationThresholdTooltip } from 'src/components/infoTooltips/LiquidationThresholdTooltip';
import { MaxLTVTooltip } from 'src/components/infoTooltips/MaxLTVTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { Warning } from 'src/components/primitives/Warning';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import {
  ComputedReserveData,
  ComputedUserReserveData,
  ExtendedFormattedUser,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { AssetCapHookData, useAssetCaps } from 'src/hooks/useAssetCaps';
import {
  isFeatureEnabled,
  MarketDataType,
  NetworkConfig,
} from 'src/utils/marketsAndNetworksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { PanelItem } from './ReservePanels';
import React, { useMemo, useState } from 'react';
import { PercentageInput } from './PercentageInput';
import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { useRootStore } from '../../store/root';
import { getMaxAmountAvailableToSupply } from '../../utils/getMaxAmountAvailableToSupply';
import BigNumber from 'bignumber.js';
import { getAssetCollateralType } from '../../components/transactions/utils';
import { IsolationModeWarning } from '../../components/transactions/Warnings/IsolationModeWarning';
import { AMPLWarning } from '../../components/Warnings/AMPLWarning';
import { AAVEWarning } from '../../components/transactions/Warnings/AAVEWarning';
import { SNXWarning } from '../../components/transactions/Warnings/SNXWarning';
import {
  CollateralState,
  DetailsHFLine,
} from '../../components/transactions/FlowCommons/TxModalDetails';
import { SupplyActions } from '../../components/transactions/Supply/SupplyActions';
import { TxSuccessView } from '../../components/transactions/FlowCommons/Success';
import { useModalContext } from '../../hooks/useModal';
import { ERC20TokenType } from '../../libs/web3-data-provider/Web3Provider';

interface SupplyInfoProps {
  reserve: ComputedReserveData;
  userReserve: ComputedUserReserveData;
  currentMarketData: MarketDataType;
  renderCharts: boolean;
  showSupplyCapStatus: boolean;
  supplyCap: AssetCapHookData;
  debtCeiling: AssetCapHookData;
  tokenBalance: string;
  nativeBalance: string;
  currentNetworkConfig: NetworkConfig;
  marketReferencePriceInUsd: string;
  user: ExtendedFormattedUser;
  loading: boolean;
  isWrongNetwork: boolean;
}

export const SupplyInfo = ({
  reserve,
  currentMarketData,
  showSupplyCapStatus,
  supplyCap,
  debtCeiling,
  tokenBalance,
  nativeBalance,
  currentNetworkConfig,
  marketReferencePriceInUsd,
  isWrongNetwork,
  user,
  userReserve,
}: SupplyInfoProps) => {
  const [amount, setAmount] = useState<string>('');
  const supplyUnWrapped =
    reserve.underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase();
  const walletBalance = supplyUnWrapped ? nativeBalance : tokenBalance;
  const { mainTxState: supplyTxState } = useModalContext();
  const { totalLiquidity, isFrozen, decimals, isolationModeTotalDebt } = reserve;
  const minRemainingBaseTokenBalance = useRootStore(
    (state) => state.poolComputed.minRemainingBaseTokenBalance
  );
  const addToken: ERC20TokenType = {
    address: reserve.aTokenAddress,
    symbol: reserve.iconSymbol,
    decimals: reserve.decimals,
    aToken: true,
  };
  const { supplyCap: supplyCapUsage, debtCeiling: debtCeilingUsage } = useAssetCaps();

  const maxAmountToSupply = useMemo(
    () =>
      getMaxAmountAvailableToSupply(
        walletBalance,
        {
          supplyCap: reserve.supplyCap,
          totalLiquidity,
          isFrozen,
          decimals,
          debtCeiling: reserve.debtCeiling,
          isolationModeTotalDebt,
        },
        reserve.underlyingAsset,
        minRemainingBaseTokenBalance
      ),
    [
      walletBalance,
      supplyCap,
      totalLiquidity,
      isFrozen,
      decimals,
      debtCeiling,
      isolationModeTotalDebt,
      reserve.underlyingAsset,
      minRemainingBaseTokenBalance,
    ]
  );

  const amountIntEth = new BigNumber(amount).multipliedBy(
    reserve.formattedPriceInMarketReferenceCurrency
  );
  // TODO: is it correct to ut to -1 if user doesnt exist?
  const amountInUsd = amountIntEth.multipliedBy(marketReferencePriceInUsd).shiftedBy(-USD_DECIMALS);
  const totalCollateralMarketReferenceCurrencyAfter = user
    ? valueToBigNumber(user.totalCollateralMarketReferenceCurrency).plus(amountIntEth)
    : '-1';

  const liquidationThresholdAfter = user
    ? valueToBigNumber(user.totalCollateralMarketReferenceCurrency)
        .multipliedBy(user.currentLiquidationThreshold)
        .plus(amountIntEth.multipliedBy(reserve.formattedReserveLiquidationThreshold))
        .dividedBy(totalCollateralMarketReferenceCurrencyAfter)
    : '-1';

  let healthFactorAfterDeposit = user ? valueToBigNumber(user.healthFactor) : '-1';

  if (
    user &&
    ((!user.isInIsolationMode && !reserve.isIsolated) ||
      (user.isInIsolationMode && user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset))
  ) {
    healthFactorAfterDeposit = calculateHealthFactorFromBalancesBigUnits({
      collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrencyAfter,
      borrowBalanceMarketReferenceCurrency: valueToBigNumber(
        user.totalBorrowsMarketReferenceCurrency
      ),
      currentLiquidationThreshold: liquidationThresholdAfter,
    });
  }
  // ************** Warnings **********
  // isolation warning
  const hasDifferentCollateral = user.userReservesData.find(
    (poolReserve) =>
      poolReserve.usageAsCollateralEnabledOnUser && poolReserve.reserve.id !== reserve.id
  );
  const showIsolationWarning: boolean =
    !user.isInIsolationMode &&
    reserve.isIsolated &&
    !hasDifferentCollateral &&
    (userReserve && userReserve.underlyingBalance !== '0'
      ? userReserve.usageAsCollateralEnabledOnUser
      : true);

  // collateralization state
  const collateralType = getAssetCollateralType(
    userReserve,
    user.totalCollateralUSD,
    user.isInIsolationMode,
    debtCeilingUsage.isMaxed
  );

  const supplyActionsProps = {
    amountToSupply: amount,
    isWrongNetwork,
    poolAddress: supplyUnWrapped ? API_ETH_MOCK_ADDRESS : reserve.underlyingAsset,
    symbol: supplyUnWrapped ? currentNetworkConfig.baseAssetSymbol : reserve.symbol,
    blocked: false,
    decimals: reserve.decimals,
    isWrappedBaseAsset: reserve.isWrappedBaseAsset,
  };

  if (supplyTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Supplied</Trans>}
        amount={amount}
        symbol={supplyUnWrapped ? currentNetworkConfig.baseAssetSymbol : reserve.symbol}
        addToken={addToken}
      />
    );

  return (
    <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}
      >
        <PercentageInput
          value={amount}
          setValue={setAmount}
          amountIn$={isNaN(+amountInUsd.toString(10)) ? '0' : amountInUsd.toString(10)}
          balance={walletBalance}
          maxAmount={maxAmountToSupply}
        />
        {showIsolationWarning && <IsolationModeWarning asset={reserve.symbol} />}
        {supplyCapUsage.determineWarningDisplay({ supplyCap: supplyCapUsage })}
        {debtCeilingUsage.determineWarningDisplay({ debtCeiling: debtCeilingUsage })}
        {reserve.symbol === 'AMPL' && (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="warning">
            <AMPLWarning />
          </Warning>
        )}
        {process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true' &&
          reserve.symbol === 'AAVE' &&
          isFeatureEnabled.staking(currentMarketData) && <AAVEWarning />}
        {reserve.symbol === 'SNX' && maxAmountToSupply !== '0' && <SNXWarning />}
        {showSupplyCapStatus ? (
          // With supply cap
          <>
            <CapsCircularStatus
              value={supplyCap.percentUsed}
              tooltipContent={
                <>
                  <Trans>
                    Maximum amount available to supply is{' '}
                    <FormattedNumber
                      sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
                      value={
                        valueToBigNumber(reserve.supplyCap).toNumber() -
                        valueToBigNumber(reserve.totalLiquidity).toNumber()
                      }
                      variant="secondary12"
                    />{' '}
                    {reserve.symbol} (
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCapUSD).toNumber() -
                        valueToBigNumber(reserve.totalLiquidityUSD).toNumber()
                      }
                      variant="secondary12"
                      symbol="USD"
                    />
                    ).
                  </Trans>
                </>
              }
            />
            <PanelItem
              isColumn={true}
              title={
                <Box display="flex" alignItems="center">
                  <Trans>Total supplied</Trans>
                  <TextWithTooltip
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: {
                        tooltip: 'Total Supply',
                        asset: reserve.underlyingAsset,
                        assetName: reserve.name,
                      },
                    }}
                  >
                    <>
                      <Trans>
                        Asset supply is limited to a certain amount to reduce protocol exposure to
                        the asset and to help manage risks involved.
                      </Trans>{' '}
                      <Link
                        href="https://docs.aave.com/developers/whats-new/supply-borrow-caps"
                        underline="always"
                      >
                        <Trans>Learn more</Trans>
                      </Link>
                    </>
                  </TextWithTooltip>
                </Box>
              }
            >
              <Box>
                <FormattedNumber
                  sx={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    lineHeight: '18px',
                  }}
                  value={reserve.totalLiquidity}
                  variant="main16"
                  compact
                />
                <Typography
                  component="span"
                  color="text.primary"
                  variant="secondary16"
                  sx={{
                    display: 'inline-block',
                    mx: 1,
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    lineHeight: '18px',
                  }}
                >
                  <Trans>of</Trans>
                </Typography>
                <FormattedNumber
                  value={reserve.supplyCap}
                  variant="main16"
                  sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
                />
              </Box>
              <Box>
                <span
                  style={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    lineHeight: '14px',
                  }}
                >
                  $<ReserveSubheader value={reserve.totalLiquidityUSD} isWithoutSymbol={true} />
                </span>
                <Typography
                  component="span"
                  color="text.secondary"
                  variant="secondary12"
                  sx={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'Poppins',
                    display: 'inline-block',
                    mx: 1,
                    lineHeight: '18px',
                    mb: -2,
                  }}
                >
                  <Trans>of</Trans>
                </Typography>
                <span
                  style={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
                >
                  $<ReserveSubheader isWithoutSymbol={true} value={reserve.supplyCapUSD} />
                </span>
              </Box>
            </PanelItem>
          </>
        ) : (
          // Without supply cap
          <PanelItem
            isColumn={true}
            title={
              <Box display="flex" alignItems="center">
                <Trans>Total supplied</Trans>
              </Box>
            }
          >
            <FormattedNumber
              value={reserve.totalLiquidity}
              variant="main16"
              compact
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
            <div
              style={{ fontSize: 18, fontFamily: 'Poppins', lineHeight: '16px', fontWeight: 600 }}
            >
              {' '}
              (<ReserveSubheader value={reserve.totalLiquidityUSD} isWithoutSymbol={true} />)
            </div>
          </PanelItem>
        )}
        <PanelItem title={<Trans>Supply APY</Trans>}>
          <FormattedNumber
            value={reserve.supplyAPY}
            percent
            variant="main16"
            sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
          />
        </PanelItem>
        {reserve.unbacked && reserve.unbacked !== '0' && (
          <PanelItem title={<Trans>Unbacked</Trans>}>
            <FormattedNumber
              value={reserve.unbacked}
              variant="main16"
              symbol={reserve.name}
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
            <ReserveSubheader value={reserve.unbackedUSD} />
          </PanelItem>
        )}
      </Box>
      <PanelItem title={<Trans>Collateralization</Trans>}>
        <CollateralState collateralType={collateralType} isBig={true} />
      </PanelItem>
      {reserve.reserveLiquidationThreshold !== '0' && (
        <>
          <PanelItem
            title={
              <MaxLTVTooltip
                sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'MAX LTV',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Max LTV</Trans>}
              />
            }
          >
            <FormattedNumber
              value={reserve.formattedBaseLTVasCollateral}
              percent
              variant="secondary14"
              visibleDecimals={2}
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
          </PanelItem>
          <PanelItem
            title={
              <LiquidationThresholdTooltip
                sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Liquidation threshold',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Liquidation threshold</Trans>}
              />
            }
          >
            <FormattedNumber
              value={reserve.formattedReserveLiquidationThreshold}
              percent
              variant="secondary14"
              visibleDecimals={2}
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
          </PanelItem>
          <PanelItem
            title={
              <LiquidationPenaltyTooltip
                sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15 }}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Liquidation penalty',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Liquidation penalty</Trans>}
              />
            }
          >
            <FormattedNumber
              value={reserve.formattedReserveLiquidationBonus}
              percent
              variant="secondary14"
              visibleDecimals={2}
              sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
            />
          </PanelItem>
          {reserve.isIsolated && (
            <PanelItem title={<Trans>Isolated Debt Ceiling</Trans>}>
              <FormattedNumber
                value={reserve.isolationModeTotalDebtUSD}
                variant="main14"
                symbol="USD"
                symbolsVariant="secondary14"
                visibleDecimals={2}
                sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
              />
              <Typography
                component="span"
                color="text.secondary"
                variant="secondary14"
                sx={{ display: 'inline-block', mx: 1 }}
              >
                <Trans>of</Trans>
              </Typography>
              <FormattedNumber
                value={reserve.debtCeilingUSD}
                variant="main14"
                symbol="USD"
                symbolsVariant="secondary14"
                visibleDecimals={2}
                sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
              />
            </PanelItem>
          )}
        </>
      )}
      <DetailsHFLine
        visibleHfChange={!!amount}
        healthFactor={user ? user.healthFactor : '-1'}
        futureHealthFactor={healthFactorAfterDeposit.toString(10)}
        isSecondary={true}
      />
      <SupplyActions {...supplyActionsProps} />
      <div>
        {reserve.isIsolated ? (
          <Box sx={{ pb: '12px' }}>
            <Typography variant="subheader1" color="text.main" paddingBottom={'12px'}>
              <Trans>Collateral usage</Trans>
            </Typography>
            <Warning severity="warning">
              <Typography variant="subheader1">
                <Trans>Asset can only be used as collateral in isolation mode only.</Trans>
              </Typography>
              <Typography variant="caption">
                In Isolation mode you cannot supply other assets as collateral for borrowing. Assets
                used as collateral in Isolation mode can only be borrowed to a specific debt
                ceiling.{' '}
                <Link href="https://docs.aave.com/faq/aave-v3-features#isolation-mode">
                  Learn more
                </Link>
              </Typography>
            </Warning>
          </Box>
        ) : reserve.reserveLiquidationThreshold !== '0' ? (
          <Box
            sx={{ display: 'inline-flex', alignItems: 'center', pt: '42px', pb: '12px' }}
            paddingTop={'42px'}
          >
            <Typography variant="subheader1" color="text.main">
              <Trans>Collateral usage</Trans>
            </Typography>
            <CheckRoundedIcon fontSize="small" color="success" sx={{ ml: 2 }} />
            <Typography variant="subheader1" sx={{ color: '#46BC4B' }}>
              <Trans>Can be collateral</Trans>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ pt: '42px', pb: '12px' }}>
            <Typography variant="subheader1" color="text.main">
              <Trans>Collateral usage</Trans>
            </Typography>
            <Warning sx={{ my: '12px' }} severity="warning">
              <Trans>Asset cannot be used as collateral.</Trans>
            </Warning>
          </Box>
        )}
      </div>
      {reserve.symbol == 'stETH' && (
        <Box>
          <Warning severity="info">
            <AlertTitle>
              <Trans>Staking Rewards</Trans>
            </AlertTitle>
            <Trans>
              stETH supplied as collateral will continue to accrue staking rewards provided by daily
              rebases.
            </Trans>{' '}
            <Link
              href="https://blog.lido.fi/aave-integrates-lidos-steth-as-collateral/"
              underline="always"
            >
              <Trans>Learn more</Trans>
            </Link>
          </Warning>
        </Box>
      )}
    </Box>
  );
};
