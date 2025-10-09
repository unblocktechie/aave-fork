import React, { useEffect, useState } from 'react';
import css from './styles.module.scss';
import { useTransactionHistory } from '../../../hooks/useTransactionHistory';
import { SuccessTxIcon } from '../../../assets/svgComponents/SuccessTxIcon';
import { FailedTxIcon } from '../../../assets/svgComponents/FailedTxIcon';
import cn from 'classnames';
import { unCamelCase } from '../../../utils/utils';
import { ethers } from 'ethers';
import { useProtocolDataContext } from '../../../hooks/useProtocolDataContext';
import {
  TransactionHistoryItem,
  TransactionHistoryItemUnion,
} from '../../../modules/history/types';
import { getNetworkConfig } from '../../../utils/marketsAndNetworksConfig';
import { JsonRpcProvider } from '@ethersproject/providers';

interface PropsTypes {}

export const History = ({}: PropsTypes) => {
  const { data: transactions, isLoading } = useTransactionHistory({
    isFilterActive: false,
  });
  const [txWithStatuses, setTxWithStatuses] = useState<TransactionHistoryItemUnion[]>([]);
  const { currentNetworkConfig } = useProtocolDataContext();
  const { currentChainId } = useProtocolDataContext();
  const [converting, setConverting] = useState<boolean>(false);

  useEffect(() => {
    if (transactions?.pages[0]) {
      Promise.all(
        transactions?.pages[0]?.map(async (tx: TransactionHistoryItem, i) => {
          i === 0 && setConverting(true);
          const networkInfo = getNetworkConfig(currentChainId);
          const provider = new JsonRpcProvider(networkInfo.publicJsonRPCUrl[0], currentChainId);
          const receipt = await provider.getTransactionReceipt(tx.txHash);
          return { ...tx, status: receipt?.status || 0 };
        })
      )
        .then((res) => {
          setTxWithStatuses(res as TransactionHistoryItemUnion[]);
          setConverting(false);
        })
        .catch(() => setConverting(false));
    }
  }, [transactions]);

  return (
    <div className={css.historyWrapper}>
      <h5 className={css.historyTitle}>History</h5>
      {isLoading || converting ? (
        <span className={css.waringText}>Loading...</span>
      ) : !txWithStatuses?.length ? (
        <span className={css.waringText}>No history</span>
      ) : (
        <ul className={css.txHistoryList}>
          {txWithStatuses.map(
            (tx, i) => (
              <li key={i} className={css.txHistoryItem}>
                <div className={css.txInfo}>
                  {tx.status === 1 ? (
                    <SuccessTxIcon className={css.statusIcon} />
                  ) : (
                    <FailedTxIcon className={css.statusIcon} />
                  )}
                  <div className={css.txText}>
                    <span className={cn(css.statusText, tx.status !== 1 && css.statusTextFailed)}>
                      {tx.status === 1 ? 'Transaction Confirmed' : 'Transaction Failed'}
                    </span>
                    <span className={css.txAction}>
                      {unCamelCase(tx.action)}{' '}
                      {(tx as any)?.amount &&
                        `${ethers.utils.formatUnits(
                          (tx as any)?.amount,
                          (tx as any)?.reserve?.decimals || 18
                        )}`}{' '}
                      <b>{(tx as any)?.reserve?.symbol}</b>
                    </span>
                  </div>
                </div>
                <div className={css.scanner}>
                  <a
                    target={'_blank'}
                    href={currentNetworkConfig.explorerLinkBuilder({
                      tx: tx.txHash,
                    })}
                  >
                    View on Explorer
                  </a>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
