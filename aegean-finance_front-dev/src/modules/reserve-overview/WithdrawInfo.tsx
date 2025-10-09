import React, { useRef, useState } from 'react';
import {
  ComputedReserveData,
  ComputedUserReserveData,
  ExtendedFormattedUser,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { NetworkConfig } from '../../ui-config/networksConfig';
import { useModalContext } from '../../hooks/useModal';
import { useRootStore } from '../../store/root';
import { calculateMaxWithdrawAmount } from '../../components/transactions/Withdraw/utils';
import { valueToBigNumber } from '@aave/math-utils';
import { GENERAL } from '../../utils/mixPanelEvents';
import { zeroLTVBlockingWithdraw } from '../../components/transactions/utils';
import { calculateHFAfterWithdraw } from '../../utils/hfUtils';
import { useWithdrawError } from '../../components/transactions/Withdraw/WithdrawError';
import { PercentageInput } from './PercentageInput';
import { Box, Checkbox, Typography } from '@mui/material';
import {
  DetailsHFLine,
  DetailsNumberLine,
  DetailsUnwrapSwitch,
  TxModalDetails,
} from '../../components/transactions/FlowCommons/TxModalDetails';
import { Trans } from '@lingui/macro';
import { GasEstimationError } from '../../components/transactions/FlowCommons/GasEstimationError';
import { Warning } from '../../components/primitives/Warning';
import { WithdrawActions } from '../../components/transactions/Withdraw/WithdrawActions';
import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { TxSuccessView } from '../../components/transactions/FlowCommons/Success';
import BigNumber from 'bignumber.js';

interface PropsTypes {
  poolReserve: ComputedReserveData;
  currentNetworkConfig: NetworkConfig;
  user: ExtendedFormattedUser;
  isWrongNetwork: boolean;
  userReserve: ComputedUserReserveData;
}
export const WithdrawInfo = ({
  poolReserve,
  user,
  currentNetworkConfig,
  isWrongNetwork,
  userReserve,
}: PropsTypes) => {
  const { gasLimit, mainTxState: withdrawTxState, txError } = useModalContext();
  const [_amount, setAmount] = useState('');
  const [withdrawMax, setWithdrawMax] = useState('');
  const [riskCheckboxAccepted, setRiskCheckboxAccepted] = useState(false);
  const amountRef = useRef<string>('');
  const trackEvent = useRootStore((store) => store.trackEvent);
  const [withdrawUnWrapped, setWithdrawUnWrapped] = useState<boolean>(true);
  const symbol =
    poolReserve.isWrappedBaseAsset && withdrawUnWrapped
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve.symbol;

  const isMaxSelected = _amount === '-1';
  const maxAmountToWithdraw = calculateMaxWithdrawAmount(user, userReserve, poolReserve);
  const underlyingBalance = valueToBigNumber(userReserve?.underlyingBalance || '0');
  const withdrawAmount = isMaxSelected ? maxAmountToWithdraw.toString(10) : _amount;

  const handleChange = (value: string) => {
    const maxSelected = value === '-1';
    amountRef.current = maxSelected ? maxAmountToWithdraw.toString(10) : value;
    setAmount(value);
    if (maxSelected && maxAmountToWithdraw.eq(underlyingBalance)) {
      trackEvent(GENERAL.MAX_INPUT_SELECTION, { type: 'withdraw' });
      setWithdrawMax('-1');
    } else {
      setWithdrawMax(maxAmountToWithdraw.toString(10));
    }
  };

  const assetsBlockingWithdraw: string[] = zeroLTVBlockingWithdraw(user);

  const healthFactorAfterWithdraw = calculateHFAfterWithdraw({
    user,
    userReserve,
    poolReserve,
    withdrawAmount,
  });

  const { blockingError, errorComponent } = useWithdrawError({
    assetsBlockingWithdraw,
    poolReserve,
    healthFactorAfterWithdraw,
    withdrawAmount,
  });

  const displayRiskCheckbox =
    healthFactorAfterWithdraw.toNumber() >= 1 &&
    healthFactorAfterWithdraw.toNumber() < 1.5 &&
    userReserve.usageAsCollateralEnabledOnUser;

  // calculating input usd value
  const usdValue = valueToBigNumber(withdrawAmount).multipliedBy(
    userReserve?.reserve.priceInUSD || 0
  );

  if (withdrawTxState.success)
    return (
      <TxSuccessView
        action={<Trans>withdrew</Trans>}
        amount={amountRef.current}
        symbol={
          withdrawUnWrapped && poolReserve.isWrappedBaseAsset
            ? currentNetworkConfig.baseAssetSymbol
            : poolReserve.symbol
        }
      />
    );

  return (
    <>
      <PercentageInput
        value={_amount}
        setValue={setAmount}
        amountIn$={isNaN(+usdValue.toString(10)) ? '0' : usdValue.toString(10)}
        maxAmount={maxAmountToWithdraw.toString(10)}
        balance={underlyingBalance.toString(10)}
        disabled={withdrawTxState.loading}
        onCustomChange={handleChange}
      />
      {blockingError === undefined && (
        <Typography variant="helperText" color="error.main">
          {errorComponent}
        </Typography>
      )}
      {poolReserve.isWrappedBaseAsset && (
        <DetailsUnwrapSwitch
          unwrapped={withdrawUnWrapped}
          setUnWrapped={setWithdrawUnWrapped}
          label={
            <Typography
              sx={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600 }}
            >{`Unwrap ${poolReserve.symbol} (to withdraw ${currentNetworkConfig.baseAssetSymbol})`}</Typography>
          }
        />
      )}
      <TxModalDetails gasLimit={gasLimit} isSecondary={true}>
        <DetailsNumberLine
          isSecondary={true}
          description={<Trans>Remaining supply</Trans>}
          value={BigNumber.max(underlyingBalance.minus(withdrawAmount || '0'), 0).toString(10)}
          symbol={
            poolReserve.isWrappedBaseAsset
              ? currentNetworkConfig.baseAssetSymbol
              : poolReserve.symbol
          }
        />
        <DetailsHFLine
          isSecondary={true}
          visibleHfChange={!!_amount}
          healthFactor={user ? user.healthFactor : '-1'}
          futureHealthFactor={healthFactorAfterWithdraw.toString(10)}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      {displayRiskCheckbox && (
        <>
          <Warning severity="error" sx={{ my: 6 }}>
            <Trans>
              Withdrawing this amount will reduce your health factor and increase risk of
              liquidation.
            </Trans>
          </Warning>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              mx: '24px',
              mb: '12px',
            }}
          >
            <Checkbox
              checked={riskCheckboxAccepted}
              onChange={() => {
                setRiskCheckboxAccepted(!riskCheckboxAccepted),
                  trackEvent(GENERAL.ACCEPT_RISK, {
                    modal: 'Withdraw',
                    riskCheckboxAccepted: riskCheckboxAccepted,
                  });
              }}
              size="small"
              data-cy={`risk-checkbox`}
            />
            <Typography variant="description">
              <Trans>I acknowledge the risks involved.</Trans>
            </Typography>
          </Box>
        </>
      )}

      <WithdrawActions
        poolReserve={poolReserve}
        amountToWithdraw={isMaxSelected ? withdrawMax : withdrawAmount}
        poolAddress={
          withdrawUnWrapped && poolReserve.isWrappedBaseAsset
            ? API_ETH_MOCK_ADDRESS
            : poolReserve.underlyingAsset
        }
        isWrongNetwork={isWrongNetwork}
        symbol={symbol}
        blocked={blockingError !== undefined || (displayRiskCheckbox && !riskCheckboxAccepted)}
        sx={displayRiskCheckbox ? { mt: 0 } : {}}
      />
    </>
  );
};
