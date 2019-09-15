import GlobalState from '../types/GlobalState';
import { SET_CLIENT_ID } from '../actions/setClientId';
import { SET_SPREADSHEET_ID } from '../actions/setSpreadSheetId';
import { SET_PROFILE } from '../actions/setProfile';
import { SettingsActions } from '../actions';
import { defaultState } from '../store';
import { SET_SHEET_ID } from '../actions/setSheetId';

export const SettingsReducer = (state: GlobalState['settings'] = defaultState.settings, action: SettingsActions): typeof defaultState.settings => {
  switch (action.type) {
    case SET_SHEET_ID:
      return {
        ...state,
        sheetId: action.payload,
      };
    case SET_SPREADSHEET_ID:
      return {
        ...state,
        spreadSheetId: action.payload,
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.payload,
      };
    default:
      return state;
  }
};
