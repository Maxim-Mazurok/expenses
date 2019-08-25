import { NewTransaction, Transaction } from './Expense';

export type SelectedMenuIndex = number | null;
export type ClientId = string;
export type SpreadSheetId = string;
export type GapiReady = boolean;
export type Profile = gapi.auth2.BasicProfile | undefined;
export type Account = string;
export type Category = string;

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export default interface GlobalState {
  menu: {
    readonly selectedMenuIndex: SelectedMenuIndex,
  },
  settings: {
    readonly clientId: ClientId,
    readonly spreadSheetId: SpreadSheetId,
    readonly profile: Profile,
  },
  misc: {
    readonly isGapiReady: GapiReady,
    readonly transaction: Transaction | NewTransaction,
  },
  data: {
    readonly expenses: Transaction[],
    readonly categories: Category[],
    readonly accounts: Account[],
  }
}
