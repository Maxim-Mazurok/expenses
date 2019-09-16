import { defaultState } from '../store';
import { LoadAllDataAction } from '../actions/loadAllData';

export const LOAD_ALL_DATA_SUCCESS = 'loadAllDataSuccess';
export type LOAD_ALL_DATA_SUCCESS = 'loadAllDataSuccess';

export const LOAD_ALL_DATA_FAILURE = 'loadAllDataFailure';
export type LOAD_ALL_DATA_FAILURE = 'loadAllDataFailure';

export const LOAD_ALL_DATA_STARTED = 'loadAllDataStarted';
export type LOAD_ALL_DATA_STARTED = 'loadAllDataStarted';

export const loadAllDataReducer = (state: typeof defaultState.loadAllData = defaultState.loadAllData, action: LoadAllDataAction): typeof defaultState.loadAllData => {
  switch (action.type) {
    case LOAD_ALL_DATA_STARTED:
      return {
        ...state,
        loading: true,
      };
    case LOAD_ALL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case LOAD_ALL_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Unknown error',
      };
    default:
      return state;
  }
};
