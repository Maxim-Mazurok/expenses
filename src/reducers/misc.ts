import GlobalState from '../types/GlobalState';
import { SET_GAPI_READY } from '../actions/setGapiReady';
import { MiscActions } from '../actions';
import { defaultState } from '../store';

export const MiscReducer = (state: GlobalState['misc'] = defaultState.misc, action: MiscActions) => {
  switch (action.type) {
    case SET_GAPI_READY:
      return {
        ...state,
        isGapiReady: action.payload,
      };
    default:
      return state;
  }
};
