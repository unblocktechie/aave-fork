import { Box, Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
  isSecondary?: boolean;
}

export const TopInfoPanel = ({
  pageTitle,
  titleComponent,
  withMarketSwitcher,
  bridge,
  children,
  isSecondary,
  containerProps = {},
}: TopInfoPanelProps) => {
  return (
    <Box
      sx={{
        bgcolor: isSecondary ? 'transparent' : 'background.header',
        pt: { xs: isSecondary ? '0px' : 10, md: isSecondary ? '0px' : 12 },
        pb: {
          xs: isSecondary ? '0px' : 18,
          md: isSecondary ? '0px' : 20,
          lg: isSecondary ? '0px' : '94px',
          xl: isSecondary ? '0px' : '92px',
          xxl: isSecondary ? '0px' : '96px',
        },
        color: '#F1F1F3',
        mb: isSecondary ? '70px' : 0,
      }}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0, maxWidth: 1100 }}>
        <Box>
          {!titleComponent && (
            <PageTitle
              pageTitle={pageTitle}
              withMarketSwitcher={withMarketSwitcher}
              withMigrateButton={false}
              bridge={bridge}
            />
          )}

          {titleComponent && titleComponent}

          <Box
            sx={
              isSecondary
                ? {
                    background: '#09122E',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: isSecondary ? '15px' : '0px',
                    borderRadius: isSecondary ? '8px' : 0,
                    '@media (max-width: 1110px)': {
                      flexDirection: 'column',
                      gap: '20px',
                    },
                  }
                : {
                    width: '100%',
                  }
            }
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
