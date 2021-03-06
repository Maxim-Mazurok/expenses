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

type CellData = gapi.client.sheets.CellData;

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
  return {
    id: `Transactions!A${index + 2}`,
    date: new Date(value[0]),
    description: value[1],
    fromAccount: value[2],
    toAccount: value[3],
    type: value[4] as TransactionType,
    rate: parseFloat(value[5]) || undefined,
    category: value[6],
    amount: parseFloat(value[7]),
    amountReceived: parseFloat(value[8]) || undefined,
    fee: parseFloat(value[9]),
    taxable: value[10] === 'TRUE',
    cashbackAccount: value[11],
    cashbackAmount: parseFloat(value[12]),
    pointsAccount: value[13],
    pointsAmount: parseFloat(value[14]),
    refundAmount: parseFloat(value[15]),
  };
};

export const cellRowNumber = (cellPath: string) => parseInt(cellPath.split('!')[1].replace(/\D/g, ''));

export const formatTransaction = (transaction: Transaction): CellData[] => [
  {
    userEnteredValue: { formulaValue: `=DATE(${transaction.date.getFullYear()}, ${transaction.date.getMonth() + 1}, ${transaction.date.getDate()})` },
    dataValidation: {
      condition: {
        type: 'DATE_IS_VALID',
      },
    },
    userEnteredFormat: {
      numberFormat: {
        type: 'DATE',
        pattern: 'yyyy"-"mm"-"dd',
      },
    },
  },
  {
    userEnteredValue: { stringValue: transaction.description },
  },
  {
    userEnteredValue: { stringValue: transaction.fromAccount },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!A2:A',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { stringValue: transaction.toAccount },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!A2:A',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { stringValue: transaction.type },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!F2:F',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { numberValue: transaction.rate },
  },
  {
    userEnteredValue: { stringValue: transaction.category },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!E2:E',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { numberValue: transaction.amount },
  },
  {
    userEnteredValue: { numberValue: transaction.amountReceived },
  },
  {
    userEnteredValue: { numberValue: transaction.fee },
  },
  {
    userEnteredValue: { boolValue: transaction.taxable },
    dataValidation: {
      condition: {
        type: 'BOOLEAN',
      },
    },
  },
  {
    userEnteredValue: { stringValue: transaction.cashbackAccount },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!A2:A',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { numberValue: transaction.cashbackAmount },
  },
  {
    userEnteredValue: { stringValue: transaction.pointsAccount },
    dataValidation: {
      showCustomUi: true,
      condition: {
        type: 'ONE_OF_RANGE',
        values: [
          {
            userEnteredValue: '=Data!A2:A',
          },
        ],
      },
    },
  },
  {
    userEnteredValue: { numberValue: transaction.pointsAmount },
  },
  {
    userEnteredValue: { numberValue: transaction.refundAmount },
  },
];

export const formatDateToUI = (date: Date): string =>
  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const colorFromTransactionType = (transactionType: TransactionType): Color[500] => {
  switch (transactionType) {
    case TransactionType.EXPENSE:
      return red[600];
    case TransactionType.INCOME:
      return green[600];
    case TransactionType.TRANSFER:
      return grey[600];
    default:
      console.error('Unknown transaction type');
      return yellow[600];
  }
};
