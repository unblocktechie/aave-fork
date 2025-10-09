import { InformationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Button,
  Slide,
  SvgIcon,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContentWithTooltip } from 'src/components/ContentWithTooltip';
import { useRootStore } from 'src/store/root';
import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';

import { Link } from '../components/primitives/Link';
import { uiConfig } from '../uiConfig';
import { NavItems } from './components/NavItems';
import { MobileMenu } from './MobileMenu';
import { SettingsMenu } from './SettingsMenu';
import WalletWidget from './WalletWidget';
import { parseUnits } from 'ethers/lib/utils';
import { GasStation } from '../components/transactions/GasStation/GasStation';
import { gasLimitRecommendations, ProtocolAction } from '@aave/contract-helpers';

interface Props {
  children: React.ReactElement;
}

function HideOnScroll({ children }: Props) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const trigger = useScrollTrigger({ threshold: md ? 160 : 80 });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function AppHeader() {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const sm = useMediaQuery(breakpoints.down('sm'));
  const xsm = useMediaQuery(breakpoints.down('xsm'));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useRootStore((state) => [
    state.mobileDrawerOpen,
    state.setMobileDrawerOpen,
  ]);

  const [walletWidgetOpen, setWalletWidgetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileDrawerOpen && !md) {
      setMobileDrawerOpen(false);
    }
    if (walletWidgetOpen) {
      setWalletWidgetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [md]);

  const headerHeight = md ? 64 : 120;

  const toggleWalletWigit = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setWalletWidgetOpen(state);
  };

  const toggleMobileMenu = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setMobileMenuOpen(state);
  };

  const disableTestnet = () => {
    localStorage.setItem('testnetsEnabled', 'false');
    window.location.href = '/';
  };

  const testnetTooltip = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
      <Typography variant="subheader1">
        <Trans>Testnet mode is ON</Trans>
      </Typography>
      <Typography variant="description">
        <Trans>The app is running in testnet mode. Learn how it works in</Trans>{' '}
        <Link
          href="https://docs.aave.com/faq/testing-aave"
          style={{ fontSize: '14px', fontWeight: 400, textDecoration: 'underline' }}
        >
          FAQ.
        </Link>
      </Typography>
      <Button variant="outlined" sx={{ mt: '12px' }} onClick={disableTestnet}>
        <Trans>Disable testnet</Trans>
      </Button>
    </Box>
  );

  return (
    <HideOnScroll>
      <Box
        component="header"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sx={(theme) => ({
          height: headerHeight,
          position: 'sticky',
          top: 0,
          transition: theme.transitions.create('top'),
          zIndex: theme.zIndex.appBar,
          backgroundImage: 'linear-gradient(#005389, #000c14)',
          padding: {
            xs: mobileMenuOpen || walletWidgetOpen ? '8px 20px' : '8px 8px 8px 20px',
            xsm: '8px 20px',
            pb: '0 !important',
          },
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'space-between',
        })}
      >
        <Box
          component={Link}
          href="/"
          aria-label="Go to homepage"
          sx={{
            lineHeight: 0,
            mr: 3,
            transition: '0.3s ease all',
            '&:hover': { opacity: 0.7 },
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src={sm ? '/logo-sm.svg' : uiConfig.appLogo}
            alt="Forward-Finance"
            width={sm ? 50 : 130}
            height={43}
            style={{ marginRight: sm ? 0 : 40 }}
          />
        </Box>
        {!xsm && (
          <Box sx={{ mr: 3 }}>
            {ENABLE_TESTNET && (
              <ContentWithTooltip tooltipContent={testnetTooltip} offset={[0, -4]} withoutHover>
                <Button
                  variant="surface"
                  size="small"
                  color="primary"
                  sx={{
                    backgroundColor: '#B6509E',
                    '&:hover, &.Mui-focusVisible': { backgroundColor: 'rgba(182, 80, 158, 0.7)' },
                  }}
                >
                  TESTNET
                  <SvgIcon sx={{ marginLeft: '2px', fontSize: '16px' }}>
                    <InformationCircleIcon />
                  </SvgIcon>
                </Button>
              </ContentWithTooltip>
            )}
          </Box>
        )}

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <NavItems />
        </Box>

        <Box
          sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box
            sx={{
              width: '450px',
              justifyContent: 'center',
              alignItems: 'center',
              display: { xs: 'none', md: 'flex' },
              marginRight: '8px'
            }}
          >
            <GasStation
              mt={0}
              gasLimit={parseUnits(
                gasLimitRecommendations[ProtocolAction.default].recommended || '0',
                'wei'
              )}
              skipLoad={true}
              disabled={false}
            />
          </Box>
        </Box>

        {!mobileMenuOpen && (
          <WalletWidget
            open={walletWidgetOpen}
            setOpen={toggleWalletWigit}
            headerHeight={headerHeight}
          />
        )}

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SettingsMenu />
        </Box>

        {!walletWidgetOpen && (
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <MobileMenu
              open={mobileMenuOpen}
              setOpen={toggleMobileMenu}
              headerHeight={headerHeight}
            />
          </Box>
        )}
      </Box>
    </HideOnScroll>
  );
}
