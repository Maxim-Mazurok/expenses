import React, { Component } from "react";

import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { HamburgerConnected } from "./hamburger/hamburger";
import Dashboard from "./dashboard/dashboard";
import Settings from "./settings/settings";
import { Snackbar } from "@material/react-snackbar";
import Charts from "./charts/charts";
import { TopBarConnected } from "./top-bar/top-bar";
import { connect } from "react-redux";
import GlobalState from "../types/GlobalState";
import { getSelectedMenuTitle } from "../selectors";

const mapStateToProps = (state: GlobalState) => ({
  selectedMenuTitle: getSelectedMenuTitle(state),
});

type MainProps = ReturnType<typeof mapStateToProps> & {
  openDrawer: () => void
  closeDrawer: () => void
  navigateTo: () => void
}

type MainState = {
  snackbarMessage: string,
  drawerOpen: boolean
  profile: gapi.auth2.BasicProfile | null
}

class Main extends Component<RouteComponentProps<{}> & MainProps, MainState> {
  state: MainState = {
    snackbarMessage: '',
    drawerOpen: false,
    profile: null,
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

  signedInChanged = (profile: gapi.auth2.BasicProfile | null) => {
    this.setState({ profile });
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
          profile={this.state.profile}
        />
        <div
          className={`${this.props.selectedMenuTitle.toLowerCase()}-root`}
        >
          <Route
            path="/"
            exact
            render={(props) =>
              <Dashboard
                {...props}
                state={this.state}
                signedInChanged={this.signedInChanged}
              />}
          />
          <Route
            path="/charts"
            render={(props) => <Charts {...props} state={this.state} />}
          />
          <Route
            path="/settings"
            render={(props) => <Settings {...props} state={this.state} />}
          />
        </div>
        <Snackbar
          message={this.state.snackbarMessage || ''}
        />
      </React.Fragment>
    );
  }
}

export const MainConnected = withRouter(connect(
  mapStateToProps
)(Main));
