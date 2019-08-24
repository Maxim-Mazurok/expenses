import { Account } from '../types/GlobalState';

export const SET_ACCOUNTS = 'setAccounts';

export const setAccounts = (accounts: Account[]): SetAccounts => ({
  type: SET_ACCOUNTS,
  payload: accounts,
});

export interface SetAccounts {
  type: typeof SET_ACCOUNTS,
  payload: Account[],
}
