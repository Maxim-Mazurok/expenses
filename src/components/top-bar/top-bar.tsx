import React, { Component } from 'react';
import MaterialIcon from '@material/react-material-icon';

import TopAppBar, {
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import { RouteComponentProps, withRouter } from 'react-router';
import GlobalState, { SelectedMenuIndex } from '../../types/GlobalState';
import { connect } from 'react-redux';
import { getSelectedMenuIndex, Menu } from '../../selectors';


const mapStateToProps = (state: GlobalState) => ({
  selectedMenuIndex: getSelectedMenuIndex(state),
});

export type TopBarProps = ReturnType<typeof mapStateToProps> & {
  openDrawer: () => void,
  short?: boolean
};

type TopBarState = {
  selectedMenuIndex: SelectedMenuIndex,
}

class TopBar extends Component<RouteComponentProps<{}> & TopBarProps, TopBarState> {
  get title(): string {
    const selectedMenuIndex = Menu.findIndex(menuItem => menuItem.url === this.props.location.pathname);
    return selectedMenuIndex === -1 ? '' : Menu[selectedMenuIndex].text;
  }

  render(): React.ReactElement<TopBarProps, React.JSXElementConstructor<TopBarState>> {
    // noinspection HtmlDeprecatedAttribute
    return <TopAppBar
      short={this.props.short || true}
    >
      <TopAppBarRow>
        <TopAppBarSection
          align="start"
        >
          <TopAppBarIcon
            navIcon
            tabIndex={0}
          >
            <MaterialIcon
              hasRipple
              icon="menu"
              onClick={this.openDrawer.bind(this)} />
          </TopAppBarIcon>
          <TopAppBarTitle>
            {this.title}
          </TopAppBarTitle>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>;
  }

  private openDrawer = () => {
    if (typeof this.props.openDrawer === 'function') {
      this.props.openDrawer();
    } else {
      console.warn('openDrawer is not a function');
    }
  };
}

export const TopBarConnected = withRouter(connect(
  mapStateToProps,
)(TopBar));
