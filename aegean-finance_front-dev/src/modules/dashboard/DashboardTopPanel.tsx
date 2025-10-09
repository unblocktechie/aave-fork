import { InterestRate } from '@aave/contract-helpers';
import { USD_DECIMALS, valueToBigNumber } from '@aave/math-utils';
import { Skeleton } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { NetAPYTooltip } from 'src/components/infoTooltips/NetAPYTooltip';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { GENERAL } from 'src/utils/mixPanelEvents';
import css from './styles.module.scss';
import cn from 'classnames';

import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { LiquidationRiskParametresInfoModal } from './LiquidationRiskParametresModal/LiquidationRiskParametresModal';
import { LeftDashInfoBg } from '../../assets/svgComponents/LeftDashInfoBg';
import { RightDashBg } from '../../assets/svgComponents/RightDashBg';
import { calcPercentage, toNormalFixed } from '../../utils/utils';
import {
  assetCanBeBorrowedByUser,
  getMaxAmountAvailableToBorrow,
} from '../../utils/getMaxAmountAvailableToBorrow';

export const DashboardTopPanel = () => {
  const { user, reserves, loading, marketReferencePriceInUsd } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const [open, setOpen] = useState(false);
  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === '0'
      ? '0'
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || '1')
          .toFixed();
  const tokensToBorrow = reserves
    .filter((reserve) => assetCanBeBorrowedByUser(reserve, user))
    .map((reserve: ComputedReserveData) => {
      const availableBorrows = user
        ? Number(getMaxAmountAvailableToBorrow(reserve, user, InterestRate.Variable))
        : 0;

      return {
        value: valueToBigNumber(availableBorrows)
          .multipliedBy(reserve.formattedPriceInMarketReferenceCurrency)
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS)
          .toFixed(2),
        id: reserve.id,
      };
    });

  const collateralAvailable =
    +user.userReservesData[1]?.underlyingBalanceUSD > 0
      ? user.userReservesData[1].underlyingBalanceUSD
      : user?.userReservesData?.find((item) => +item.underlyingBalanceUSD > 0)?.underlyingBalanceUSD ||
        '0';
  const availableToBorrow =
    +tokensToBorrow[1]?.value > 0
      ? tokensToBorrow[1].value
      : tokensToBorrow?.find((item) => +item.value > 0)?.value || '0';

  return (
    <>
      <TopInfoPanel>
        <div className={css.userInfoWrapper}>
          <div className={css.leftSide}>
            <LeftDashInfoBg className={css.bgDash} />
            <div className={css.balanceWrapper}>
              <span>Supply Balance</span>
              <b className={css.balanceBold}>
                $
                <FormattedNumber
                  value={user?.totalLiquidityUSD || 0}
                  variant="secondary14"
                  sx={{
                    fontSize: '36px',
                    lineHeight: '44px',
                    fontFamily: 'Overlock',
                    fontWeight: 900,
                    color: '#32a2db',
                  }}
                />
              </b>
            </div>
          </div>
          <div className={css.netApy}>
            <div className={css.netApyTitleWrapper}>
              <span style={{textTransform: 'uppercase'}}>Net APY</span>
              <NetAPYTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: { tooltip: 'NET APY: Dashboard Banner' },
                }}
              />
            </div>

            {loading ? (
              <Skeleton width={95} height={40} />
            ) : (
              <b>
                {currentAccount && Number(user?.netWorthUSD) > 0
                  ? `${toNormalFixed(user.netAPY, 2)}%`
                  : '0.00'}
              </b>
            )}
          </div>
          <div className={css.rightSide}>
            <RightDashBg className={css.bgDash} />
            <div className={css.balanceWrapper}>
              <span>Borrow Balance</span>
              <b className={cn(css.balanceBold, css.balanceBoldSecondary)}>
                $
                <FormattedNumber
                  value={user?.totalBorrowsUSD || 0}
                  variant="secondary14"
                  sx={{
                    fontSize: '36px',
                    lineHeight: '44px',
                    fontFamily: 'Overlock',
                    fontWeight: 900,
                    color: '#606060',
                  }}
                />
              </b>
            </div>
            <div className={css.borrowWrapper}>
              <span>Borrow limit</span>
              <b className={css.balanceBold}>
                {calcPercentage(+availableToBorrow, +collateralAvailable)}%
              </b>
              {!!tokensToBorrow.length && (
                <p style={{textTransform: 'uppercase'}}>
                  Available to borrow{' '}
                  <b>
                    $
                    {
                      <FormattedNumber
                        value={availableToBorrow}
                        variant="secondary14"
                        sx={{
                          fontSize: '13px',
                          lineHeight: '19px',
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          color: '#F59238',
                        }}
                      />
                    }
                  </b>
                </p>
              )}
            </div>
          </div>
        </div>
      </TopInfoPanel>
      <LiquidationRiskParametresInfoModal
        open={open}
        setOpen={setOpen}
        healthFactor={user?.healthFactor || '-1'}
        loanToValue={loanToValue}
        currentLoanToValue={user?.currentLoanToValue || '0'}
        currentLiquidationThreshold={user?.currentLiquidationThreshold || '0'}
      />
    </>
  );
};
