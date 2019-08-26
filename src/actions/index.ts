import { SetClientId } from './setClientId';
import { SetSpreadSheetId } from './setSpreadSheetId';
import { SetGapiReady } from './setGapiReady';
import { SetProfile } from './setProfile';
import { SelectMenu } from './selectMenu';
import { SetCategories } from './setCategories';
import { SetAccounts } from './setAccounts';
import { SetTransactions } from './setTransactions';
import { SetNewTransactionType } from './setNewTransactionType';
import { SetTransaction } from './setTransaction';

export type MenuActions = SelectMenu
export type SettingsActions =
  | SetClientId
  | SetProfile
  | SetSpreadSheetId
export type MiscActions =
  | SetGapiReady
  | SetNewTransactionType
  | SetTransaction
export type DataActions =
  | SetCategories
  | SetAccounts
  | SetTransactions

export type Actions =
  & MenuActions
  & SettingsActions
  & MiscActions
  & DataActions
  ;
