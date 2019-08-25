import { combineReducers, createStore, Reducer } from 'redux';
import GlobalState, { TransactionType } from './types/GlobalState';
import { Actions } from './actions';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { Menu } from './selectors';
import { MenuReducer } from './reducers/menu';
import { SettingsReducer } from './reducers/settings';
import { MiscReducer } from './reducers/misc';
import { DataReducer } from './reducers/data';

const initialMenuIndex = Menu.findIndex(menuItem => menuItem.url === window.location.pathname);

export const defaultState: GlobalState = {
  menu: {
    selectedMenuIndex: initialMenuIndex === -1 ? null : initialMenuIndex,
  },
  settings: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    spreadSheetId: process.env.REACT_APP_SHEET_ID || '',
    profile: undefined,
  },
  misc: {
    isGapiReady: false,
    transaction: {
      type: TransactionType.EXPENSE,
      amount: 0,
      category: '',
      account: '',
      description: '',
      date: new Date(),
    },
  },
  data: {
    accounts: [],
    categories: [],
    expenses: [],
  },
};

function configureStore(state: GlobalState = defaultState) {
  const rootReducer: Reducer<GlobalState, Actions> = combineReducers({
    menu: MenuReducer,
    misc: MiscReducer,
    settings: SettingsReducer,
    data: DataReducer,
  });

  return createStore(
    rootReducer as Reducer<GlobalState, Actions>,
    state as any,
    devToolsEnhancer({ trace: true }),
  );
}

export default configureStore;
