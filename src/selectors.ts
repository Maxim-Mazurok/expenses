import GlobalState, {
  Account,
  Category,
  ClientId,
  GapiReady,
  Profile,
  SelectedMenuIndex,
  SpreadSheetId,
} from './types/GlobalState';
import { NewTransaction, Transaction } from './types/Transaction';

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

export const getClientId = (state: GlobalState): ClientId => state.settings.clientId;
export const getSpreadSheetId = (state: GlobalState): SpreadSheetId => state.settings.spreadSheetId;
export const getProfile = (state: GlobalState): Profile => state.settings.profile;

export const getAccounts = (state: GlobalState): Account[] => state.data.accounts;
export const getCategories = (state: GlobalState): Category[] => state.data.categories;
export const getTransactions = (state: GlobalState): Transaction[] => state.data.transactions;

export const isGapiReady = (state: GlobalState): GapiReady => state.misc.isGapiReady;
export const getTransaction = (state: GlobalState): Transaction | NewTransaction => state.misc.transaction;
