import React, { Component } from "react";
import { LoadingBar, OperationForm, OperationsList } from "./components";

import MaterialIcon from "@material/react-material-icon";
import List, { ListItem, ListItemText, ListItemGraphic, ListDivider } from '@material/react-list';
import "./App.scss";
import TopAppBar, {
  TopAppBarFixedAdjust,
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import { Snackbar } from "@material/react-snackbar";
import Drawer, {
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer';
import Button from '@material/react-button';
import { Cell, Grid, Row } from '@material/react-layout-grid';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Settings from "./components/settings/settings";
import Dashboard from "./components/dashboard/dashboard";
import { Provider } from 'react-redux'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      signedIn: undefined,
      profile: null,
      accounts: [],
      categories: [],
      expenses: [],
      processing: true,
      expense: {},
      currentMonth: undefined,
      previousMonth: undefined,
      showExpenseForm: false,
      snackbarMessage: '',
      snackbarOpen: false,
      drawerOpen: false,
      selectedMenu: 0,
      topAppBarTitle: '',
    };

  }

  handleExpenseSubmit = () => {
    this.setState({ processing: true, showExpenseForm: false });
    const submitAction = (this.state.expense.id
      ? this.update
      : this.append).bind(this);
    submitAction(this.state.expense).then(
      response => {
        this.setState({
          snackbarMessage: `Expense ${this.state.expense.id ? "updated" : "added"}!`,
          snackbarOpen: true,
        });
        this.load();
      },
      response => {
        console.error("Something went wrong");
        console.error(response);
        this.setState({ loading: false });
      }
    );
  };

  handleExpenseChange = (attribute, value) => {
    this.setState({
      expense: Object.assign({}, this.state.expense, { [attribute]: value })
    });
  };

  handleExpenseDelete = (expense) => {
    this.setState({ processing: true, showExpenseForm: false });
    const expenseRow = expense.id.substring(10);
    window.gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: "ROWS",
                  startIndex: expenseRow - 1,
                  endIndex: expenseRow
                }
              }
            }
          ]
        }
      })
      .then(
        response => {
          this.snackbar.labelText = "Operation deleted!";
          this.snackbar.open();
          this.load();
        },
        response => {
          console.error("Something went wrong");
          console.error(response);
          this.setState({ loading: false });
        }
      );
  };

  handleExpenseSelect = (expense) => {
    this.setState({ expense: expense, showExpenseForm: true });
  };

  handleExpenseCancel = () => {
    this.setState({ showExpenseForm: false });
  };

  onExpenseNew() {
    const now = new Date();
    this.setState({
      showExpenseForm: true,
      expense: {
        amount: "",
        description: "",
        date: `${now.getFullYear()}-${now.getMonth() < 9
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1}-${now.getDate() < 10
          ? "0" + now.getDate()
          : now.getDate()}`,
        category: this.state.categories[0],
        account: this.state.accounts[0]
      }
    });
  }

  formatExpense(expense) {
    return [
      `=DATE(${expense.date.substr(0, 4)}, ${expense.date.substr(
        5,
        2
      )}, ${expense.date.substr(-2)})`,
      expense.description,
      expense.account,
      expense.category,
      expense.amount,
    ];
  }

  append(expense) {
    return window.gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: "Expenses!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      values: [this.formatExpense(expense)]
    });
  }

  update(expense) {
    return window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: expense.id,
      valueInputOption: "USER_ENTERED",
      values: [this.formatExpense(expense)]
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Route
          path="/"
          exact
          render={(props) => <Dashboard {...props} state={this.state}/>}
        />
        <Route
          path="/settings"
          render={(props) => <Settings {...props} state={this.state}/>}
        />

        <Snackbar
          message={this.state.snackbarMessage}
        />
      </BrowserRouter>
    );
  }
}

export default App;
