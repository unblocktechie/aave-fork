import React from 'react';
import css from './styles.module.scss';
import cn from 'classnames';
import { DisconnectIcon } from '../../../assets/svgComponents/DisconnectIcon';
import { useWeb3Context } from '../../../libs/hooks/useWeb3Context';

interface PropsTypes {
  setOpenDisconnect: (v: boolean) => void;
}

export const DisconnectModalContent = ({ setOpenDisconnect }: PropsTypes) => {
  const { disconnectWallet } = useWeb3Context();

  return (
    <div className={css.disconnectModalWrapper}>
      <div className={css.disconnectTitle}>Disconnect wallet</div>
      <DisconnectIcon className={css.disconnectIcon} />
      <p className={css.disconnectSubTitle}>Are you sure to disconnect your wallet?</p>
      <div className={css.btnsWrapper}>
        <button className={cn(css.disconnectBtn)} onClick={() => setOpenDisconnect(false)}>
          Cancel
        </button>
        <button
          className={cn(css.disconnectBtn, css.disconnectBtnCancel)}
          onClick={() => {
            disconnectWallet();
            setOpenDisconnect(false);
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};
