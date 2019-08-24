import React, { Component } from 'react';
import '@material/list/dist/mdc.list.css';
import './OperationsList.css';
import OperationDetails from './OperationDetails';
import GlobalState from '../../types/GlobalState';
import { getExpenses } from '../../selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state: GlobalState) => ({
  expenses: getExpenses(state),
});

type Props =
  ReturnType<typeof mapStateToProps> &
  {
    onSelect: (expense: Expense) => void
  }

class OperationsList extends Component<Props> {
  render() {
    return (
      <ul className="mdc-list mdc-list--two-line mdc-list--avatar-list">
        {this.props.expenses.slice(0, 30).map(expense =>
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

export default connect(mapStateToProps)(OperationsList);
