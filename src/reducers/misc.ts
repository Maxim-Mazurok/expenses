import GlobalState from '../types/GlobalState';
import { SET_GAPI_READY } from '../actions/setGapiReady';
import { MiscActions } from '../actions';
import { defaultState } from '../store';
import { SET_NEW_TRANSACTION_TYPE } from '../actions/setNewTransactionType';
import { SET_TRANSACTION } from '../actions/setTransaction';

export const MiscReducer = (state: GlobalState['misc'] = defaultState.misc, action: MiscActions) => {
  switch (action.type) {
    case SET_GAPI_READY:
      return {
        ...state,
        isGapiReady: action.payload,
      };
    case SET_NEW_TRANSACTION_TYPE:
      return {
        ...state,
        transaction: { ...state.transaction, type: action.payload },
      };
    case SET_TRANSACTION:
      return {
        ...state,
        transaction: action.payload,
      };
    default:
      return state;
  }
};
