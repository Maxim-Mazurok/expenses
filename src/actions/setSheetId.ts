import { SheetId } from '../types/GlobalState';

export const SET_SHEET_ID = 'setsheetId';

export const setSheetId = (SheetId: SheetId): SetSheetId => ({
  type: SET_SHEET_ID,
  payload: SheetId,
});

export interface SetSheetId {
  type: typeof SET_SHEET_ID,
  payload: SheetId,
}
