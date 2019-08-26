import { Transaction } from './types/Transaction';
import { TransactionType } from './types/GlobalState';
import {
  AccountBalance,
  AssignmentInd,
  AttachMoney,
  CardGiftcard,
  DirectionsCar,
  Home,
  ImportantDevices,
  LocalDining,
  LocalGroceryStore,
  LocalHospital,
  LocalLibrary,
  LocalMall,
  LocalMovies,
  LocalTaxi,
  Loop,
  MoneyOff,
  School,
  ShowChart,
  SmokingRooms,
  SvgIconComponent,
  Timer,
  TrendingDown,
} from '@material-ui/icons';
import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@material-ui/core/colors';
import { Color } from '@material-ui/core';

interface IconAndColor {
  icon: SvgIconComponent,
  color: Color[500],
}

const iconsAndColors: {
  [category: string]: IconAndColor
} = {
  Groceries: {
    icon: LocalGroceryStore,
    color: red[500],
  },
  Restaurants: {
    icon: LocalDining,
    color: pink[500],
  },
  Tips: {
    icon: LocalDining,
    color: pink[300],
  },
  Car: {
    icon: DirectionsCar,
    color: purple[500],
  },
  Taxi: {
    icon: LocalTaxi,
    color: yellow[500],
  },
  Hobbies: {
    icon: LocalLibrary,
    color: deepPurple[500],
  },
  Household: {
    icon: Home,
    color: indigo[500],
  },
  Shopping: {
    icon: LocalMall,
    color: blue[500],
  },
  Health: {
    icon: LocalHospital,
    color: lightBlue[500],
  },
  Entertainment: {
    icon: LocalMovies,
    color: cyan[500],
  },
  Education: {
    icon: School,
    color: green[500],
  },
  Taxes: {
    icon: MoneyOff,
    color: lightGreen[500],
  },
  'Bank Fees': {
    icon: AccountBalance,
    color: lime[500],
  },
  Tech: {
    icon: ImportantDevices,
    color: teal[500],
  },
  Transfer: {
    icon: Loop,
    color: blueGrey[500],
  },
  Deposits: {
    icon: ShowChart,
    color: amber[500],
  },
  Gifts: {
    icon: CardGiftcard,
    color: orange[400],
  },
  Lending: {
    icon: TrendingDown,
    color: deepOrange[500],
  },
  Salary: {
    icon: AssignmentInd,
    color: brown[500],
  },
  Reimbursable: {
    icon: Timer,
    color: deepOrange[300],
  },
  Juul: {
    icon: SmokingRooms,
    color: lightBlue[400],
  },
};

const defaultIconAndColor: IconAndColor = {
  icon: AttachMoney,
  color: grey[500],
};

export const iconFromCategory = (category: Transaction['category']): SvgIconComponent => {
  if (iconsAndColors.hasOwnProperty(category)) {
    return iconsAndColors[category].icon;
  }
  return defaultIconAndColor.icon;
};

export const colorFromCategory = (category: Transaction['category']): Color[500] => {
  if (iconsAndColors.hasOwnProperty(category)) {
    return iconsAndColors[category].color;
  }
  return defaultIconAndColor.color;
};

export const parseExpense = (value: string[], index: number): Transaction => {
  const amount = parseFloat(value[4].replace(',', ''));
  return {
    type: amount > 0 ? TransactionType.EXPENSE : TransactionType.INCOME, // TODO: get this from table
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

export const getColorFromTransactionType = (transactionType: TransactionType, variant: 50 | 100 = 50): Color[500] => {
  switch (transactionType) {
    case TransactionType.EXPENSE:
      return red[variant];
    case TransactionType.INCOME:
      return green[variant];
    case TransactionType.TRANSFER:
      return grey[variant];
  }
};
