import React, { useState } from 'react';
import css from './styles.module.scss';
import { getNetworkConfig } from '../../../utils/marketsAndNetworksConfig';
import { useWeb3Context } from '../../../libs/hooks/useWeb3Context';
import { CompactableTypography, CompactMode } from '../../CompactableTypography';
import { SvgIcon } from '@mui/material';
import { Link } from '../../primitives/Link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { ProviderIcons } from './helpers';
import { GradientButtonBg } from '../../../assets/svgComponents/GradientButtonBg';
import { useWalletModalContext } from '../../../hooks/useWalletModal';
import { CopyIcon } from '../../../assets/svgComponents/CopyIcon';
import { OpenLinkIcon } from '../../../assets/svgComponents/OpenLinkIcon';
import { History } from './History';
import { ConnectedAccounts } from './ConnectedAccounts';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

interface PropsTypes {}

export const WalletDetailContent = ({}: PropsTypes) => {
  const { chainId, loading, currentAccount } = useWeb3Context();
  const { setWalletModalOpen } = useWalletModalContext();
  const networkConfig = getNetworkConfig(chainId);
  const [connectedAccountsOpen, setConnectedAccountsOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const ref = useOutsideClick(() => setConnectedAccountsOpen(false));

  const handleCopy = async () => {
    navigator.clipboard.writeText(currentAccount);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={css.walletDetailsWrapper}>
      <h4 className={css.title}>Account</h4>
      <div className={css.walletInfo}>
        <div className={css.walletInfoLeft}>
          <img
            src={`/icons/wallets/${
              ProviderIcons[
                localStorage.getItem('walletProvider')?.toLowerCase() || 'walletConnect.svg'
              ]
            }`}
            alt="wallet-icon"
            className={css.proverIcon}
          />
          <div className={css.networkAndAccount} ref={ref}>
            <div className={css.network}>
              <div className={css.round} />
              <span className={css.networkName}>
                {networkConfig.name}{' '}
                {networkConfig.name.toLowerCase().includes('network') ||
                networkConfig.name.toLowerCase().includes('unknown')
                  ? ''
                  : 'Network'}
              </span>
            </div>
            <div className={css.account} onClick={() => setConnectedAccountsOpen((prev) => !prev)}>
              <CompactableTypography compactMode={CompactMode.SM} compact={true} loading={loading}>
                {currentAccount}
              </CompactableTypography>
              <SvgIcon>{connectedAccountsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</SvgIcon>
            </div>
            {connectedAccountsOpen && <ConnectedAccounts />}
          </div>
        </div>
        <div className={css.walletInfoRight}>
          <button className={css.switchProviderBtn} onClick={() => setWalletModalOpen(true)}>
            <span>Switch Wallet Provider</span>
            <GradientButtonBg className={css.switchProviderBtnBg} />
          </button>
        </div>
      </div>
      <div className={css.copyAndViewBlock}>
        <div className={css.copy} onClick={handleCopy}>
          <CopyIcon />
          <span>{isCopied ? 'Copied' : 'Copy Address'}</span>
        </div>
        {networkConfig?.explorerLinkBuilder && (
          <Link
            href={networkConfig.explorerLinkBuilder({ address: currentAccount })}
            className={css.view}
          >
            <OpenLinkIcon />
            <span>View on Explorer</span>
          </Link>
        )}
      </div>
      <History />
    </div>
  );
};
