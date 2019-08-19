import React from 'react';
import { iconFromCategory } from '../../helpers';

export default function OperationIcon(props: { category: Expense['category'] }) {
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
