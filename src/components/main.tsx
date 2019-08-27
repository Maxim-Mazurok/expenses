import React, { Component } from 'react';

import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { HamburgerConnected } from './hamburger/hamburger';
import Dashboard from './dashboard/dashboard';
import Settings from './settings/Settings';
import { Snackbar } from '@material/react-snackbar';
import Charts from './charts/Charts';
import { TopBarConnected } from './top-bar/top-bar';
import { connect } from 'react-redux';
import { TransactionForm } from './index';

const mapStateToProps = () => ({});

type MainProps = ReturnType<typeof mapStateToProps> & {}

export interface MainState {
  snackbarMessage: string,
  drawerOpen: boolean
}

class Main extends Component<RouteComponentProps<{}> & MainProps, MainState> {
  state: MainState = {
    snackbarMessage: '',
    drawerOpen: false,
  };

  openDrawer = () => {
    this.setState({ drawerOpen: true });
  };

  closeDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  navigateTo = (url: string) => {
    this.props.history.push(url);
  };

  render(): React.ReactElement<RouteComponentProps<{}> & MainProps, React.JSXElementConstructor<MainState>> {
    return (
      <React.Fragment>
        <TopBarConnected
          openDrawer={this.openDrawer}
        />
        <HamburgerConnected
          closeDrawer={this.closeDrawer}
          navigateTo={this.navigateTo}
          drawerOpen={this.state.drawerOpen}
        />
        <>
          <Route
            path="/"
            exact
            component={Dashboard}
          />
          <Route
            path="/charts"
            component={Charts}
          />
          <Route
            path="/settings"
            component={Settings}
          />
          <Route
            path="/transaction/:id?"
            component={TransactionForm}
          />
        </>
        <Snackbar
          message={this.state.snackbarMessage || ''}
        />
      </React.Fragment>
    );
  }
}

export const MainConnected = withRouter(connect(
  mapStateToProps,
)(Main));
