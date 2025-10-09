import React, { useEffect, useState } from 'react';
import css from './styles.module.scss';
import { useWeb3Context } from '../../../libs/hooks/useWeb3Context';
import { BadgeSize, ExclamationBadge } from '../../badges/ExclamationBadge';
import { Avatar } from '../../Avatar';
import { blo } from 'blo';
import { shortenAddress } from '../../../utils/utils';
import cn from 'classnames';
import { CopyIcon } from '../../../assets/svgComponents/CopyIcon';
import { OpenLinkIcon } from '../../../assets/svgComponents/OpenLinkIcon';
import { Link } from '../../primitives/Link';
import { getNetworkConfig } from '../../../utils/marketsAndNetworksConfig';

interface PropsTypes {}

export const ConnectedAccounts = ({}: PropsTypes) => {
  const { provider, currentAccount, chainId } = useWeb3Context();
  const [connectedWallets, setConnectedWallets] = useState<string[]>([]);
  const networkConfig = getNetworkConfig(chainId);

  const handleCopy = async () => {
    navigator.clipboard.writeText(currentAccount);
    //setIsCopied(true);
    //setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (provider) {
      provider.listAccounts().then(setConnectedWallets);
    }
  }, [provider]);
  return (
    <div className={css.connectedAccountsWrapper}>
      <ul className={css.walletsList}>
        {connectedWallets.map(
          (w, i) => (
            <li key={i} className={css.walletsItem}>
              <div className={css.walletsInfo}>
                <Avatar
                  fallbackImage={w ? blo(w as `0x${string}`) : undefined}
                  loading={false}
                  badge={<ExclamationBadge size={BadgeSize.SM} />}
                  invisibleBadge={true}
                  size={29}
                />
                <div className={css.walletAddrWrapper}>
                  <span
                    className={cn(css.walletAddr, currentAccount === w && css.walletAddrActive)}
                  >
                    {shortenAddress(w)}
                  </span>
                  <span className={css.network}>
                    {networkConfig.name}{' '}
                    {networkConfig.name.toLowerCase().includes('network') ||
                    networkConfig.name.toLowerCase().includes('unknown')
                      ? ''
                      : 'Network'}
                  </span>
                </div>
              </div>
              <div className={css.walletInteractors}>
                <CopyIcon onClick={handleCopy} isCopied={false} />
                <Link
                  href={networkConfig.explorerLinkBuilder({ address: currentAccount })}
                  className={css.view}
                >
                  <OpenLinkIcon />
                </Link>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};
