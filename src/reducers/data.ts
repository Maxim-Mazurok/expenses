import GlobalState from '../types/GlobalState';
import { DataActions } from '../actions';
import { defaultState } from '../store';
import { SET_ACCOUNTS } from '../actions/setAccounts';
import { SET_CATEGORIES } from '../actions/setCategories';
import { SET_EXPENSES } from '../actions/setExpenses';

export const DataReducer = (state: GlobalState['data'] = defaultState.data, action: DataActions): typeof defaultState.data => {
  switch (action.type) {
    case SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
      };
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
      };
    default:
      return state;
  }
};
