export const SET_EXPENSES = 'setExpenses';

export const setExpenses = (expenses: Expense[]): SetExpenses => ({
  type: SET_EXPENSES,
  payload: expenses,
});

export interface SetExpenses {
  type: typeof SET_EXPENSES,
  payload: Expense[],
}
