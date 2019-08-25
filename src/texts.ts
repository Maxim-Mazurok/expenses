import { TransactionType } from './types/GlobalState';

export const TransactionTypeName = (type: TransactionType) => {
  const lower = type.toString().toLowerCase();
  return `${lower.substring(0, 1).toUpperCase()}${lower.substring(1)}`;
};
