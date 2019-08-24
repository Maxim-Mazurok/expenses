import { TransactionType } from '../types/GlobalState';

export const SET_NEW_TRANSACTION_TYPE = 'setNewTransactionType';

export const setNewTransactionType = (type: TransactionType): SetNewTransactionType => ({
  type: SET_NEW_TRANSACTION_TYPE,
  payload: type,
});

export interface SetNewTransactionType {
  type: typeof SET_NEW_TRANSACTION_TYPE,
  payload: TransactionType,
}
