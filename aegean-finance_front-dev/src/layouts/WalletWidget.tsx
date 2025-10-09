import { Trans } from '@lingui/macro';
import { Button, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { AvatarSize } from 'src/components/Avatar';
import { UserDisplay } from 'src/components/UserDisplay';
import { WalletModal } from 'src/components/WalletConnection/WalletModal';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { ENABLE_TESTNET, STAGING_ENV } from '../utils/marketsAndNetworksConfig';
import { MobileCloseButton } from './components/MobileCloseButton';
import { WalletDetailsModal } from '../components/WalletConnection/WalletDetails/WalletDetailsModal';
import { useModalContext } from '../hooks/useModal';
import { LogoutIcon } from '../assets/svgComponents/LogoutIcon';
import { DisconnectModal } from '../components/WalletConnection/DisconnectModal';

interface WalletWidgetProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

export default function WalletWidget({ open, setOpen }: WalletWidgetProps) {
  const { connected, loading, readOnlyModeAddress } = useWeb3Context();

  const { setOpenWalletDetails, openWalletDetails, setOpenDisconnect } = useModalContext();
  const { setWalletModalOpen } = useWalletModalContext();

  const { breakpoints } = useTheme();
  const {} = useWalletModalContext();
  const xsm = useMediaQuery(breakpoints.down('xsm'));
  const md = useMediaQuery(breakpoints.down('md'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  /* const networkConfig = getNetworkConfig(chainId);
  let networkColor = '';
  if (networkConfig?.isFork) {
    networkColor = '#ff4a8d';
  } else if (networkConfig?.isTestnet) {
    networkColor = '#7157ff';
  } else {
    networkColor = '#65c970';
  }*/

  /*const handleClose = () => {
    setOpen(false);
  };*/

  const handleClick = () => {
    if (!connected) {
      trackEvent(GENERAL.OPEN_MODAL, { modal: 'Connect Waller' });
      setWalletModalOpen(true);
    } else {
      setOpenWalletDetails(true);
    }
  };

  /* const handleDisconnect = () => {
    if (connected) {
      disconnectWallet();
      trackEvent(AUTH.DISCONNECT_WALLET);
      handleClose();
    }
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(currentAccount);
    trackEvent(AUTH.COPY_ADDRESS);
    handleClose();
  };

  const handleSwitchWallet = (): void => {
    setWalletModalOpen(true);
    trackEvent(AUTH.SWITCH_WALLET);
    handleClose();
  };

  const handleViewOnExplorer = (): void => {
    trackEvent(GENERAL.EXTERNAL_LINK, { Link: 'Etherscan for Wallet' });
    handleClose();
  };*/

  const hideWalletAccountText = xsm && (ENABLE_TESTNET || STAGING_ENV || readOnlyModeAddress);

  /*const Content = ({ component = ListItem }: { component?: typeof MenuItem | typeof ListItem }) => (
    <>
      <Typography
        variant="subheader2"
        sx={{
          display: { xs: 'block', md: 'none' },
          color: '#94A1CA',
          px: 4,
          py: 2,
        }}
      >
        <Trans>Account</Trans>
      </Typography>

      <Box component={component} disabled>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <UserDisplay
            avatarProps={{ size: AvatarSize.XL }}
            titleProps={{
              typography: 'h4',
              addressCompactMode: CompactMode.MD,
            }}
            subtitleProps={{
              addressCompactMode: CompactMode.LG,
              typography: 'caption',
            }}
          />
          {readOnlyModeAddress && (
            <Warning
              icon={false}
              severity="warning"
              sx={{ mt: 3, mb: 0, ...(md ? { background: '#301E04', color: '#FFDCA8' } : {}) }}
            >
              <Trans>Read-only mode.</Trans>
            </Warning>
          )}
        </Box>
      </Box>
      {!md && (
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: '0 16px 10px' }}>
          <Button
            variant="outlined"
            sx={{
              padding: '0 5px',
              marginRight: '10px',
            }}
            size="small"
            onClick={handleSwitchWallet}
          >
            Switch wallet
          </Button>
          <Button
            variant="outlined"
            sx={{
              padding: '0 5px',
            }}
            size="small"
            onClick={handleDisconnect}
            data-cy={`disconnect-wallet`}
          >
            Disconnect
          </Button>
        </Box>
      )}
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: { xs: '#FFFFFF1F', md: 'divider' } }} />

      <Box component={component} disabled>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="caption" color={{ xs: '#FFFFFFB2', md: 'text.secondary' }}>
              <Trans>Network</Trans>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                bgcolor: networkColor,
                width: 6,
                height: 6,
                mr: 2,
                boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
                borderRadius: '50%',
              }}
            />
            <Typography color={{ xs: '#F1F1F3', md: 'text.primary' }} variant="subheader1">
              {networkConfig.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: { xs: '#FFFFFF1F', md: 'divider' } }} />

      <Box
        component={component}
        sx={{ color: { xs: '#F1F1F3', md: 'text.primary', cursor: 'pointer' } }}
        onClick={handleCopy}
      >
        <ListItemIcon
          sx={{
            color: {
              xs: '#F1F1F3',
              md: 'primary.light',
              minWidth: 'unset',
              marginRight: 12,
            },
          }}
        >
          <SvgIcon fontSize="small">
            <DuplicateIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText>
          <Trans>Copy address</Trans>
        </ListItemText>
      </Box>

      {networkConfig?.explorerLinkBuilder && (
        <Link href={networkConfig.explorerLinkBuilder({ address: currentAccount })}>
          <Box
            component={component}
            sx={{ color: { xs: '#F1F1F3', md: 'text.primary' } }}
            onClick={handleViewOnExplorer}
          >
            <ListItemIcon
              sx={{
                color: {
                  xs: '#F1F1F3',
                  md: 'primary.light',
                  minWidth: 'unset',
                  marginRight: 12,
                },
              }}
            >
              <SvgIcon fontSize="small">
                <ExternalLinkIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText>
              <Trans>View on Explorer</Trans>
            </ListItemText>
          </Box>
        </Link>
      )}
      {md && (
        <>
          <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: { xs: '#FFFFFF1F', md: 'divider' } }} />
          <Box sx={{ padding: '16px 16px 10px' }}>
            <Button
              sx={{
                marginBottom: '16px',
                background: '#3377FF',
                color: '#F1F1F3',
                borderRadius: 25,
              }}
              fullWidth
              size="large"
              variant={palette.mode === 'dark' ? 'outlined' : 'text'}
              onClick={handleSwitchWallet}
            >
              Switch wallet
            </Button>
            <Button
              sx={{
                background: '#3377FF',
                color: '#F1F1F3',
                borderRadius: 25,
              }}
              fullWidth
              size="large"
              variant={palette.mode === 'dark' ? 'outlined' : 'text'}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Box>
        </>
      )}
    </>
  );*/

  return (
    <>
      {md && connected && open ? (
        <MobileCloseButton setOpen={setOpen} />
      ) : loading ? (
        <Skeleton height={36} width={126} />
      ) : (
        <Button
          variant={connected ? 'surface' : 'gradient'}
          aria-label="wallet"
          id="wallet-button"
          aria-controls={open ? 'wallet-button' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            p: connected ? '10px 15px' : undefined,
            borderRadius: 4,
            border: 'none',
            maxHeight: 40,
            minWidth: hideWalletAccountText ? 'unset' : undefined,
          }}
          endIcon={
            connected ? (
              <LogoutIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDisconnect(true);
                }}
              />
            ) : undefined
          }
        >
          {connected ? (
            <UserDisplay
              avatarProps={{ size: AvatarSize.SM }}
              oneLiner={true}
              titleProps={{ variant: 'buttonM' }}
            />
          ) : (
            <Trans>Connect wallet</Trans>
          )}
        </Button>
      )}

      {/* {md ? (
        <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
          <List sx={{ px: 2, '.MuiListItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content />
          </List>
        </DrawerWrapper>
      ) : (
        <Menu
          id="wallet-menu"
          MenuListProps={{
            'aria-labelledby': 'wallet-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          keepMounted={true}
        >
          <MenuList disablePadding sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content component={MenuItem} />
          </MenuList>
        </Menu>
      )}*/}

      <WalletModal onBackClick={openWalletDetails ? () => setWalletModalOpen(false) : undefined} />
      <WalletDetailsModal />
      <DisconnectModal />
    </>
  );
}
