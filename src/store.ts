import { combineReducers, createStore, Reducer } from 'redux';
import GlobalState, { TransactionType } from './types/GlobalState';
import { Actions } from './actions';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { SettingsReducer } from './reducers/settings';
import { MiscReducer } from './reducers/misc';
import { DataReducer } from './reducers/data';

export const defaultState: GlobalState = {
  settings: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    sheetId: undefined,
    spreadSheetId: process.env.REACT_APP_SHEET_ID || '',
    profile: undefined,
  },
  misc: {
    isGapiReady: false,
    transaction: {
      type: TransactionType.EXPENSE,
    },
  },
  data: {
    accounts: [],
    categories: [],
    transactions: [],
  },
};

function configureStore(state: GlobalState = defaultState) {
  const rootReducer: Reducer<GlobalState, Actions> = combineReducers({
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
