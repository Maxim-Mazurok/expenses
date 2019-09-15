import { NewTransaction, Transaction } from './Transaction';

export type SheetId = gapi.client.sheets.SheetProperties['sheetId'];
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
  // TODO: // DEPOSIT = 'DEPOSIT',
}

export default interface GlobalState {
  settings: {
    readonly clientId: ClientId,
    readonly spreadSheetId: SpreadSheetId,
    readonly sheetId: SheetId,
    readonly profile: Profile,
  },
  misc: {
    readonly isGapiReady: GapiReady,
    readonly transaction: Transaction | NewTransaction,
  },
  data: {
    readonly transactions: Transaction[],
    readonly categories: Category[],
    readonly accounts: Account[],
  }
}
