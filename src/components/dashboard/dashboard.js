import React, { Component } from "react";

import './dashboard.scss';

import { LoadingBar, OperationForm, OperationsList } from "../index";

import { TopAppBarFixedAdjust } from "@material/react-top-app-bar";
import '@material/react-top-app-bar/dist/top-app-bar.css';

import MaterialIcon from "@material/react-material-icon";
import '@material/react-material-icon/dist/material-icon.css';

import Drawer, { DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle } from "@material/react-drawer";
import "@material/react-drawer/dist/drawer.css";

import List, { ListItem, ListItemGraphic, ListItemText } from "@material/react-list";
import '@material/react-list/dist/list.css';


import { Fab } from "@material/react-fab";
import '@material/react-fab/dist/fab.css';

import { withRouter } from "react-router-dom";
import TopBar from "../top-bar/top-bar";

class Dashboard extends Component {
  clientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    "826265862385-p41e559ccssujlfsf49ppmo0gktkf6co.apps.googleusercontent.com";
  spreadsheetId =
    process.env.REACT_APP_SHEET_ID ||
    "1eYrQf0xhs2mTSWEzQRfSM-MD-tCcx1r0NVEacLg3Jrc";

  menu = [
    {
      url: '/',
      icon: "dashboard",
      text: "Dashboard"
    },
    {
      url: '/charts',
      icon: "pie_chart",
      text: "Charts"
    },
    {
      url: '/settings',
      icon: "settings",
      text: "Settings"
    }
  ];

  constructor(props) {
    super(props);
    this.state = props.state;
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
    this.setState({ signedIn });
    if (this.state.signedIn) {
      this.setState({ profile: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile() });
      this.load();
    } else {
      this.setState({ profile: null });
    }
  };

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
            .map(Dashboard.parseExpense)
            .reverse()
            .slice(0, 30),
          processing: false,
          currentMonth: response.result.valueRanges[3].values[0][0],
          previousMonth: response.result.valueRanges[4].values[0][0]
        });
      });
  }

  static parseExpense(value, index) {
    return {
      id: `Expenses!A${index + 2}`,
      date: value[0],
      description: value[1],
      category: value[3],
      amount: value[4].replace(",", ""),
      account: value[2]
    };
  }

  openDrawer = () => {
    this.setState({ drawerOpen: true });
  };

  closeDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const menu = this.menu.map(menuItem =>
      <ListItem>
        <ListItemGraphic graphic={<MaterialIcon icon={menuItem.icon} />} />
        <ListItemText primaryText={menuItem.text} />
      </ListItem>
    );

    return (
      <div
        className="dashboard-root"
      >
        <TopBar
          title="Dashboard"
          openDrawer={this.openDrawer}
        />
        <Drawer
          modal
          open={this.state.drawerOpen}
          onClose={() => {
            this.closeDrawer()
          }}
        >
          <DrawerHeader>
            <DrawerTitle>
              {this.state.profile ? this.state.profile.getName() : ''}
            </DrawerTitle>
            <DrawerSubtitle>
              {this.state.profile ? this.state.profile.getEmail() : ''}
            </DrawerSubtitle>
          </DrawerHeader>

          <DrawerContent>
            <List
              singleSelection
              selectedIndex={this.state.selectedMenuIndex}
              handleSelect={(selectedMenuIndex) => {/*TODO*/
                this.setState({ selectedMenuIndex });
                this.props.history.push(this.menu[selectedMenuIndex].url);
                this.closeDrawer();
              }}
            >
              {menu}
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
