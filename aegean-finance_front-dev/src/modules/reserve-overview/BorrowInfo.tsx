import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { CapsCircularStatus } from 'src/components/caps/CapsCircularStatus';
import { VariableAPYTooltip } from 'src/components/infoTooltips/VariableAPYTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { AssetCapHookData } from 'src/hooks/useAssetCaps';
import { MarketDataType, NetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { ReserveFactorOverview } from './ReserveFactorOverview';
import { PanelItem } from './ReservePanels';
import { Warning } from '../../components/primitives/Warning';
import { BorrowDisabledWarning } from '../../components/Warnings/BorrowDisabledWarning';
import React, { useState } from 'react';
import { useModalContext } from '../../hooks/useModal';
import { API_ETH_MOCK_ADDRESS, InterestRate } from '@aave/contract-helpers';
import { getMaxAmountAvailableToBorrow } from '../../utils/getMaxAmountAvailableToBorrow';
import { roundToTokenDecimals } from '../../utils/utils';
import { ERC20TokenType } from '../../libs/web3-data-provider/Web3Provider';
import { TxSuccessView } from '../../components/transactions/FlowCommons/Success';
import {
  BorrowModeSwitch,
  ErrorType,
} from '../../components/transactions/Borrow/BorrowModalContent';
import { PercentageInput } from './PercentageInput';
import {
  DetailsHFLine,
  DetailsIncentivesLine,
  DetailsUnwrapSwitch,
  TxModalDetails,
} from '../../components/transactions/FlowCommons/TxModalDetails';
import { GasEstimationError } from '../../components/transactions/FlowCommons/GasEstimationError';
import { BorrowAmountWarning } from '../../components/transactions/Borrow/BorrowAmountWarning';
import { ParameterChangewarning } from '../../components/transactions/Borrow/ParameterChangewarning';
import { BorrowActions } from '../../components/transactions/Borrow/BorrowActions';

interface BorrowInfoProps {
  poolReserve: ComputedReserveData;
  userReserve: ComputedUserReserveData;

  currentMarketData: MarketDataType;
  currentNetworkConfig: NetworkConfig;
  renderCharts: boolean;
  showBorrowCapStatus: boolean;
  borrowCap: AssetCapHookData;
  currentMarket: string;
  isWrongNetwork: boolean;
}

export const BorrowInfo = ({
  poolReserve,
  currentMarketData,
  currentNetworkConfig,
  userReserve,
  showBorrowCapStatus,
  borrowCap,
  currentMarket,
  isWrongNetwork,
}: BorrowInfoProps) => {
  const { mainTxState: borrowTxState, gasLimit, txError } = useModalContext();
  const { user, marketReferencePriceInUsd } = useAppDataContext();
  const [borrowUnWrapped, setBorrowUnWrapped] = useState<boolean>(true);

  const [interestRateMode, setInterestRateMode] = useState<InterestRate>(InterestRate.Variable);
  const [amount, setAmount] = useState('');
  const [riskCheckboxAccepted, setRiskCheckboxAccepted] = useState(false);

  // amount calculations
  const maxAmountToBorrow = getMaxAmountAvailableToBorrow(poolReserve, user, interestRateMode);

  // We set this in a useEffect, so it doesn't constantly change when
  // max amount selected
  const handleChange = (_value: string) => {
    if (_value === '-1') {
      setAmount(maxAmountToBorrow);
    } else {
      const decimalTruncatedValue = roundToTokenDecimals(_value, poolReserve.decimals);
      setAmount(decimalTruncatedValue);
    }
  };

  // health factor calculations
  const amountToBorrowInUsd = valueToBigNumber(amount)
    .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
    .multipliedBy(marketReferencePriceInUsd)
    .shiftedBy(-USD_DECIMALS);

  const newHealthFactor = calculateHealthFactorFromBalancesBigUnits({
    collateralBalanceMarketReferenceCurrency: user.totalCollateralUSD,
    borrowBalanceMarketReferenceCurrency: valueToBigNumber(user.totalBorrowsUSD).plus(
      amountToBorrowInUsd
    ),
    currentLiquidationThreshold: user.currentLiquidationThreshold,
  });
  const displayRiskCheckbox =
    newHealthFactor.toNumber() < 1.5 && newHealthFactor.toString() !== '-1';

  // calculating input usd value
  const usdValue = valueToBigNumber(amount).multipliedBy(poolReserve.priceInUSD);

  // error types handling
  let blockingError: ErrorType | undefined = undefined;
  if (interestRateMode === InterestRate.Stable && !poolReserve.stableBorrowRateEnabled) {
    blockingError = ErrorType.STABLE_RATE_NOT_ENABLED;
  } else if (
    interestRateMode === InterestRate.Stable &&
    userReserve?.usageAsCollateralEnabledOnUser &&
    valueToBigNumber(amount).lt(userReserve?.underlyingBalance || 0)
  ) {
    blockingError = ErrorType.NOT_ENOUGH_BORROWED;
  } else if (valueToBigNumber(amount).gt(poolReserve.formattedAvailableLiquidity)) {
    blockingError = ErrorType.NOT_ENOUGH_LIQUIDITY;
  } else if (!poolReserve.borrowingEnabled) {
    blockingError = ErrorType.BORROWING_NOT_AVAILABLE;
  }

  // error render handling
  const handleBlocked = () => {
    switch (blockingError) {
      case ErrorType.BORROWING_NOT_AVAILABLE:
        return <Trans>Borrowing is currently unavailable for {poolReserve.symbol}.</Trans>;
      case ErrorType.NOT_ENOUGH_BORROWED:
        return (
          <Trans>
            You can borrow this asset with a stable rate only if you borrow more than the amount you
            are supplying as collateral.
          </Trans>
        );
      case ErrorType.NOT_ENOUGH_LIQUIDITY:
        return (
          <>
            <Trans>
              There are not enough funds in the
              {poolReserve.symbol}
              reserve to borrow
            </Trans>
          </>
        );
      case ErrorType.STABLE_RATE_NOT_ENABLED:
        return <Trans>The Stable Rate is not enabled for this currency</Trans>;
      default:
        return null;
    }
  };

  // token info to add to wallet
  const addToken: ERC20TokenType = {
    address: poolReserve.underlyingAsset,
    symbol: poolReserve.iconSymbol,
    decimals: poolReserve.decimals,
  };

  const iconSymbol =
    borrowUnWrapped && poolReserve.isWrappedBaseAsset
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve.iconSymbol;

  if (borrowTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Borrowed</Trans>}
        amount={amount}
        symbol={iconSymbol}
        addToken={borrowUnWrapped && poolReserve.isWrappedBaseAsset ? undefined : addToken}
      />
    );

  const incentive =
    interestRateMode === InterestRate.Stable
      ? poolReserve.sIncentivesData
      : poolReserve.vIncentivesData;

  const symbol =
    poolReserve.isWrappedBaseAsset && borrowUnWrapped
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve.symbol;

  return (
    <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
      <PercentageInput
        value={amount}
        setValue={setAmount}
        amountIn$={isNaN(+usdValue.toString(10)) ? '0' : usdValue.toString(10)}
        balance={maxAmountToBorrow}
        maxAmount={maxAmountToBorrow}
        onCustomChange={handleChange}
      />
      {borrowCap.determineWarningDisplay({ borrowCap })}

      {poolReserve.stableBorrowRateEnabled && (
        <BorrowModeSwitch
          interestRateMode={interestRateMode}
          setInterestRateMode={setInterestRateMode}
          variableRate={poolReserve.variableBorrowAPY}
          stableRate={poolReserve.stableBorrowAPY}
        />
      )}
      {!poolReserve.borrowingEnabled && (
        <Warning sx={{ mb: '40px' }} severity="error">
          <BorrowDisabledWarning symbol={poolReserve.symbol} currentMarket={currentMarket} />
        </Warning>
      )}
      {blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          {handleBlocked()}
        </Typography>
      )}
      {poolReserve.isWrappedBaseAsset && (
        <DetailsUnwrapSwitch
          unwrapped={borrowUnWrapped}
          setUnWrapped={setBorrowUnWrapped}
          label={
            <Typography>{`Unwrap ${poolReserve.symbol} (to borrow ${currentNetworkConfig.baseAssetSymbol})`}</Typography>
          }
        />
      )}
      {showBorrowCapStatus ? (
        // With a borrow cap
        <>
          <CapsCircularStatus
            value={borrowCap.percentUsed}
            tooltipContent={
              <>
                <Trans>
                  Maximum amount available to supply is{' '}
                  <FormattedNumber
                    sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
                    value={
                      valueToBigNumber(poolReserve.borrowCap).toNumber() -
                      valueToBigNumber(poolReserve.totalDebt).toNumber()
                    }
                    variant="secondary12"
                  />{' '}
                  {poolReserve.symbol} (
                  <FormattedNumber
                    value={
                      valueToBigNumber(poolReserve.borrowCapUSD).toNumber() -
                      valueToBigNumber(poolReserve.totalDebtUSD).toNumber()
                    }
                    variant="secondary12"
                    symbol="USD"
                    sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
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
                <Trans>Total borrowed</Trans>
                <TextWithTooltip
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: 'Total borrowed',
                      asset: poolReserve.underlyingAsset,
                      assetName: poolReserve.name,
                    },
                  }}
                >
                  <>
                    <Trans>
                      Borrowing of this asset is limited to a certain amount to minimize liquidity
                      pool insolvency.
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
                value={poolReserve.totalDebt}
                variant="main16"
                sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
              />
              <Typography
                component="span"
                color="text.primary"
                variant="secondary16"
                sx={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  display: 'inline-block',
                  mx: 1,
                }}
              >
                <Trans>of</Trans>
              </Typography>
              <FormattedNumber
                value={poolReserve.borrowCap}
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
                $<ReserveSubheader value={poolReserve.totalDebtUSD} isWithoutSymbol={true} />
              </span>
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
                }}
              >
                <Trans>of</Trans>
              </Typography>
              <span
                style={{
                  fontSize: 18,
                  color: 'white',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  lineHeight: '14px',
                }}
              >
                $
                <ReserveSubheader value={poolReserve.borrowCapUSD} isWithoutSymbol={true} />
              </span>
            </Box>
          </PanelItem>
        </>
      ) : (
        // Without a borrow cap
        <PanelItem
          title={
            <Box display="flex" alignItems="center">
              <Trans>Total borrowed</Trans>
            </Box>
          }
        >
          <FormattedNumber
            value={poolReserve.totalDebt}
            variant="main16"
            sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
          />
          <div
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'Poppins',
              fontWeight: 600,
              lineHeight: '14px',
            }}
          >
            ($
            <ReserveSubheader value={poolReserve.totalDebtUSD} isWithoutSymbol={true} />)
          </div>
        </PanelItem>
      )}
      <PanelItem
        title={
          <VariableAPYTooltip
            event={{
              eventName: GENERAL.TOOL_TIP,
              eventParams: {
                tooltip: 'APY, variable',
                asset: poolReserve.underlyingAsset,
                assetName: poolReserve.name,
              },
            }}
            text={<Trans>APY, variable</Trans>}
            sx={{ fontSize: 15, fontFamily: 'Poppins', fontWeight: 600, mt: 2 }}
            key="APY_res_variable_type"
            variant="description"
          />
        }
      >
        <FormattedNumber
          value={poolReserve.variableBorrowAPY}
          percent
          variant="main16"
          sx={{ fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }}
        />
      </PanelItem>
      <TxModalDetails gasLimit={gasLimit} isSecondary={true}>
        <DetailsIncentivesLine incentives={incentive} symbol={poolReserve.symbol} />
        <DetailsHFLine
          isSecondary={true}
          visibleHfChange={!!amount}
          healthFactor={user.healthFactor}
          futureHealthFactor={newHealthFactor.toString(10)}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      {displayRiskCheckbox && (
        <BorrowAmountWarning
          riskCheckboxAccepted={riskCheckboxAccepted}
          onRiskCheckboxChange={() => {
            setRiskCheckboxAccepted(!riskCheckboxAccepted);
          }}
        />
      )}

      <ParameterChangewarning underlyingAsset={poolReserve.underlyingAsset} />

      <BorrowActions
        poolReserve={poolReserve}
        amountToBorrow={amount}
        poolAddress={
          borrowUnWrapped && poolReserve.isWrappedBaseAsset
            ? API_ETH_MOCK_ADDRESS
            : poolReserve.underlyingAsset
        }
        interestRateMode={interestRateMode}
        isWrongNetwork={isWrongNetwork}
        symbol={symbol}
        blocked={blockingError !== undefined || (displayRiskCheckbox && !riskCheckboxAccepted)}
        sx={displayRiskCheckbox ? { mt: 0 } : {}}
      />
      {currentMarketData.addresses.COLLECTOR && (
        <ReserveFactorOverview
          collectorContract={currentMarketData.addresses.COLLECTOR}
          explorerLinkBuilder={currentNetworkConfig.explorerLinkBuilder}
          reserveFactor={poolReserve.reserveFactor}
          reserveName={poolReserve.name}
          reserveAsset={poolReserve.underlyingAsset}
        />
      )}
    </Box>
  );
};
