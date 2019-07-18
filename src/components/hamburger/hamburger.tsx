import React, { Component } from "react";
import MaterialIcon from "@material/react-material-icon";

import Drawer, { DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle } from "@material/react-drawer";
import "@material/react-drawer/dist/drawer.css";

import List, { ListItem, ListItemGraphic, ListItemText } from "@material/react-list";
import '@material/react-list/dist/list.css';
import GlobalState, { SelectedMenuIndex } from "../../types/GlobalState";
import { selectMenu } from "../../actions";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";

const mapStateToProps = (state: GlobalState) => ({
  selectedMenuIndex: state.selectedMenuIndex,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      onSelect: (index: SelectedMenuIndex) => dispatch(selectMenu(index)),
    },
    dispatch
  );

type HamburgerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
  drawerOpen?: boolean
  closeDrawer: () => void
  navigateTo: (url: string) => void
  profile?: gapi.auth2.BasicProfile | null
  menu: Menu
};

type HamburgerState = ReturnType<typeof mapStateToProps>

export type MenuItem = {
  url: string,
  icon: string,
  text: string
}

export type Menu = MenuItem[]

class Hamburger extends Component<RouteComponentProps<{}> & HamburgerProps, HamburgerState> {
  render(): React.ReactElement<HamburgerProps, React.JSXElementConstructor<HamburgerState>> {
    const menu = this.props.menu.map((menuItem: MenuItem) =>
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
            this.props.onSelect(menuIndex);
            this.navigateTo(this.props.menu[menuIndex].url);
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
