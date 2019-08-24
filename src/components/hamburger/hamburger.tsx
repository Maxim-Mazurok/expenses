import React, { Component } from 'react';
import MaterialIcon from '@material/react-material-icon';

import Drawer, {
  DrawerContent,
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
} from '@material/react-drawer';
import '@material/react-drawer/dist/drawer.css';

import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
} from '@material/react-list';
import '@material/react-list/dist/list.css';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  getProfile,
  getSelectedMenuIndex,
  Menu,
  MenuItem,
} from '../../selectors';
import GlobalState from '../../types/GlobalState';
import { selectMenu } from '../../actions/selectMenu';

const mapStateToProps = (state: GlobalState) => ({
  selectedMenuIndex: getSelectedMenuIndex(state),
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      selectMenu,
    },
    dispatch,
  );

type HamburgerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
  drawerOpen?: boolean
  closeDrawer: () => void
  navigateTo: (url: string) => void
};

class Hamburger extends Component<RouteComponentProps<{}> & HamburgerProps> {
  render() {
    const menu = Menu.map((menuItem: MenuItem) =>
      <ListItem
        key={menuItem.text}
      >
        <ListItemGraphic graphic={<MaterialIcon icon={menuItem.icon} />} />
        <ListItemText primaryText={menuItem.text} />
      </ListItem>,
    );

    return <Drawer
      modal
      open={this.props.drawerOpen || false}
      onClose={this.props.closeDrawer}
    >
      {this.props.profile &&
      <DrawerHeader>
        <DrawerTitle>
          {this.props.profile.getName()}
        </DrawerTitle>
        <DrawerSubtitle>
          {this.props.profile.getEmail()}
        </DrawerSubtitle>
      </DrawerHeader>
      }

      <DrawerContent>
        <List
          singleSelection
          selectedIndex={this.props.selectedMenuIndex || 0}
          handleSelect={(menuIndex) => {
            this.props.selectMenu(menuIndex);
            this.props.navigateTo(Menu[menuIndex].url);
            this.props.closeDrawer();
          }}
        >
          {menu}
        </List>
      </DrawerContent>
    </Drawer>;
  }
}

export const HamburgerConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hamburger));
