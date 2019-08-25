import { Transaction } from './types/Expense';
import { TransactionType } from './types/GlobalState';

export const iconFromCategory = (category: Transaction['category']): string => {
  switch (category) {
    case 'Groceries':
      return 'local_grocery_store';
    case 'Restaurants':
      return 'local_dining';
    case 'Car':
      return 'directions_car';
    case 'Hobbies':
      return 'local_library';
    case 'Household':
      return 'home';
    case 'Shopping':
      return 'local_mall';
    case 'Health':
      return 'local_hospital';
    case 'Entertainment':
      return 'local_movies';
    case 'Tech':
      return 'important_devices';
    case 'Taxi':
      return 'local_taxi';
    case 'Education':
      return 'school';
    default:
      return 'attach_money';
  }
};

export const parseExpense = (value: string[], index: number): Transaction => {
  const amount = parseFloat(value[4].replace(',', ''));
  return {
    type: amount < 0 ? TransactionType.EXPENSE : TransactionType.INCOME, // TODO: get this from table
    id: `Expenses!A${index + 2}`,
    date: new Date(value[0]),
    description: value[1],
    category: value[3],
    amount,
    account: value[2],
  };
};

export const formatExpense = (expense: Transaction) => ([
  `=DATE(${expense.date.getFullYear()}, ${expense.date.getMonth() + 1}, ${expense.date.getDate()})`,
  expense.description,
  expense.account,
  expense.category,
  expense.amount,
]);

export const formatDateToUI = (date: Date): string =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
