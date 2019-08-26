import React from 'react';
import {
  colorFromCategory,
  formatDateToUI,
  getColorFromTransactionType,
} from '../../helpers';
import { Transaction } from '../../types/Transaction';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import TransactionIcon from './TransactionIcon';

interface Props {
  onSelect: (transaction: Transaction) => void,
  transaction: Transaction,
}

enum Currency {
  USD = '$',
  UAH = 'UAH',
}

const primaryText = (transaction: Transaction): string => {
  const currency = transaction.account.indexOf('(usd)') !== -1 ? Currency.USD : Currency.UAH;
  const amount = transaction.amount.toString().replace(/-/g, '');
  switch (currency) {
    case Currency.USD:
      return `${currency}${amount}`;
    case Currency.UAH:
      return `${amount} ${currency}`;
  }
};

const useStyles = makeStyles({
  root: (props: Props) => ({
    backgroundColor: getColorFromTransactionType(props.transaction.type),
    '&:hover': {
      backgroundColor: getColorFromTransactionType(props.transaction.type, 100),
    },
  }),
});

export default function TransactionDetails(props: Props) {
  const classes = useStyles(props);

  return (
    <ListItem
      button
      onClick={() => props.onSelect(props.transaction)}
      className={classes.root}
    >
      <ListItemAvatar>
        <Avatar
          style={{ background: colorFromCategory(props.transaction.category) }}
        >
          <TransactionIcon
            category={props.transaction.category}
          />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={primaryText(props.transaction)}
        secondary={formatDateToUI(props.transaction.date)}
      />
    </ListItem>
  );
}
