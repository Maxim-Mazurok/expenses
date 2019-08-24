import { Transaction } from '../types/Expense';

export const SET_EXPENSES = 'setExpenses';

export const setExpenses = (expenses: Transaction[]): SetExpenses => ({
  type: SET_EXPENSES,
  payload: expenses,
});

export interface SetExpenses {
  type: typeof SET_EXPENSES,
  payload: Transaction[],
}
