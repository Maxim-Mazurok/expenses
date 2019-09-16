import GlobalState from '../types/GlobalState';
import { Dispatch } from 'redux';
import { parseExpense } from '../helpers';
import { SetAccounts, setAccounts } from './setAccounts';
import { SetCategories, setCategories } from './setCategories';
import { SetTransactions, setTransactions } from './setTransactions';
import { ThunkAction } from 'redux-thunk';
import {
  LOAD_ALL_DATA_FAILURE,
  LOAD_ALL_DATA_STARTED,
  LOAD_ALL_DATA_SUCCESS,
} from '../reducers/loadAllData';

const loadAllDataSuccess = (): {
  type: LOAD_ALL_DATA_SUCCESS,
} => ({
  type: LOAD_ALL_DATA_SUCCESS,
});

const loadAllDataStarted = (): {
  type: LOAD_ALL_DATA_STARTED,
} => ({
  type: LOAD_ALL_DATA_STARTED,
});

const loadAllDataFailure = (error: string): {
  type: LOAD_ALL_DATA_FAILURE,
  payload: string,
} => ({
  type: LOAD_ALL_DATA_FAILURE,
  payload: error,
});

export type LoadAllDataAction =
  | ReturnType<typeof loadAllDataStarted>
  | ReturnType<typeof loadAllDataSuccess>
  | ReturnType<typeof loadAllDataFailure>
  ;

type ThunkResult<R> = ThunkAction<R, GlobalState, undefined, LoadAllDataAction>;

export const loadAllData = (): ThunkResult<Promise<void>> => {
  return async (dispatch: Dispatch<LoadAllDataAction | SetAccounts | SetCategories | SetTransactions>, getState: () => GlobalState) => {
    const state = getState();

    if (state.loadAllData.loading) return; // Another loading is in progress

    dispatch(loadAllDataStarted());

    const response: gapi.client.Response<gapi.client.sheets.BatchGetValuesResponse> = await gapi.client.sheets.spreadsheets.values
      .batchGet({
        spreadsheetId: state.settings.spreadSheetId,
        ranges: [
          'Data!A2:A50',
          'Data!E2:E50',
          'Transactions!A2:O',
          'Current!H1',
          'Previous!H1',
        ],
      });
    if (response.result.valueRanges === undefined
      || response.result.valueRanges[0].values === undefined // accounts
      || response.result.valueRanges[1].values === undefined // categories
      || response.result.valueRanges[2].values === undefined // transactions
      || response.result.valueRanges[3].values === undefined // currentMonth
      || response.result.valueRanges[4].values === undefined // previousMonth
    ) {
      dispatch(loadAllDataFailure('Error loading all data')); // TODO: handle more elegantly?
      return;
    }

    dispatch(setAccounts(response.result.valueRanges[0].values.map(
      (items: string[]) => items[0],
    )));

    dispatch(setCategories(response.result.valueRanges[1].values.map(
      (items: string[]) => items[0],
    )));

    dispatch(setTransactions(response.result.valueRanges[2].values
      .map(parseExpense)
      .reverse(),
    ));

    // this.setState({
    //   currentMonth: response.result.valueRanges[3].values[0][0],
    //   previousMonth: response.result.valueRanges[4].values[0][0],
    // });

    dispatch(loadAllDataSuccess());
  };
};
