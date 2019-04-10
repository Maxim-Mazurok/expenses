import React, { Component } from "react";
import { LoadingBar, OperationForm, OperationsList } from "./components";

import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';
import "@material/react-drawer/dist/drawer.css";

import MaterialIcon from "@material/react-material-icon";
import List, { ListItem, ListItemText, ListItemGraphic } from '@material/react-list';
import "./App.css";
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

class App extends Component {

  constructor(props) {
    super(props);

    this.clientId =
      process.env.REACT_APP_GOOGLE_CLIENT_ID ||
      "826265862385-p41e559ccssujlfsf49ppmo0gktkf6co.apps.googleusercontent.com";
    this.spreadsheetId =
      process.env.REACT_APP_SHEET_ID ||
      "1eYrQf0xhs2mTSWEzQRfSM-MD-tCcx1r0NVEacLg3Jrc";

    this.state = {
      signedIn: undefined,
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
    };

  }

  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4"
          ],
          clientId: this.clientId,
          scope:
            "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly"
        })
        .then(() => {
          window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(this.signedInChanged);
          this.signedInChanged(
            window.gapi.auth2.getAuthInstance().isSignedIn.get()
          );
        });
    });
  }

  signedInChanged = (signedIn) => {
    this.setState({ signedIn: signedIn });
    if (this.state.signedIn) {
      this.load();
    }
  };

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

  parseExpense(value, index) {
    return {
      id: `Expenses!A${index + 2}`,
      date: value[0],
      description: value[1],
      category: value[3],
      amount: value[4].replace(",", ""),
      account: value[2]
    };
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

  load() {
    window.gapi.client.sheets.spreadsheets.values
      .batchGet({
        spreadsheetId: this.spreadsheetId,
        ranges: [
          "Data!A2:A50",
          "Data!E2:E50",
          "Expenses!A2:F",
          "Current!H1",
          "Previous!H1"
        ]
      })
      .then(response => {
        const accounts = response.result.valueRanges[0].values.map(
          items => items[0]
        );
        const categories = response.result.valueRanges[1].values.map(
          items => items[0]
        );
        this.setState({
          accounts: accounts,
          categories: categories,
          expenses: (response.result.valueRanges[2].values || [])
            .map(this.parseExpense)
            .reverse()
            .slice(0, 30),
          processing: false,
          currentMonth: response.result.valueRanges[3].values[0][0],
          previousMonth: response.result.valueRanges[4].values[0][0]
        });
      });
  }

  openDrawer() {
    this.setState({ drawerOpen: true })
  }

  closeDrawer() {
    this.setState({ drawerOpen: false })
  }

  render() {
    return (
      <div>
        <TopAppBar
          short={true}
        >
          <TopAppBarRow>
            <TopAppBarSection align="start">
              <TopAppBarIcon navIcon tabIndex={0}>
                <MaterialIcon hasRipple icon="menu" onClick={() => {
                  this.openDrawer()
                }} />
              </TopAppBarIcon>
              <TopAppBarTitle>Transactions</TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <Drawer
          modal
          open={this.state.drawerOpen}
          onClose={() => {
            this.closeDrawer()
          }}
        >
          <DrawerHeader> {/*defaults to div*/}
            <DrawerTitle tag="h2"> {/*defaults to h3*/}
              Inbox
            </DrawerTitle>
            <DrawerSubtitle> {/*defaults to h6*/}
              matt@email.com
            </DrawerSubtitle>
          </DrawerHeader>

          <DrawerContent>
            <List
              singleSelection
              selectedIndex={this.state.selectedMenu}
            >
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon="dashboard" />} />
                <ListItemText primaryText="Dashboard" />
              </ListItem>
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon="pie_chart" />} />
                <ListItemText primaryText="Charts" />
              </ListItem>
              <ListItem>
                <ListItemGraphic graphic={<MaterialIcon icon="settings" />} />
                <ListItemText primaryText="Settings" />
              </ListItem>
            </List>
          </DrawerContent>
        </Drawer>
        <TopAppBarFixedAdjust>
          {this.state.signedIn === undefined && <LoadingBar />}
          {this.state.signedIn === false &&
          <div className="center">
            <button
              className="mdc-button mdc-button--raised"
              aria-label="Sign in"
              onClick={() => {
                window.gapi.auth2.getAuthInstance().signIn();
              }}
            >
              <span className="mdc-button__label">Sign in</span>
            </button>
          </div>}
          {this.state.signedIn && this.renderBody()}

        </TopAppBarFixedAdjust>

        <Snackbar
          message={this.state.snackbarMessage}
        />
      </div>
    );
  }

  renderBody() {
    if (this.state.processing) return <LoadingBar />;
    else
      return (
        <div className="content">
          {this.renderExpenses()}
        </div>
      );
  }

  renderExpenses() {
    if (this.state.showExpenseForm)
      return (
        <OperationForm
          categories={this.state.categories}
          accounts={this.state.accounts}
          expense={this.state.expense}
          onSubmit={this.handleExpenseSubmit}
          onCancel={this.handleExpenseCancel}
          onDelete={this.handleExpenseDelete}
          onChange={this.handleExpenseChange}
        />
      );
    else
      return (
        <div>
          <div className="mdc-card">
            <section className="mdc-card__primary">
              <h2 className="mdc-card__subtitle">This month you've spent:</h2>
              <h1 className="mdc-card__title mdc-card__title--large center">
                {this.state.currentMonth}
              </h1>
            </section>
            <section className="mdc-card__supporting-text">
              Previous month: {this.state.previousMonth}
            </section>
          </div>
          <OperationsList
            expenses={this.state.expenses}
            onSelect={this.handleExpenseSelect}
          />
          <button
            onClick={() => this.onExpenseNew()}
            className="mdc-fab app-fab--absolute material-icons"
            aria-label="Add expense"
          >
            <span className="mdc-fab__icon">add</span>
          </button>
        </div>
      );
  }
}

export default App;
