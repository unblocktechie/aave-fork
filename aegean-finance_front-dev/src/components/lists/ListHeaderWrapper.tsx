import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ListHeaderWrapperProps extends BoxProps {
  px?: 4 | 6;
  isWithBorder?: boolean;
  children: ReactNode;
}

export const ListHeaderWrapper = ({
  px = 4,
  children,
  isWithBorder,
  ...rest
}: ListHeaderWrapperProps) => {
  return (
    <Box
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        px,
        pt: 4,
        pb: 4,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: isWithBorder ? '1px solid' : 'none',
        borderColor: '#283A7D',
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
};
