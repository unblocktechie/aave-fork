import React from 'react';
import css from './styles.module.scss';
import { toNormalFixed } from '../../utils/utils';
import cn from 'classnames';

interface PropsTypes<T> {
  value: T;
  setValue: (v: T) => void;
  amountIn$: T;
  balance: T;
  maxAmount?: T;
  disabled?: boolean;
  onCustomChange?: (v: T) => void;
}

function calculatePercentage(percentage: number, number: string, min?: number) {
  const res = (percentage / 100) * +number;
  return toNormalFixed(res.toString(), 6, min);
}

function calculatePercentageOfTotal(currentValue: number, total: number) {
  return Math.min((currentValue / total) * 100, 100);
}

export const PercentageInput = <T extends string>({
  amountIn$,
  setValue,
  value,
  balance,
  maxAmount,
  disabled,
  onCustomChange,
}: PropsTypes<T>) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(+e.target.value)) {
      if (+e.target.value > +(maxAmount || balance || '0')) {
        onCustomChange
          ? onCustomChange(toNormalFixed(maxAmount || balance, 6) as T)
          : setValue(maxAmount || balance);
      } else {
        const v = e.target.value.replace(',', '.').replace('..', '.') as T;
        onCustomChange ? onCustomChange(v) : setValue(v);
      }
    }
  };
  const minValue = Math.abs(+(maxAmount || balance)) <= 10 ** -6 ? 0 : undefined;
  return (
    <div className={css.percentageInputWrapper}>
      <div className={css.inputPanel}>
        <span className={css.amountText}>Amount</span>
        <input
          value={value}
          onChange={handleInputChange}
          className={css.percentageInput}
          type="text"
          placeholder={'0.00'}
          disabled={disabled}
        />
        <button
          onClick={() => setValue(toNormalFixed(maxAmount || balance, 6, minValue) as T)}
          className={css.maxBtn}
        >
          Max
        </button>
      </div>
      <div className={css.amountInUsd}>~${toNormalFixed(amountIn$, 2)}</div>
      <div className={css.line}>
        <div
          className={css.lineActive}
          style={{
            width: `${calculatePercentageOfTotal(
              +toNormalFixed(value || '0', 6),
              +toNormalFixed(maxAmount || balance || '0', 6)
            )}%`,
          }}
        />
      </div>
      <ul className={css.percentageAmountList}>
        {[0, 25, 50, 75, 100].map((item, i) => (
          <li key={i} className={css.percentageAmountItem}>
            <div
              className={cn(
                css.dot,
                calculatePercentageOfTotal(
                  +toNormalFixed(value || '0', 6),
                  +toNormalFixed(maxAmount || balance || '0', 6)
                ) >= item && css.dotActive
              )}
              onClick={() =>
                setValue(
                  i === 0
                    ? ('0' as T)
                    : (calculatePercentage(item, maxAmount || balance, minValue).toString() as T)
                )
              }
            />
            <span className={css.value}>{item}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
