import { SetClientId } from './setClientId';
import { SetSpreadSheetId } from './setSpreadSheetId';
import { SetGapiReady } from './setGapiReady';
import { SetProfile } from './setProfile';
import { SetCategories } from './setCategories';
import { SetAccounts } from './setAccounts';
import { SetTransactions } from './setTransactions';
import { SetNewTransactionType } from './setNewTransactionType';
import { SetTransaction } from './setTransaction';
import { SetSheetId } from './setSheetId';

export type SettingsActions =
  | SetClientId
  | SetProfile
  | SetSpreadSheetId
  | SetSheetId
export type MiscActions =
  | SetGapiReady
  | SetNewTransactionType
  | SetTransaction
export type DataActions =
  | SetCategories
  | SetAccounts
  | SetTransactions

export type Actions =
  & SettingsActions
  & MiscActions
  & DataActions
  ;
