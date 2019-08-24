import GlobalState, {
  Account,
  Category,
  ClientId,
  GapiReady,
  Profile,
  SelectedMenuIndex,
  SpreadSheetId,
  TransactionType,
} from './types/GlobalState';
import { Transaction } from './types/Expense';

export type MenuItem = {
  url: string,
  icon: string,
  text: string
}

export type Menu = MenuItem[]

export const Menu = [
  {
    url: '/',
    icon: 'dashboard',
    text: 'Dashboard',
  },
  {
    url: '/charts',
    icon: 'pie_chart',
    text: 'Charts',
  },
  {
    url: '/settings',
    icon: 'settings',
    text: 'Settings',
  },
];

export const getSelectedMenuIndex = (state: GlobalState): SelectedMenuIndex => state.menu.selectedMenuIndex;
export const getSelectedMenuTitle = (state: GlobalState): MenuItem['text'] => Menu[state.menu.selectedMenuIndex].text;

export const getClientId = (state: GlobalState): ClientId => state.settings.clientId;
export const getSpreadSheetId = (state: GlobalState): SpreadSheetId => state.settings.spreadSheetId;
export const getProfile = (state: GlobalState): Profile => state.settings.profile;

export const getAccounts = (state: GlobalState): Account[] => state.data.accounts;
export const getCategories = (state: GlobalState): Category[] => state.data.categories;
export const getExpenses = (state: GlobalState): Transaction[] => state.data.expenses;

export const isGapiReady = (state: GlobalState): GapiReady => state.misc.isGapiReady;
export const getNewTransactionType = (state: GlobalState): TransactionType => state.misc.newTransactionType;
