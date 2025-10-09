import { normalize } from '@aave/protocol-js';

export const normalizeAvg = (
  firstVal: string,
  secondVal: string,
  decimals: number,
): string => {
  const sum = +normalize(firstVal, decimals) + +normalize(secondVal, decimals);
  return (sum / 2).toString();
};
