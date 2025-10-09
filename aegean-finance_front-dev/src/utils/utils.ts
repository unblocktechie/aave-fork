import { ChainId } from '@aave/contract-helpers';
import { BigNumberValue, USD_DECIMALS, valueToBigNumber } from '@aave/math-utils';

export function hexToAscii(_hex: string): string {
  const hex = _hex.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export interface CancelablePromise<T = unknown> {
  promise: Promise<T>;
  cancel: () => void;
}

export const makeCancelable = <T>(promise: Promise<T>) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const optimizedPath = (currentChainId: ChainId) => {
  return (
    currentChainId === ChainId.arbitrum_one ||
    currentChainId === ChainId.arbitrum_rinkeby ||
    currentChainId === ChainId.optimism
    // ||
    // currentChainId === ChainId.optimism_kovan
  );
};

// Overrides for minimum base token remaining after performing an action
export const minBaseTokenRemainingByNetwork: Record<number, string> = {
  [ChainId.optimism]: '0.0001',
  [ChainId.arbitrum_one]: '0.0001',
};

export const amountToUsd = (
  amount: BigNumberValue,
  formattedPriceInMarketReferenceCurrency: string,
  marketReferencePriceInUsd: string
) => {
  return valueToBigNumber(amount)
    .multipliedBy(formattedPriceInMarketReferenceCurrency)
    .multipliedBy(marketReferencePriceInUsd)
    .shiftedBy(-USD_DECIMALS);
};

export const roundToTokenDecimals = (inputValue: string, tokenDecimals: number) => {
  const [whole, decimals] = inputValue.split('.');

  // If there are no decimal places or the number of decimal places is within the limit
  if (!decimals || decimals.length <= tokenDecimals) {
    return inputValue;
  }

  // Truncate the decimals to the specified number of token decimals
  const adjustedDecimals = decimals.slice(0, tokenDecimals);

  // Combine the whole and adjusted decimal parts
  return whole + '.' + adjustedDecimals;
};

export const toNormalFixed = (num: string | number, afterDot = 2, min?: number): string => {
  const minValue = min ?? 10 ** -(afterDot as number);
  const isSmallerThanMin = num !== 0 && Math.abs(+num) < Math.abs(10 ** -(afterDot as number));
  const smallestNum = isSmallerThanMin ? minValue : num;
  let stringifiedNum = typeof smallestNum === 'number' ? smallestNum.toString() : smallestNum;
  const reg = new RegExp(`(\\.\\d{${afterDot}})\\d+`, 'g');
  return stringifiedNum.replace(reg, '$1');
};

export const unCamelCase = (str: string | undefined) => {
  if (!str) {
    return '';
  }
  return str.replace(/([A-Z])/g, ' $1').trim();
};

export const shortenAddress = (address: string, chars = 6): string => {
  return `${address.substring(0, chars)}...${address.substring(42 - 3)}`;
};

export function calcPercentage(part: number, total: number, decimals = 2) {
  if (total === 0) return 0;
  const percentage = (part / total) * 100;
  return toNormalFixed(percentage, decimals);
}
