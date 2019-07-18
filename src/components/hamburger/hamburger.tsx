import React, { Component } from "react";
import MaterialIcon from "@material/react-material-icon";

import Drawer, { DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle } from "@material/react-drawer";
import "@material/react-drawer/dist/drawer.css";

import List, { ListItem, ListItemGraphic, ListItemText } from "@material/react-list";
import '@material/react-list/dist/list.css';
import GlobalState from "../../types/GlobalState";
import { selectMenu } from "../../actions";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";
import { getSelectedMenuIndex, Menu, MenuItem } from "../../selectors";

const mapStateToProps = (state: GlobalState) => ({
  selectedMenuIndex: getSelectedMenuIndex(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      selectMenu,
    },
    dispatch
  );

type HamburgerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
  drawerOpen?: boolean
  closeDrawer: () => void
  navigateTo: (url: string) => void
  profile?: gapi.auth2.BasicProfile | null
};

type HamburgerState = ReturnType<typeof mapStateToProps>

class Hamburger extends Component<RouteComponentProps<{}> & HamburgerProps, HamburgerState> {
  render(): React.ReactElement<HamburgerProps, React.JSXElementConstructor<HamburgerState>> {
    const menu = Menu.map((menuItem: MenuItem) =>
      <ListItem
        key={menuItem.text}
      >
        <ListItemGraphic graphic={<MaterialIcon icon={menuItem.icon} />} />
        <ListItemText primaryText={menuItem.text} />
      </ListItem>
    );

    return <Drawer
      modal
      open={this.props.drawerOpen || false}
      onClose={this.closeDrawer}
    >
      <DrawerHeader>
        <DrawerTitle>
          {this.props.profile ? this.props.profile.getName() : ''}
        </DrawerTitle>
        <DrawerSubtitle>
          {this.props.profile ? this.props.profile.getEmail() : ''}
        </DrawerSubtitle>
      </DrawerHeader>

      <DrawerContent>
        <List
          singleSelection
          selectedIndex={this.props.selectedMenuIndex || 0}
          handleSelect={(menuIndex) => {
            this.props.selectMenu(menuIndex);
            this.navigateTo(Menu[menuIndex].url);
            this.closeDrawer();
          }}
        >
          {menu}
        </List>
      </DrawerContent>
    </Drawer>;
  }

  private closeDrawer = () => {
    if (typeof this.props.closeDrawer === 'function') {
      this.props.closeDrawer();
    } else {
      console.warn('closeDrawer is not a function');
    }
  };

  private navigateTo = (url: string = '/') => {
    if (typeof this.props.navigateTo === 'function') {
      this.props.navigateTo(url);
    } else {
      console.warn('navigateTo is not a function');
    }
  };
}

export const HamburgerConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Hamburger));
