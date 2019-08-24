import { SpreadSheetId } from '../types/GlobalState';

export const SET_SPREADSHEET_ID = 'setSpreadsheetId';

export const setSpreadsheetId = (spreadSheetId: SpreadSheetId): SetSpreadSheetId => ({
  type: SET_SPREADSHEET_ID,
  payload: spreadSheetId,
});

export interface SetSpreadSheetId {
  type: typeof SET_SPREADSHEET_ID,
  payload: SpreadSheetId,
}
