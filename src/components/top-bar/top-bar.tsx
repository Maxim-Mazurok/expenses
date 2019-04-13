import React, { Component } from "react";
import MaterialIcon from "@material/react-material-icon";

import TopAppBar, {
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@material/react-top-app-bar";
import '@material/react-top-app-bar/dist/top-app-bar.css';

type Props = {
  title?: string,
  openDrawer: () => void
}

type State = {}

export default class TopBar extends Component<Props, State> {
  private openDrawer = () => {
    if (typeof this.props.openDrawer === 'function') {
      this.props.openDrawer();
    } else {
      console.warn('openDrawer is not a function');
    }
  };

  render(): React.ReactElement<Props, React.JSXElementConstructor<State>> {
    // noinspection HtmlDeprecatedAttribute
    return <TopAppBar
      short={true}
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
