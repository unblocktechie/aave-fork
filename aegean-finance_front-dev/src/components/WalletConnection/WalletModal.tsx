import { useWalletModalContext } from 'src/hooks/useWalletModal';

import { BasicModal } from '../primitives/BasicModal';
import { WalletSelector } from './WalletSelector';

interface ModalProps {
  onBackClick?: () => void;
}
export const WalletModal = ({ onBackClick }: ModalProps) => {
  const { isWalletModalOpen, setWalletModalOpen } = useWalletModalContext();

  return (
    <BasicModal open={isWalletModalOpen} setOpen={setWalletModalOpen} contentMaxWidth={500}>
      <WalletSelector onBackClick={onBackClick} />
    </BasicModal>
  );
};
