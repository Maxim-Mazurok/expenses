import GlobalState, {
  Account,
  Category,
  ClientId,
  GapiReady,
  Profile,
  SheetId,
  SpreadSheetId,
} from './types/GlobalState';
import { NewTransaction, Transaction } from './types/Transaction';
import {
  Dashboard,
  PieChart,
  Settings,
  SvgIconComponent,
} from '@material-ui/icons';

export type MenuItem = {
  url: string,
  IconComponent: SvgIconComponent,
  text: string
}

export type Menu = MenuItem[]

export const Menu = [
  {
    url: '/',
    IconComponent: Dashboard,
    text: 'Dashboard',
  },
  {
    url: '/charts',
    IconComponent: PieChart,
    text: 'Charts',
  },
  {
    url: '/settings',
    IconComponent: Settings,
    text: 'Settings',
  },
];

export const getClientId = (state: GlobalState): ClientId => state.settings.clientId;
export const getSpreadSheetId = (state: GlobalState): SpreadSheetId => state.settings.spreadSheetId;
export const getSheetId = (state: GlobalState): SheetId => state.settings.sheetId;
export const getProfile = (state: GlobalState): Profile => state.settings.profile;

export const getAccounts = (state: GlobalState): Account[] => state.data.accounts;
export const getCategories = (state: GlobalState): Category[] => state.data.categories;
export const getTransactions = (state: GlobalState): Transaction[] => state.data.transactions;

export const isGapiReady = (state: GlobalState): GapiReady => state.misc.isGapiReady;
export const getTransaction = (state: GlobalState): Transaction | NewTransaction => state.misc.transaction;
