import React, { Component } from 'react';
import '@material/list/dist/mdc.list.css';
import './OperationsList.css';
import OperationDetails from './OperationDetails';

interface Props {
  expenses: Expense[]
  onSelect: (expense: Expense) => void
}

class OperationsList extends Component<Props> {
  render() {
    return (
      <ul className="mdc-list mdc-list--two-line mdc-list--avatar-list">
        {this.props.expenses.map(expense =>
          <OperationDetails
            key={expense.id}
            expense={expense}
            onSelect={this.props.onSelect}
          />,
        )}
      </ul>
    );
  }
}

export default OperationsList;
