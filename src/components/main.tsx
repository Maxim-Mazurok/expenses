import React, { Component } from "react";

import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import TopBar from "./top-bar/top-bar";
import Hamburger, { Menu } from "./hamburger/hamburger";
import Dashboard from "./dashboard/dashboard";
import Settings from "./settings/settings";
import { Snackbar } from "@material/react-snackbar";

type MainProps = {
  selectedMenuIndex: number,
  openDrawer: () => void,
  closeDrawer: () => void,
  navigateTo: () => void,
  menu: Menu,
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
        <TopBar
          title={this.props.menu[this.props.selectedMenuIndex].text}
          openDrawer={this.openDrawer}
        />
        <Hamburger
          closeDrawer={this.closeDrawer}
          menu={this.props.menu}
          navigateTo={this.navigateTo}
          drawerOpen={this.state.drawerOpen}
          profile={this.state.profile}
        />
        <div
          className={`${this.props.menu[this.props.selectedMenuIndex].text.toLowerCase()}-root`}
        >
          <Route
            path="/"
            exact
            render={(props) =>
              <Dashboard
                {...props}
                state={this.state}
                menu={this.props.menu}
                signedInChanged={this.signedInChanged}
              />}
          />
          <Route
            path="/settings"
            render={(props) => <Settings {...props} state={this.state} menu={this.props.menu} />}
          />
        </div>
        <Snackbar
          message={this.state.snackbarMessage || ''}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(Main);
