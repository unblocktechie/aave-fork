import { Box, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

import { ListColumn, ListColumnProps } from '../../../components/lists/ListColumn';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';

interface ListValueColumnProps {
  symbol?: string;
  value: string | number;
  subValue?: string | number;
  withTooltip?: boolean;
  capsComponent?: ReactNode;
  disabled?: boolean;
  listColumnProps?: ListColumnProps;
  color?: string;
}

const Content = ({
  value,
  withTooltip,
  subValue,
  disabled,
  capsComponent,
  color,
}: ListValueColumnProps) => {
  return (
    <>
      {!!subValue && !withTooltip && !disabled && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormattedNumber
            value={subValue}
            variant="secondary14"
            symbol="USD"
            sx={{ mb: !withTooltip && !!subValue ? '2px' : 0 }}
            color={disabled ? 'text.disabled' : color || 'text.main'}
            data-cy={`nativeAmount`}
            symbolsColor={disabled ? 'text.disabled' : color || 'text.main'}
          />
          {capsComponent}
        </Box>
      )}
      <FormattedNumber value={value} variant="secondary12" color="text.secondary" />
    </>
  );
};

export const ListValueColumn = ({
  symbol,
  value,
  subValue,
  withTooltip,
  capsComponent,
  disabled,
  listColumnProps = {},
  color = 'text.main',
}: ListValueColumnProps) => {
  return (
    <ListColumn {...listColumnProps}>
      {withTooltip ? (
        <Tooltip
          title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormattedNumber
                value={subValue || 0}
                symbol="USD"
                variant="secondary14"
                sx={{ mb: '2px' }}
                symbolsColor="common.white"
                compact={false}
              />
              <FormattedNumber
                value={value}
                variant="secondary12"
                symbol={symbol}
                symbolsColor="common.white"
                compact={false}
              />
            </Box>
          }
          arrow
          placement="top"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Content
              symbol={symbol}
              value={value}
              subValue={subValue}
              capsComponent={capsComponent}
              disabled={disabled}
              withTooltip={withTooltip}
              color={color}
            />
          </Box>
        </Tooltip>
      ) : (
        <Content
          symbol={symbol}
          value={value}
          subValue={subValue}
          capsComponent={capsComponent}
          disabled={disabled}
          withTooltip={withTooltip}
          color={color}
        />
      )}
    </ListColumn>
  );
};
