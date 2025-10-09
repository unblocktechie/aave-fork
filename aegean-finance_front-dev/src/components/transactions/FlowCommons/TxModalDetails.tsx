import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { ArrowNarrowRightIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, FormControlLabel, Skeleton, SvgIcon, Switch, Typography } from '@mui/material';
import { parseUnits } from 'ethers/lib/utils';
import React, { ReactNode } from 'react';
import {
  IsolatedDisabledBadge,
  IsolatedEnabledBadge,
  UnavailableDueToIsolationBadge,
} from 'src/components/isolationMode/IsolatedBadge';
import { Row } from 'src/components/primitives/Row';
import { CollateralType } from 'src/helpers/types';

import { HealthFactorNumber } from '../../HealthFactorNumber';
import { IncentivesButton } from '../../incentives/IncentivesButton';
import { FormattedNumber, FormattedNumberProps } from '../../primitives/FormattedNumber';
import { TokenIcon } from '../../primitives/TokenIcon';
import { GasStation } from '../GasStation/GasStation';

export interface TxModalDetailsProps {
  gasLimit?: string;
  slippageSelector?: ReactNode;
  skipLoad?: boolean;
  disabled?: boolean;
  chainId?: number;
  isSecondary?: boolean;
}

const ArrowRightIcon = (
  <SvgIcon color="primary" sx={{ fontSize: '14px', mx: 1 }}>
    <ArrowNarrowRightIcon />
  </SvgIcon>
);

export const TxModalDetails: React.FC<TxModalDetailsProps> = ({
  gasLimit,
  slippageSelector,
  skipLoad,
  disabled,
  children,
  chainId,
  isSecondary,
}) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Box
        sx={() => ({
          border: isSecondary ? 'none' : `1px solid #2A3765`,
          borderRadius: isSecondary ? '0px' : '8px',
          '.MuiBox-root:last-of-type': {
            mb: 0,
          },
        })}
      >
        {children}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <GasStation
          chainId={chainId}
          gasLimit={parseUnits(gasLimit || '0', 'wei')}
          skipLoad={skipLoad}
          disabled={disabled}
          rightComponent={slippageSelector}
        />
      </Box>
    </Box>
  );
};

interface DetailsNumberLineProps extends FormattedNumberProps {
  description: ReactNode;
  value: FormattedNumberProps['value'];
  futureValue?: FormattedNumberProps['value'];
  numberPrefix?: ReactNode;
  iconSymbol?: string;
  loading?: boolean;
  isSecondary?: boolean;
}

export const DetailsNumberLine = ({
  description,
  value,
  futureValue,
  numberPrefix,
  iconSymbol,
  loading = false,
  isSecondary,
  ...rest
}: DetailsNumberLineProps) => {
  return (
    <Row
      caption={description}
      captionVariant="description"
      sx={{
        padding: isSecondary ? '0px' : '14px',
        borderBottom: isSecondary ? 'none' : `1px solid #2A3765`,
        mb: isSecondary ? 5 : 0,
      }}
      isDotted={true}
      isSecondary={true}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <Skeleton variant="rectangular" height={20} width={100} sx={{ borderRadius: '4px' }} />
        ) : (
          <>
            {iconSymbol && <TokenIcon symbol={iconSymbol} sx={{ mr: 1, fontSize: '16px' }} />}
            {numberPrefix && <Typography sx={{ mr: 1 }}>{numberPrefix}</Typography>}
            <FormattedNumber
              value={value}
              variant="secondary14"
              symbolsColor={'text.primary'}
              color={'text.primary'}
              sx={
                isSecondary
                  ? { fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }
                  : {}
              }
              {...rest}
            />
            {futureValue && (
              <>
                {ArrowRightIcon}
                <FormattedNumber
                  value={futureValue}
                  variant="secondary14"
                  symbolsColor={'text.primary'}
                  color={'text.primary'}
                  {...rest}
                />
              </>
            )}
          </>
        )}
      </Box>
    </Row>
  );
};

interface DetailsNumberLineWithSubProps {
  description: ReactNode;
  symbol: ReactNode;
  value?: string;
  valueUSD?: string;
  futureValue: string;
  futureValueUSD: string;
  hideSymbolSuffix?: boolean;
  color?: string;
  tokenIcon?: string;
  loading?: boolean;
  isSecondary?: boolean;
}

export const DetailsNumberLineWithSub = ({
  description,
  symbol,
  value,
  valueUSD,
  futureValue,
  futureValueUSD,
  hideSymbolSuffix,
  color,
  tokenIcon,
  isSecondary,
  loading = false,
}: DetailsNumberLineWithSubProps) => {
  return (
    <Row
      isSecondary={isSecondary}
      caption={description}
      captionVariant="description"
      align="flex-start"
      sx={{
        padding: isSecondary ? '0px' : '14px',
        borderBottom: isSecondary ? 'none' : `1px solid #2A3765`,
        mb: isSecondary ? 5 : 0,
      }}
      isDotted={true}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={20} width={100} sx={{ borderRadius: '4px' }} />
            <Skeleton
              variant="rectangular"
              height={15}
              width={80}
              sx={{ borderRadius: '4px', marginTop: '4px' }}
            />
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
              {value && (
                <>
                  <FormattedNumber
                    value={value}
                    variant="secondary14"
                    symbolsColor={'text.primary'}
                    color={color}
                    sx={
                      isSecondary
                        ? {
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            lineHeight: '18px',
                          }
                        : {}
                    }
                  />
                  {!hideSymbolSuffix && (
                    <Typography ml={1} variant="secondary14">
                      {symbol}
                    </Typography>
                  )}
                  {ArrowRightIcon}
                </>
              )}
              {tokenIcon && <TokenIcon symbol={tokenIcon} sx={{ mr: 1, fontSize: '14px' }} />}
              <FormattedNumber
                sx={
                  isSecondary
                    ? {
                        fontSize: 18,
                        color: 'white',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        lineHeight: '18px',
                      }
                    : {}
                }
                value={futureValue}
                variant="secondary14"
                color={color}
              />
              {!hideSymbolSuffix && (
                <Typography ml={1} variant="secondary14">
                  {symbol}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {valueUSD && (
                <>
                  <FormattedNumber
                    sx={
                      isSecondary
                        ? {
                            fontSize: 18,
                            color: 'white',
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            lineHeight: '18px',
                          }
                        : {}
                    }
                    value={valueUSD}
                    variant="helperText"
                    compact
                    symbol="USD"
                  />
                  {ArrowRightIcon}
                </>
              )}
              <FormattedNumber
                sx={
                  isSecondary
                    ? { fontSize: 18, color: 'white', fontFamily: 'Poppins', fontWeight: 600 }
                    : {}
                }
                value={futureValueUSD}
                variant="helperText"
                compact
                symbol="USD"
              />
            </Box>
          </>
        )}
      </Box>
    </Row>
  );
};

export interface DetailsCollateralLine {
  collateralType: CollateralType;
}

export const DetailsCollateralLine = ({ collateralType }: DetailsCollateralLine) => {
  return (
    <Row
      caption={<Trans>Collateralization</Trans>}
      captionVariant="description"
      sx={{
        padding: '14px',
        borderBottom: `1px solid #2A3765`,
      }}
      isDotted={true}
    >
      <CollateralState collateralType={collateralType} />
    </Row>
  );
};

interface CollateralStateProps {
  collateralType: CollateralType;
  isBig?: boolean;
}

export const CollateralState = ({ collateralType, isBig }: CollateralStateProps) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      {
        {
          [CollateralType.ENABLED]: (
            <Typography
              variant="description"
              color="success.main"
              sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: isBig ? 18 : 14 }}
            >
              <Trans>Enabled</Trans>
            </Typography>
          ),
          [CollateralType.ISOLATED_ENABLED]: (
            <IsolatedEnabledBadge
              typographyProps={{ variant: 'description', color: 'warning.main' }}
            />
          ),
          [CollateralType.DISABLED]: (
            <Typography
              variant="description"
              color="error.main"
              sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: isBig ? 18 : 14 }}
            >
              <Trans>Disabled</Trans>
            </Typography>
          ),
          [CollateralType.UNAVAILABLE]: (
            <Typography
              variant="description"
              color="error.main"
              sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: isBig ? 18 : 14 }}
            >
              <Trans>Unavailable</Trans>
            </Typography>
          ),
          [CollateralType.ISOLATED_DISABLED]: <IsolatedDisabledBadge />,
          [CollateralType.UNAVAILABLE_DUE_TO_ISOLATION]: <UnavailableDueToIsolationBadge />,
        }[collateralType]
      }
    </Box>
  );
};

interface DetailsIncentivesLineProps {
  futureIncentives?: ReserveIncentiveResponse[];
  futureSymbol?: string;
  incentives?: ReserveIncentiveResponse[];
  // the token yielding the incentive, not the incentive itself
  symbol: string;
  loading?: boolean;
}

export const DetailsIncentivesLine = ({
  incentives,
  symbol,
  futureIncentives,
  futureSymbol,
  loading = false,
}: DetailsIncentivesLineProps) => {
  if (!incentives || incentives.filter((i) => i.incentiveAPR !== '0').length === 0) return null;
  return (
    <Row
      caption={<Trans>Rewards APR</Trans>}
      captionVariant="description"
      minHeight={24}
      sx={{
        padding: '14px',
        borderBottom: `1px solid #2A3765`,
      }}
      isDotted={true}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {loading ? (
          <Skeleton variant="rectangular" height={20} width={100} sx={{ borderRadius: '4px' }} />
        ) : (
          <>
            <IncentivesButton incentives={incentives} symbol={symbol} />
            {futureSymbol && (
              <>
                {ArrowRightIcon}
                <IncentivesButton incentives={futureIncentives} symbol={futureSymbol} />
                {futureIncentives && futureIncentives.length === 0 && (
                  <Typography variant="secondary14">
                    <Trans>None</Trans>
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Row>
  );
};

export interface DetailsHFLineProps {
  healthFactor: string;
  futureHealthFactor: string;
  visibleHfChange: boolean;
  loading?: boolean;
  isSecondary?: boolean;
}

export const DetailsHFLine = ({
  healthFactor,
  futureHealthFactor,
  visibleHfChange,
  isSecondary,
  loading = false,
}: DetailsHFLineProps) => {
  if (healthFactor === '-1' && futureHealthFactor === '-1') return null;
  return (
    <Row
      caption={
        <Typography
          style={{ fontSize: isSecondary ? 15 : 14, fontFamily: 'Poppins', fontWeight: 600 }}
        >
          Health factor
        </Typography>
      }
      captionVariant="description"
      align="flex-start"
      isDotted={true}
      sx={{
        padding: isSecondary ? '0px' : '14px',
        borderBottom: !isSecondary ? `1px solid #2A3765` : 'none',
        fontSize: isSecondary ? 15 : 14,
        mb: isSecondary ? 4 : 0,
      }}
    >
      <Box sx={{ textAlign: 'right' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {loading ? (
            <Skeleton variant="rectangular" height={20} width={80} sx={{ borderRadius: '4px' }} />
          ) : (
            <>
              <HealthFactorNumber
                value={healthFactor}
                variant="secondary14"
                sx={{ fontSize: isSecondary ? 18 : 14 }}
              />

              {visibleHfChange && (
                <>
                  {ArrowRightIcon}

                  <HealthFactorNumber
                    value={isNaN(Number(futureHealthFactor)) ? healthFactor : futureHealthFactor}
                    variant="secondary14"
                    sx={{ fontSize: isSecondary ? 18 : 14 }}
                  />
                </>
              )}
            </>
          )}
        </Box>

        <Typography variant="helperText" color="text.secondary">
          <Trans>Liquidation at</Trans>
          {' <1.0'}
        </Typography>
      </Box>
    </Row>
  );
};

export interface DetailsUnwrapSwitchProps {
  unwrapped: boolean;
  setUnWrapped: (value: boolean) => void;
  label: ReactNode;
}

export const DetailsUnwrapSwitch = ({
  unwrapped,
  setUnWrapped,
  label,
}: DetailsUnwrapSwitchProps) => {
  return (
    <Row captionVariant="description" sx={{ mt: 5 }}>
      <FormControlLabel
        sx={{ mx: 0 }}
        control={
          <Switch
            disableRipple
            checked={unwrapped}
            onClick={() => setUnWrapped(!unwrapped)}
            data-cy={'wrappedSwitcher'}
          />
        }
        labelPlacement="end"
        label={label}
      />
    </Row>
  );
};
