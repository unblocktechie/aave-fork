import { InformationCircleIcon, MenuIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { ENABLE_TESTNET, PROD_ENV } from 'src/utils/marketsAndNetworksConfig';

import { Link } from '../components/primitives/Link';
import { moreNavigation } from '../ui-config/menu-items';
import { DrawerWrapper } from './components/DrawerWrapper';
import { LanguagesList } from './components/LanguageSwitcher';
import { MobileCloseButton } from './components/MobileCloseButton';
import { NavItems } from './components/NavItems';
import { TestNetModeSwitcher } from './components/TestNetModeSwitcher';
import { ContentWithTooltip } from '../components/ContentWithTooltip';
import {parseUnits} from "ethers/lib/utils";
import {gasLimitRecommendations, ProtocolAction} from "@aave/contract-helpers";
import {GasStation} from "../components/transactions/GasStation/GasStation";

interface MobileMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

const MenuItemsWrapper = ({ children, title }: { children: ReactNode; title: ReactNode }) => (
  <Box sx={{ mb: 6, '&:last-of-type': { mb: 0, '.MuiDivider-root': { display: 'none' } } }}>
    <Box sx={{ px: 2 }}>
      <Typography variant="subheader2" sx={{ color: '#94A1CA', px: 4, py: 2 }}>
        {title}
      </Typography>

      {children}
    </Box>

    <Divider sx={{ borderColor: '#F2F3F729', mt: 6 }} />
  </Box>
);

export const MobileMenu = ({ open, setOpen, headerHeight }: MobileMenuProps) => {
  const { i18n } = useLingui();
  const [isLanguagesListOpen, setIsLanguagesListOpen] = useState(false);
  const { breakpoints } = useTheme();

  const xsm = useMediaQuery(breakpoints.down('xsm'));

  const disableTestnet = () => {
    localStorage.setItem('testnetsEnabled', 'false');
    // Set window.location to trigger a page reload when navigating to the the dashboard
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

  useEffect(() => setIsLanguagesListOpen(false), [open]);

  return (
    <>
      {open ? (
        <MobileCloseButton setOpen={setOpen} />
      ) : (
        <Button
          id="settings-button-mobile"
          variant="surface"
          sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
          onClick={() => setOpen(true)}
        >
          <SvgIcon sx={{ color: '#F1F1F3' }} fontSize="small">
            <MenuIcon />
          </SvgIcon>
        </Button>
      )}
      <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
        {xsm && (
          <Box sx={{ ml: 5 }}>
            {ENABLE_TESTNET && (
              <ContentWithTooltip
                tooltipContent={testnetTooltip}
                offset={[0, -4]}
                withoutHover
              >
                <Button
                  variant="surface"
                  size="small"
                  color="primary"
                  sx={{
                    backgroundColor: '#B6509E',
                    '&:hover, &.Mui-focusVisible': {
                      backgroundColor: 'rgba(182, 80, 158, 0.7)',
                    },
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
        <Box sx={{ml: 5, mt: 5, mb: 5}}>
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
        {!isLanguagesListOpen ? (
          <>
            <MenuItemsWrapper title={<Trans>Menu</Trans>}>
              <NavItems setOpen={setOpen} />
            </MenuItemsWrapper>
            <MenuItemsWrapper title={<Trans>Global settings</Trans>}>
              <List>
                {PROD_ENV && <TestNetModeSwitcher />}
              </List>
            </MenuItemsWrapper>
            <MenuItemsWrapper title={<Trans>Links</Trans>}>
              <List>
                {moreNavigation.map((item, index) => (
                  <ListItem component={Link} href={item.link} sx={{ color: '#F1F1F3' }} key={index}>
                    <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>
                      <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>{item.icon}</SvgIcon>
                    </ListItemIcon>

                    <ListItemText>{i18n._(item.title)}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </MenuItemsWrapper>
          </>
        ) : (
          <List sx={{ px: 2 }}>
            <LanguagesList onClick={() => setIsLanguagesListOpen(false)} />
          </List>
        )}
      </DrawerWrapper>
    </>
  );
};
