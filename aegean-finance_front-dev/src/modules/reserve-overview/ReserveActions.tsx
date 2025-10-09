import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { Warning } from 'src/components/primitives/Warning';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { usePermissions } from 'src/hooks/usePermissions';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Link, ROUTES } from '../../components/primitives/Link';
import { ApyGraphContainer } from './graphs/ApyGraphContainer';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import css from './styles.module.scss';
import cn from 'classnames';
import BigNumber from 'bignumber.js';

interface ReserveActionsProps {
  reserve: ComputedReserveData;
  aggregatedStats: { totalLiquidity: BigNumber; totalDebt: BigNumber };
}

const labels = ['Supply', 'Borrow'];

export const ReserveActions = ({ reserve, aggregatedStats }: ReserveActionsProps) => {
  const { currentAccount, loading: loadingWeb3Context } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const { currentMarketData } = useProtocolDataContext();
  const [activeLabel, setActiveLabel] = useState<string>(labels[0]);

  if (!currentAccount && !isPermissionsLoading) {
    return <ConnectWallet loading={loadingWeb3Context} />;
  }

  return (
    <PaperWrapper activeLabel={activeLabel} setActiveLabel={setActiveLabel}>
      {reserve.isFrozen ||
        (reserve.isPaused && (
          <Box sx={{ mt: 3 }}>{reserve.isPaused ? <PauseWarning /> : <FrozenWarning />}</Box>
        ))}
      <ApyGraphContainer
        graphKey={activeLabel === labels[0] ? 'supply' : 'borrow'}
        reserve={reserve}
        currentMarketData={currentMarketData}
        aggregatedStats={aggregatedStats}
      />
    </PaperWrapper>
  );
};

const PauseWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      <Trans>Because this asset is paused, no actions can be taken until further notice</Trans>
    </Warning>
  );
};

const FrozenWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      <Trans>
        Since this asset is frozen, the only available actions are withdraw and repay which can be
        accessed from the <Link href={ROUTES.app}>Landing</Link>
      </Trans>
    </Warning>
  );
};

const PaperWrapper = ({
  children,
  activeLabel,
  setActiveLabel,
}: {
  children: ReactNode;
  activeLabel: string;
  setActiveLabel: (v: string) => void;
}) => {
  return (
    <Paper sx={{ p: 0, pt: '16px' }}>
      <div
        style={{
          paddingLeft: '25px',
          paddingBottom: '16px',
          marginBottom: '24px',
          borderBottom: '1px solid #2A3765',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3">
          <Trans>Market Details</Trans>
        </Typography>
        <ul className={css.graphLabelsList}>
          {labels.map((item, i) => (
            <li
              key={i}
              onClick={() => setActiveLabel(item)}
              className={cn(css.labelItem, item === activeLabel && css.labelItemActive)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {children}
    </Paper>
  );
};

const ConnectWallet = ({ loading }: { loading: boolean }) => {
  return (
    <Paper sx={{ pt: 4, pb: { xs: 4, xsm: 6 }, pr: 0, pl: '16px' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h3" sx={{ mb: { xs: 6, xsm: 10 } }}>
            <Trans>Market Details</Trans>
          </Typography>
          <Typography sx={{ mb: 6 }} color="text.secondary">
            <Trans>Please connect a wallet to view your personal information here.</Trans>
          </Typography>
          <ConnectWalletButton />
        </>
      )}
    </Paper>
  );
};
