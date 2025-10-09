import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ListItemProps extends BoxProps {
  children: ReactNode;
  minHeight?: number;
  px?: number;
  button?: boolean;
  withBorder?: boolean;
}

export const ListItem = ({
  children,
  minHeight = 71,
  px = 4,
  button,
  withBorder,
  ...rest
}: ListItemProps) => {
  return (
    <Box
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: withBorder ? minHeight : 54,
        cursor: 'pointer',
        transition: 'all 0.2s linear',
        px,
        '&:not(:last-child)': {
          borderBottom: withBorder ? '1px solid' : 'none',
          borderColor: withBorder ? 'divider' : 'none',
        },
        '&:hover': {
          background:
            'linear-gradient(90deg, rgba(51, 119, 255, 0.21) 0%, rgba(51, 182, 255, 0.04) 94.08%)',
        },
        ...(button ? { '&:hover': { bgcolor: 'action.hover' } } : {}),
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
};
