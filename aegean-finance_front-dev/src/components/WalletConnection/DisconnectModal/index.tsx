import React from 'react';
import { BasicModal } from '../../primitives/BasicModal';
import { useModalContext } from '../../../hooks/useModal';
import {DisconnectModalContent} from "./DisconnectModalContent";

export const DisconnectModal = () => {
  const { openDisconnect, setOpenDisconnect } = useModalContext();
  return (
    <BasicModal open={openDisconnect} setOpen={setOpenDisconnect} contentMaxWidth={500}>
      <DisconnectModalContent setOpenDisconnect={setOpenDisconnect} />
    </BasicModal>
  );
};
