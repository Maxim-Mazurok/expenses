import React, { Component } from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getProfile, Menu, MenuItem } from '../../selectors';
import GlobalState from '../../types/GlobalState';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { NavLink, NavLinkProps } from 'react-router-dom';

const mapStateToProps = (state: GlobalState) => ({
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {},
    dispatch,
  );

type HamburgerProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
  drawerOpen?: boolean
  closeDrawer: () => void
  openDrawer: () => void
  navigateTo: (url: string) => void
};

class Hamburger extends Component<RouteComponentProps<{}> & HamburgerProps> {
  render() {
    const CollisionLink = React.forwardRef((props: NavLinkProps, ref: React.Ref<HTMLAnchorElement>) => (
      <NavLink innerRef={ref} {...props} />
    ));

    const menu = Menu.map(({ text, url, IconComponent }: MenuItem, index: number) =>
      <ListItem
        key={index}
        button
        component={CollisionLink}
        activeClassName={'Mui-selected'}
        to={url}
        exact
        onClick={this.props.closeDrawer}
      >
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>,
    );

    return <SwipeableDrawer
      open={this.props.drawerOpen || false}
      onClose={this.props.closeDrawer}
      onOpen={this.props.openDrawer}
    >
      {this.props.profile &&
      <>
        <div style={{ padding: 16 }}>
          <Avatar
            style={{
              width: 60,
              height: 60,
            }}
          />
          <div style={{ paddingBottom: 16 }} />
          <Typography variant={'h6'} noWrap>
            {this.props.profile.getName()}
          </Typography>
          <Typography color={'textSecondary'} noWrap gutterBottom>
            {this.props.profile.getEmail()}
          </Typography>
        </div>
        <Divider />
      </>
      }

      <List>
        {menu}
      </List>
    </SwipeableDrawer>;
  }
}

export const HamburgerConnected = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hamburger));
