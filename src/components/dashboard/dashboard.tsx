/// <reference path="./../../../node_modules/@types/gapi.client/index.d.ts" />
import React, { Component } from 'react';

import './dashboard.scss';

import { OperationForm, OperationsList } from '../index';

import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import '@material/react-top-app-bar/dist/top-app-bar.css';

import MaterialIcon from '@material/react-material-icon';
import '@material/react-material-icon/dist/material-icon.css';

import { Fab } from '@material/react-fab';
import '@material/react-fab/dist/fab.css';

import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';

import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
  expenses: Expense[];
  signedIn: boolean;
  accounts: string[];
  categories: string[];
  processing: boolean;
  currentMonth?: string;
  previousMonth?: string;
  showExpenseForm: boolean;
}

interface Props {
  signedInChanged: (profile: gapi.auth2.BasicProfile | null) => void
}


class Dashboard extends Component<RouteComponentProps<{}> & Props, State> {
  state = {
    expenses: [],
    signedIn: false,
    processing: false,
    categories: [],
    accounts: [],
    expense: null,
    showExpenseForm: false,
  };

  clientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    '826265862385-p41e559ccssujlfsf49ppmo0gktkf6co.apps.googleusercontent.com';
  spreadsheetId =
    process.env.REACT_APP_SHEET_ID ||
    '1eYrQf0xhs2mTSWEzQRfSM-MD-tCcx1r0NVEacLg3Jrc';

  static parseExpense(value: string[], index: number): Expense {
    return {
      id: `Expenses!A${index + 2}`,
      date: value[0],
      description: value[1],
      category: value[3],
      amount: value[4].replace(',', ''),
      account: value[2],
    };
  }

  componentDidMount() {
    console.log('dash');
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
          ],
          clientId: this.clientId,
          scope:
            'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly',
        })
        .then(() => {
          gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(this.signedInChanged);
          this.signedInChanged(
            gapi.auth2.getAuthInstance().isSignedIn.get(),
          );
        });
    });
  }

  signedInChanged = (signedIn: boolean) => {
    this.setState({ signedIn });
    if (this.state.signedIn) {
      this.props.signedInChanged(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile());
      this.load();
    } else {
      this.props.signedInChanged(null);
    }
  };

  load() {
    gapi.client.sheets.spreadsheets.values
      .batchGet({
        spreadsheetId: this.spreadsheetId,
        ranges: [
          'Data!A2:A50',
          'Data!E2:E50',
          'Expenses!A2:F',
          'Current!H1',
          'Previous!H1',
        ],
      })
      .then((response: gapi.client.Response<gapi.client.sheets.BatchGetValuesResponse>) => {
        if (response.result.valueRanges === undefined
          || response.result.valueRanges[0].values === undefined // accounts
          || response.result.valueRanges[1].values === undefined // categories
          || response.result.valueRanges[2].values === undefined // expenses
          || response.result.valueRanges[3].values === undefined // currentMonth
          || response.result.valueRanges[4].values === undefined // previousMonth
        ) {
          return;
        }
        const accounts = response.result.valueRanges[0].values.map(
          (items: string[]) => items[0],
        );
        const categories = response.result.valueRanges[1].values.map(
          (items: string[]) => items[0],
        );
        this.setState({
          accounts,
          categories,
          expenses: (response.result.valueRanges[2].values || [])
            .map(Dashboard.parseExpense)
            .reverse()
            .slice(0, 30),
          processing: false,
          currentMonth: response.result.valueRanges[3].values[0][0],
          previousMonth: response.result.valueRanges[4].values[0][0],
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <TopAppBarFixedAdjust>
          {this.state.signedIn === undefined &&
          <LinearProgress indeterminate={true} />}
          {!this.state.signedIn &&
          <div className="center">
            <button
              className="mdc-button mdc-button--raised"
              aria-label="Sign in"
              onClick={() => {
                gapi.auth2.getAuthInstance().signIn();
              }}
            >
              <span className="mdc-button__label">Sign in</span>
            </button>
          </div>}
          {this.state.signedIn && this.renderBody()}
        </TopAppBarFixedAdjust>
      </React.Fragment>
    );
  }

  renderBody() {
    if (this.state.processing) return <LinearProgress indeterminate={true} />;
    else
      return (
        <div className="content">
          {this.renderExpenses()}
        </div>
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
    else { // noinspection RequiredAttributes
      return (
        <div>
          <OperationsList
            expenses={this.state.expenses}
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

export default withRouter(Dashboard);
