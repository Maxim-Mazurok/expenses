import React from 'react';
import { iconFromCategory } from '../../helpers';
import { Transaction } from '../../types/Expense';

export default function TransactionIcon(props: { category: Transaction['category'] }) {
  return (
    <span
      className={`mdc-list-item__start-detail ${props.category}`}
      role="presentation"
    >
        <i className="material-icons" aria-hidden="true">
          {iconFromCategory(props.category)}
        </i>
      </span>
  );
}
