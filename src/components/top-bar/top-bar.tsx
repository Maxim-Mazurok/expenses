import React, { Component } from "react";
import MaterialIcon from "@material/react-material-icon";

import TopAppBar, { TopAppBarIcon, TopAppBarRow, TopAppBarSection, TopAppBarTitle } from "@material/react-top-app-bar";
import '@material/react-top-app-bar/dist/top-app-bar.css';
import { RouteComponentProps, withRouter } from "react-router";

type TopBarProps = {
  title?: string,
  openDrawer: () => void,
  short?: boolean
}

type TopBarState = {}

class TopBar extends Component<RouteComponentProps<{}> & TopBarProps, TopBarState> {
  private openDrawer = () => {
    if (typeof this.props.openDrawer === 'function') {
      this.props.openDrawer();
    } else {
      console.warn('openDrawer is not a function');
    }
  };

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
            {this.props.title || ''}
          </TopAppBarTitle>
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>;
  }
}

export default withRouter(TopBar);
