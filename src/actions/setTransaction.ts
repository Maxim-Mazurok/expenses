import { NewTransaction, Transaction } from '../types/Transaction';

export const SET_TRANSACTION = 'setTransaction';

export const setTransaction = (transaction: Transaction | NewTransaction): SetTransaction => ({
  type: SET_TRANSACTION,
  payload: transaction,
});

export interface SetTransaction {
  type: typeof SET_TRANSACTION,
  payload: Transaction | NewTransaction,
}
