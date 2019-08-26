import { Transaction } from '../types/Transaction';

export const SET_TRANSACTIONS = 'setTransactions';

export const setTransactions = (Transactions: Transaction[]): SetTransactions => ({
  type: SET_TRANSACTIONS,
  payload: Transactions,
});

export interface SetTransactions {
  type: typeof SET_TRANSACTIONS,
  payload: Transaction[],
}
