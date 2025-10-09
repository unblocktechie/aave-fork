import { Box, BoxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface RowProps extends BoxProps {
  caption?: ReactNode;
  captionVariant?: 'secondary16' | 'description' | 'subheader1' | 'caption' | 'h3';
  captionColor?: string;
  align?: 'center' | 'flex-start';
  isDotted?: boolean;
  isSecondary?: boolean;
}

export const Row = ({
  caption,
  children,
  captionVariant = 'secondary16',
  captionColor,
  align = 'center',
  isDotted,
  isSecondary,
  ...rest
}: RowProps) => {
  return (
    <Box
      {...rest}
      sx={{ display: 'flex', alignItems: align, justifyContent: 'space-between', ...rest.sx }}
    >
      {caption && (
        <Typography
          component="div"
          variant={captionVariant}
          color={isDotted ? '#94A1CA' : captionColor}
          sx={{
            mr: 2,
            fontSize: isSecondary ? 15 : 14,
            fontFamily: 'Poppins',
            fontWeight: 600,
            borderBottom: isDotted ? '2px dotted #94A1CA' : 'none',
          }}
        >
          {caption}
        </Typography>
      )}

      {children}
    </Box>
  );
};
