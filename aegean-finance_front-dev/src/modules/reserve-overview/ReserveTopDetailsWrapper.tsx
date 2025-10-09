import { Box, Link, Skeleton } from '@mui/material';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import css from './styles.module.scss';
import cn from 'classnames';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { GhoReserveTopDetails } from './Gho/GhoReserveTopDetails';
import { ReserveTopDetails } from './ReserveTopDetails';
import { ArrowIcon } from '../../assets/svgComponents/ArrowIcon';
import React, { useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { ROUTES } from '../../components/primitives/Link';

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetailsWrapper = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const { reserves, loading } = useAppDataContext();
  const { currentMarket } = useProtocolDataContext();
  const [displayGho] = useRootStore((store) => [store.displayGho]);
  const [assetSelectionOpen, setAssetSelectionOpen] = useState<boolean>(false);
  const ref = useOutsideClick(() => setAssetSelectionOpen(false));

  const poolReserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  const allAssets = reserves.map((item) => ({
    iconSymbol: item.iconSymbol,
    detailsAddress: item.underlyingAsset,
  }));

  const getReserveIcon = (iconSymbol?: string) => {
    return (
      <Box mr={3} sx={{ mr: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Skeleton variant="circular" width={33} height={33} sx={{ background: '#383D51' }} />
        ) : (
          <img
            src={`/icons/tokens/${iconSymbol || poolReserve.iconSymbol.toLowerCase()}.svg`}
            width="33px"
            height="33px"
            alt=""
          />
        )}
      </Box>
    );
  };

  const isGho = displayGho({ symbol: poolReserve.symbol, currentMarket });

  return (
    <TopInfoPanel isSecondary>
      <div className={css.tokenDropdownBody} ref={ref}>
        <div className={css.tokenDropdown} onClick={() => setAssetSelectionOpen((prev) => !prev)}>
          <div className={css.dropdownTokenInfo}>
            {getReserveIcon()}
            {!loading && <span>{poolReserve.symbol}</span>}
          </div>
          <ArrowIcon className={cn(css.arrowIcon, assetSelectionOpen && css.arrowIconOpen)} />
        </div>
        {assetSelectionOpen && (
          <div className={css.assetsListBody}>
            <ul className={css.assetsList}>
              {allAssets.map((asset, i) => (
                <li key={i} className={css.assetItem}>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    href={ROUTES.reserveOverview(asset.detailsAddress, currentMarket)}
                    noWrap
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    {getReserveIcon(asset.iconSymbol.toLowerCase())}
                    <span>{asset.iconSymbol}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isGho ? <GhoReserveTopDetails /> : <ReserveTopDetails underlyingAsset={underlyingAsset} />}
    </TopInfoPanel>
  );
};
