import { Transaction } from './Expense';

export type SelectedMenuIndex = number;
export type ClientId = string;
export type SpreadSheetId = string;
export type GapiReady = boolean;
export type Profile = gapi.auth2.BasicProfile | undefined;
export type Account = string;
export type Category = string;

export enum TransactionType {
  EXPENSE,
  INCOME
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
    readonly newTransactionType: TransactionType,
  },
  data: {
    readonly expenses: Transaction[],
    readonly categories: Category[],
    readonly accounts: Account[],
  }
}
