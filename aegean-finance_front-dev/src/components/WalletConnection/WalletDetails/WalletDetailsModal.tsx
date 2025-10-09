import React from 'react';
import { BasicModal } from '../../primitives/BasicModal';
import { useModalContext } from '../../../hooks/useModal';
import { WalletDetailContent } from './WalletDetailContent';

export const WalletDetailsModal = () => {
  const { openWalletDetails, setOpenWalletDetails } = useModalContext();
  return (
    <BasicModal open={openWalletDetails} setOpen={setOpenWalletDetails} contentMaxWidth={553}>
      <WalletDetailContent />
    </BasicModal>
  );
};
