/// <reference path="./../../../node_modules/@types/gapi.client/index.d.ts" />
import React, { Component } from 'react';

import './dashboard.scss';

import { TransactionForm, TransactionsList } from '../index';
import '@material/react-top-app-bar/dist/top-app-bar.css';

import MaterialIcon from '@material/react-material-icon';
import '@material/react-material-icon/dist/material-icon.css';

import { Fab } from '@material/react-fab';
import '@material/react-fab/dist/fab.css';

import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';

import Button from '@material/react-button';
import '@material/react-button/dist/button.css';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import GlobalState, { TransactionType } from '../../types/GlobalState';
import { getProfile, getSpreadSheetId, isGapiReady } from '../../selectors';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { Transaction } from '../../types/Expense';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setNewTransactionType } from '../../actions/setNewTransactionType';

const mapStateToProps = (state: GlobalState) => ({
  spreadSheetId: getSpreadSheetId(state),
  isGapiReady: isGapiReady(state),
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setNewTransactionType,
    },
    dispatch,
  );

interface State {
  expenses: Transaction[];
  currentMonth?: string;
  previousMonth?: string;
  showTransactionForm: boolean;
}

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & {}

class Dashboard extends Component<RouteComponentProps<{}> & Props, State> {
  state: State = {
    expenses: [],
    showTransactionForm: false,
  };

  render() {
    return (
      <React.Fragment>
        <TopAppBarFixedAdjust>
          {!this.props.isGapiReady &&
          <LinearProgress indeterminate={true} />
          }
          {this.props.isGapiReady && this.props.profile === undefined &&
          <div className="center">
            <Button
              onClick={() => {
                gapi.auth2.getAuthInstance().signIn();
              }}
            >
              Sign in
            </Button>
          </div>}
          {this.props.profile &&
          <div>
            {this.renderTransactions()}
          </div>}
        </TopAppBarFixedAdjust>
      </React.Fragment>
    );
  }

  handleTransactionSubmit = () => {
    // TODO:
  };
  handleTransactionCancel = () => {
    // TODO: move to TransactionForm and prompt for confirmation if fields are dirty, or just save data (or even better - do both
    this.setState({ showTransactionForm: false });
  };
  handleTransactionDelete = () => {
    // TODO:
  };
  handleTransactionChange = () => {
    // TODO:
  };
  handleTransactionSelect = () => {
    // TODO:
  };
  onNewTransaction = (type: TransactionType) => {
    // TODO: add URL handling (like, /new or something)
    this.setState({ showTransactionForm: true });
    this.props.setNewTransactionType(type);
  };

  renderTransactions() {
    if (this.state.showTransactionForm)
      return (
        <TransactionForm
          onSubmit={this.handleTransactionSubmit}
          onCancel={this.handleTransactionCancel}
          onDelete={this.handleTransactionDelete}
          onChange={this.handleTransactionChange}
        />
      );
    else {
      return (
        <div>
          <TransactionsList
            onSelect={this.handleTransactionSelect}
          />
          <Fab
            onClick={() => this.onNewTransaction(TransactionType.INCOME)}
            className="add-transaction-fab--fixed income"
            aria-label="Add income"
            icon={<MaterialIcon icon="add" />}
          />
          <Fab
            onClick={() => this.onNewTransaction(TransactionType.EXPENSE)}
            className="add-transaction-fab--fixed expense"
            aria-label="Add expense"
            icon={<MaterialIcon icon="remove" />}
          />
        </div>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
