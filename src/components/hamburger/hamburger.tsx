/* global gapi */

import React, { Component } from "react";
import MaterialIcon from "@material/react-material-icon";

import Drawer, { DrawerContent, DrawerHeader, DrawerSubtitle, DrawerTitle } from "@material/react-drawer";
import "@material/react-drawer/dist/drawer.css";

import List, { ListItem, ListItemGraphic, ListItemText } from "@material/react-list";
import '@material/react-list/dist/list.css';

type Props = {
  drawerOpen?: boolean
  closeDrawer: () => void
  navigateTo: (url: string) => void
  profile?: gapi.auth2.BasicProfile
  selectedMenuIndex?: number
  menu: Menu
}

type State = {}

type MenuItem = {
  url: string,
  icon: string,
  text: string
}

type Menu = MenuItem[]

export default class Hamburger extends Component<Props, State> {
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

  render(): React.ReactElement<Props, React.JSXElementConstructor<State>> {
    const menu = this.props.menu.map((menuItem: MenuItem) =>
      <ListItem>
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
          handleSelect={(selectedMenuIndex) => {
            this.setState({ selectedMenuIndex });
            this.navigateTo(this.props.menu[selectedMenuIndex].url);
            this.closeDrawer();
          }}
        >
          {menu}
        </List>
      </DrawerContent>
    </Drawer>;
  }
}
