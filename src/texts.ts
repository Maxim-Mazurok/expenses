import { TransactionType } from './types/GlobalState';

export const TransactionTypeName = (type: TransactionType) => {
  switch (type) {
    case TransactionType.EXPENSE:
      return 'Expense';
    case TransactionType.INCOME:
      return 'Income';
  }
};
