import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu } from '../../selectors';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';


export type TopBarProps = {
  openDrawer: () => void,
};

type TopBarState = {}

class TopBar extends Component<RouteComponentProps<{}> & TopBarProps, TopBarState> {
  get title(): string {
    const selectedMenuIndex = Menu.findIndex(menuItem => menuItem.url === this.props.location.pathname);
    return selectedMenuIndex === -1 ? '' : Menu[selectedMenuIndex].text;
  }

  render(): React.ReactElement<TopBarProps, React.JSXElementConstructor<TopBarState>> {
    return (
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={this.props.openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            {this.title}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export const TopBarConnected = withRouter(TopBar);
