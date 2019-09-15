import React, { Component } from 'react';
import TransactionDetails from './TransactionDetails';
import GlobalState from '../../types/GlobalState';
import { getTransactions } from '../../selectors';
import { connect } from 'react-redux';
import { setTransaction } from '../../actions/setTransaction';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { List } from '@material-ui/core';

const mapStateToProps = (state: GlobalState) => ({
  transactions: getTransactions(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setTransaction,
    },
    dispatch,
  );

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {}

class TransactionsList extends Component<RouteComponentProps<{}> & Props> {
  render() {
    return (
      <List>
        {this.props.transactions.slice(0, 30).map(transaction =>
          <TransactionDetails
            key={transaction.id}
            transaction={transaction}
            onSelect={() => this.props.history.push(`/transaction/${transaction.id}`)}
          />,
        )}
      </List>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsList));
