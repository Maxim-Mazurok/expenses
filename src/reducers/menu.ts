import { SELECT_MENU } from '../actions/selectMenu';
import GlobalState from '../types/GlobalState';
import { MenuActions } from '../actions';
import { defaultState } from '../store';

export const MenuReducer = (state: GlobalState['menu'] = defaultState.menu, action: MenuActions) => {
  switch (action.type) {
    case SELECT_MENU:
      return {
        ...state,
        selectedMenuIndex: action.payload,
      };
    default:
      return state;
  }
};
