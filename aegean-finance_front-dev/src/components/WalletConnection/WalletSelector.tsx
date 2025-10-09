import { Trans } from '@lingui/macro';
import { Box, Button, Link, Typography } from '@mui/material';
import { UnsupportedChainIdError } from '@web3-react/core';
import { NoEthereumProviderError } from '@web3-react/injected-connector';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { UserRejectedRequestError } from 'src/libs/web3-data-provider/WalletConnectConnector';
import { WalletType } from 'src/libs/web3-data-provider/WalletOptions';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

import { Warning } from '../primitives/Warning';
import { TxModalTitle } from '../transactions/FlowCommons/TxModalTitle';
import { BackArrowText } from '../../assets/svgComponents/BackArrowText';

export type WalletRowProps = {
  walletName: string;
  walletType: WalletType;
};
const WalletRow = ({ walletName, walletType }: WalletRowProps) => {
  const { connectWallet, loading } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const getWalletIcon = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.INJECTED:
        return (
          <img
            src={`/icons/wallets/browserWallet.svg`}
            width="30px"
            height="30px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.WALLET_CONNECT:
        return (
          <img
            src={`/icons/wallets/walletConnect.svg`}
            width="30px"
            height="30px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.WALLET_LINK:
        return (
          <img
            src={`/icons/wallets/coinbase.svg`}
            width="30px"
            height="30px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.TORUS:
        return (
          <img
            src={`/icons/wallets/torus.svg`}
            width="30px"
            height="30px"
            alt={`browser wallet icon`}
          />
        );
      case WalletType.FRAME:
        return (
          <img
            src={`/icons/wallets/frame.svg`}
            width="30px"
            height="30px"
            alt={`browser wallet icon`}
          />
        );
      default:
        return null;
    }
  };

  const connectWalletClick = () => {
    trackEvent(AUTH.CONNECT_WALLET, { walletType: walletType, walletName: walletName });
    connectWallet(walletType);
  };
  return (
    <Button
      disabled={loading}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: '25px',
        padding: '18px 24px',
        borderRadius: '15px',
        width: '100%',
        background: 'transparent',
        borderColor: '#2A3765',
        mb: '8px',
        '&:hover': {
          background: '#152E77',
          borderColor: '#365CD3',
        },
      }}
      size="large"
      onClick={connectWalletClick}
      startIcon={getWalletIcon(walletType)}
    >
      {walletName}
    </Button>
  );
};

export enum ErrorType {
  UNSUPORTED_CHAIN,
  USER_REJECTED_REQUEST,
  UNDETERMINED_ERROR,
  NO_WALLET_DETECTED,
}

interface PropsTypes {
  onBackClick?: () => void;
  title?: string;
}

export const WalletSelector = ({ onBackClick, title }: PropsTypes) => {
  const { error } = useWeb3Context();

  let blockingError: ErrorType | undefined = undefined;
  if (error) {
    if (error instanceof UnsupportedChainIdError) {
      blockingError = ErrorType.UNSUPORTED_CHAIN;
    } else if (error instanceof UserRejectedRequestError) {
      blockingError = ErrorType.USER_REJECTED_REQUEST;
    } else if (error instanceof NoEthereumProviderError) {
      blockingError = ErrorType.NO_WALLET_DETECTED;
    } else {
      blockingError = ErrorType.UNDETERMINED_ERROR;
    }
    // TODO: add other errors
  }


  const handleBlocking = () => {
    switch (blockingError) {
      case ErrorType.UNSUPORTED_CHAIN:
        return <Trans>Network not supported for this wallet</Trans>;
      case ErrorType.USER_REJECTED_REQUEST:
        return <Trans>Rejected connection request</Trans>;
      case ErrorType.NO_WALLET_DETECTED:
        return <Trans>Wallet not detected. Connect or install wallet and retry</Trans>;
      default:
        console.log('Uncatched error: ', error);
        return <Trans>Error connecting. Try refreshing the page.</Trans>;
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {onBackClick && (
        <BackArrowText
          style={{ position: 'absolute', left: 24, top: 24, cursor: 'pointer' }}
          onClick={onBackClick}
        />
      )}
      <TxModalTitle title={title || 'Connect Wallet'} mb={0} />
      <div
        style={{
          color: '#798DCA',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Poppins',
          fontSize: '14px',
          marginBottom: 13,
        }}
      >
        To start using Forward Finance
      </div>
      {error && <Warning severity="error">{handleBlocking()}</Warning>}
      <WalletRow
        key="browser_wallet"
        walletName="Browser wallet"
        walletType={WalletType.INJECTED}
      />
      <WalletRow
        key="walletconnect_wallet"
        walletName="WalletConnect"
        walletType={WalletType.WALLET_CONNECT}
      />
      <WalletRow
        key="walletlink_wallet"
        walletName="Coinbase Wallet"
        walletType={WalletType.WALLET_LINK}
      />
      <WalletRow key="torus_wallet" walletName="Torus" walletType={WalletType.TORUS} />
      <WalletRow key="frame_wallet" walletName="Frame" walletType={WalletType.FRAME} />
      {/*<Box sx={{ display: 'flex', alignItems: 'center', mb: 1, padding: '10px 0' }}>
        <Typography variant="subheader1" color="text.secondary">
          <Trans>Track wallet balance in read-only mode</Trans>
        </Typography>
        <ReadOnlyModeTooltip />
      </Box>
      <form onSubmit={handleSubmit}>
        <InputBase
          sx={(theme) => ({
            py: 1,
            px: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '6px',
            mb: 1,
            overflow: 'show',
            fontSize: sm ? '16px' : '14px',
          })}
          placeholder="Enter ethereum address or username"
          fullWidth
          value={inputMockWalletAddress}
          onChange={(e) => setInputMockWalletAddress(e.target.value)}
          inputProps={{
            'aria-label': 'read-only mode address',
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            mb: '8px',
          }}
          size="large"
          fullWidth
          onClick={() => trackEvent(AUTH.MOCK_WALLET)}
          disabled={
            !utils.isAddress(inputMockWalletAddress) &&
            inputMockWalletAddress.slice(-4) !== '.eth' &&
            !unsTlds.includes(inputMockWalletAddress.split('.').pop() as string)
          }
          aria-label="read-only mode address"
        >
          <Trans>Track wallet</Trans>
        </Button>
      </form>
      {validAddressError && (
        <Typography variant="helperText" color="error.main">
          <Trans>Please enter a valid wallet address.</Trans>
        </Typography>
      )}*/}
      <Typography
        variant="description"
        sx={{
          mt: '18px',
          mb: '6px',
          alignSelf: 'center',
          fontSize: 12,
          lineHeight: '12px',
          fontWeight: 500,
          fontFamily: 'Poppins',
          color: '#798DCA',
        }}
      >
        <Trans>
          By connecting, I accept{' '}
          <Link
            href="https://aave.com/terms-of-service"
            target="_blank"
            rel="noopener"
            sx={{
              color: '#3377FF',
              fontSize: 12,
              lineHeight: '12px',
              fontWeight: 500,
              fontFamily: 'Poppins',
            }}
          >
            Forward Finance Terms of Service
          </Link>
        </Trans>
      </Typography>
      <Typography
        variant="helperText"
        sx={{
          fontSize: 13,
          lineHeight: '13px',
          alignSelf: 'center',
          fontWeight: 500,
          color: '#798DCA',
          fontFamily: 'Poppins',
        }}
      >
        <Trans>Don't see your wallet provider? We are working on adding more</Trans>
      </Typography>
    </Box>
  );
};
