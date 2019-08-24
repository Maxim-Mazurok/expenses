import GlobalState from '../types/GlobalState';
import { Actions, SELECT_MENU } from '../actions';

export default (state: GlobalState, action: Actions) => {
  switch (action.type) {
    case SELECT_MENU:
      return {
        selectedMenuIndex: action.payload,
      };
    default:
      return state;
  }
};
