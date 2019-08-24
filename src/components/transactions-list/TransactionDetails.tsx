import React, { Component } from 'react';
import TransactionIcon from './TransactionIcon';
import { ListItem } from '@material/react-list';
import { formatDateToUI } from '../../helpers';
import { Transaction } from '../../types/Expense';

interface Props {
  onSelect: (expense: Transaction) => void,
  expense: Transaction,
}

export default class TransactionDetails extends Component<Props> {
  render() {
    return (
      <ListItem
        onClick={() => this.props.onSelect(this.props.expense)}
      >
        <TransactionIcon category={this.props.expense.category} />
        <span className="mdc-list-item__text">
          {this.props.expense.category}
          <span className="mdc-list-item__text__secondary">
            {formatDateToUI(this.props.expense.date)}
            {this.props.expense.description}
          </span>
        </span>
        <span className="mdc-list-item__end-detail">
          {this.props.expense.account.indexOf('(usd)') === -1 ? '₴' : '$'}{this.props.expense.amount}
        </span>
      </ListItem>
    );
  }
}
