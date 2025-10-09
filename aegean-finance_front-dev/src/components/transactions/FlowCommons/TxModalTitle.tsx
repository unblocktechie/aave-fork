import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export type TxModalTitleProps = {
  title: ReactNode;
  symbol?: string;
  mb?: number
};

export const TxModalTitle = ({ title, symbol, mb=6 }: TxModalTitleProps) => {
  return (
    <Typography
      variant="h2"
      sx={{
        mb,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontWeight: 600,
        fontSize: 20,
        lineHeight: '26px',
      }}
    >
      {title} {symbol ?? ''}
    </Typography>
  );
};
