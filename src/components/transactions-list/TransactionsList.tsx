import React, { Component } from 'react';
import '@material/list/dist/mdc.list.css';
import './TransactionsList.css';
import TransactionDetails from './TransactionDetails';
import GlobalState from '../../types/GlobalState';
import { getExpenses } from '../../selectors';
import { connect } from 'react-redux';
import { Transaction } from '../../types/Expense';

const mapStateToProps = (state: GlobalState) => ({
  expenses: getExpenses(state),
});

type Props =
  ReturnType<typeof mapStateToProps> &
  {
    onSelect: (expense: Transaction) => void
  }

class TransactionsList extends Component<Props> {
  render() {
    return (
      <ul className="mdc-list mdc-list--two-line mdc-list--avatar-list">
        {this.props.expenses.slice(0, 30).map(expense =>
          <TransactionDetails
            key={expense.id}
            expense={expense}
            onSelect={this.props.onSelect}
          />,
        )}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(TransactionsList);
