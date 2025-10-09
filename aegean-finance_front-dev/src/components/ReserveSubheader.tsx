import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

import { FormattedNumber } from './primitives/FormattedNumber';

type ReserveSubheaderProps = {
  value: string;
  rightAlign?: boolean;
  isWithoutSymbol?: boolean;
};

export function ReserveSubheader({ value, rightAlign, isWithoutSymbol }: ReserveSubheaderProps) {
  return (
    <Box
      sx={{
        p: rightAlign ? { xs: '0', xsm: '2px 0' } : { xs: '0', xsm: '3.625px 0px' },
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontFamily: 'Poppins',
      }}
    >
      {value === 'Disabled' ? (
        <Typography component="span" sx={{ mr: 0.5 }} variant="secondary12" color="text.muted">
          (<Trans>Disabled</Trans>)
        </Typography>
      ) : (
        <FormattedNumber
          compact
          value={value}
          variant="secondary12"
          color="white"
          symbolsVariant="secondary12"
          symbolsColor="white"
          symbol={isWithoutSymbol ? undefined : 'USD'}
          sx={{ fontSize: 16, fontFamily: 'Poppins' }}
        />
      )}
    </Box>
  );
}
