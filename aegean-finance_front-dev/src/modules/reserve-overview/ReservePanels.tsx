import { Box, BoxProps, Typography, TypographyProps, useMediaQuery, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

export const PanelRow: React.FC<BoxProps> = (props) => (
  <Box
    {...props}
    sx={{
      position: 'relative',
      display: { xs: 'block', md: 'flex' },
      margin: '0 auto',
      ...props.sx,
    }}
  />
);
export const PanelTitle: React.FC<TypographyProps> = (props) => (
  <Typography
    {...props}
    variant="subheader1"
    sx={{ minWidth: { xs: '170px' }, mr: 4, mb: { xs: 6, md: 0 }, ...props.sx }}
  />
);

interface PanelItemProps {
  title: ReactNode;
  className?: string;
  isColumn?: boolean;
}

export const PanelItem: React.FC<PanelItemProps> = ({ isColumn, title, children, className }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        mb: 4,
        ...(mdUp
          ? {
              '&:not(:last-child):not(.borderless)::after': {
                content: '""',
                height: '32px',
                position: 'absolute',
                right: 4,
                top: 'calc(50% - 17px)',
              },
            }
          : {}),
      }}
      className={className}
    >
      <Typography
        color="text.secondary"
        component="span"
        sx={{
          borderBottom: '2px dashed #94A1CA',
          fontFamily: 'Poppins',
          fontSize: 15,
          lineHeight: '15px',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isColumn ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          py: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
