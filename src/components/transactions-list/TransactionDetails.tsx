import React from 'react';
import {
  colorFromCategory,
  colorFromTransactionType,
  formatDateToUI,
} from '../../helpers';
import { Transaction } from '../../types/Transaction';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
  const amountWithCurrency = (
    account: Transaction['fromAccount'] | Transaction['toAccount'],
    amount: Transaction['amount'],
  ): string => {
    const currency = account.indexOf('(usd)') !== -1 ? Currency.USD : Currency.UAH;
    switch (currency) {
      case Currency.USD:
        return `${currency}${amount}`;
      case Currency.UAH:
        return `${amount} ${currency}`;
    }
  };

  const { fromAccount, toAccount, amount, amountReceived, rate } = transaction;

  if (toAccount !== '') {
    if (rate !== undefined) {
      const convertedAmount = amount * rate;
      return `${amountWithCurrency(fromAccount, amount)} → ${amountWithCurrency(toAccount, convertedAmount)}`;
    } else if (amountReceived !== undefined) {
      return `${amountWithCurrency(fromAccount, amount)} → ${amountWithCurrency(toAccount, amountReceived)}`;
    }
  }

  return amountWithCurrency(fromAccount, amount);
};

export default function TransactionDetails(props: Props) {
  return (
    <ListItem
      button
      onClick={() => props.onSelect(props.transaction)}
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
        primaryTypographyProps={{
          style: { color: colorFromTransactionType(props.transaction.type) },
        }}
        secondary={formatDateToUI(props.transaction.date)}
      />
    </ListItem>
  );
}
