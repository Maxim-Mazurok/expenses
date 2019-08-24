/// <reference path="./../../../node_modules/@types/gapi.client/index.d.ts" />
import React, { Component } from 'react';

import './dashboard.scss';

import { OperationForm, OperationsList } from '../index';
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
import GlobalState from '../../types/GlobalState';
import { getProfile, getSpreadSheetId, isGapiReady } from '../../selectors';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';

const mapStateToProps = (state: GlobalState) => ({
  spreadSheetId: getSpreadSheetId(state),
  isGapiReady: isGapiReady(state),
  profile: getProfile(state),
});

interface State {
  expenses: Expense[];
  accounts: string[];
  categories: string[];
  processing: boolean;
  currentMonth?: string;
  previousMonth?: string;
  showExpenseForm: boolean;
}

type Props = ReturnType<typeof mapStateToProps>
  & {}

class Dashboard extends Component<RouteComponentProps<{}> & Props, State> {
  state = {
    expenses: [],
    processing: false,
    categories: [],
    accounts: [],
    expense: null,
    showExpenseForm: false,
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
            {this.renderExpenses()}
          </div>}
        </TopAppBarFixedAdjust>
      </React.Fragment>
    );
  }

  handleExpenseSubmit = () => {
    // TODO:
  };
  handleExpenseCancel = () => {
    // TODO:
  };
  handleExpenseDelete = () => {
    // TODO:
  };
  handleExpenseChange = () => {
    // TODO:
  };
  handleExpenseSelect = () => {
    // TODO:
  };
  onExpenseNew = () => {
    // TODO:
  };

  renderExpenses() {
    if (this.state.showExpenseForm)
      return (
        <OperationForm
          categories={this.state.categories}
          accounts={this.state.accounts}
          onSubmit={this.handleExpenseSubmit}
          onCancel={this.handleExpenseCancel}
          onDelete={this.handleExpenseDelete}
          onChange={this.handleExpenseChange}
        />
      );
    else {
      return (
        <div>
          <OperationsList
            onSelect={this.handleExpenseSelect}
          />
          <Fab
            onClick={() => this.onExpenseNew()}
            className="add-transaction-fab--fixed"
            aria-label="Add expense"
            icon={<MaterialIcon icon="add" />}
          />
        </div>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard));
