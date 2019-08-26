import React, { Component } from 'react';
import '@material/list/dist/mdc.list.css';
import TransactionDetails from './TransactionDetails';
import GlobalState from '../../types/GlobalState';
import { getTransactions } from '../../selectors';
import { connect } from 'react-redux';
import { Transaction } from '../../types/Transaction';
import List from '@material/react-list';

const mapStateToProps = (state: GlobalState) => ({
  transactions: getTransactions(state),
});

type Props =
  ReturnType<typeof mapStateToProps> &
  {
    onSelect: (expense: Transaction) => void
  }

class TransactionsList extends Component<Props> {
  render() {
    return (
      <List>
        {this.props.transactions.slice(0, 30).map(transaction =>
          <TransactionDetails
            key={transaction.id}
            transaction={transaction}
            onSelect={this.props.onSelect}
          />,
        )}
      </List>
    );
  }
}

export default connect(mapStateToProps)(TransactionsList);
