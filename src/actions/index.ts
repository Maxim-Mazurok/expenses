import { SetClientId } from './setClientId';
import { SetSpreadSheetId } from './setSpreadSheetId';
import { SetGapiReady } from './setGapiReady';
import { SetProfile } from './setProfile';
import { SelectMenu } from './selectMenu';
import { SetCategories } from './setCategories';
import { SetAccounts } from './setAccounts';
import { SetExpenses } from './setExpenses';
import { SetNewTransactionType } from './setNewTransactionType';

export type MenuActions = SelectMenu
export type SettingsActions =
  | SetClientId
  | SetProfile
  | SetSpreadSheetId
export type MiscActions =
  | SetGapiReady
  | SetNewTransactionType
export type DataActions =
  | SetCategories
  | SetAccounts
  | SetExpenses

export type Actions =
  & MenuActions
  & SettingsActions
  & MiscActions
  & DataActions
  ;
