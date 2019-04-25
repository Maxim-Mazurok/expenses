import React, { Component } from "react";

import { TopAppBarFixedAdjust } from "@material/react-top-app-bar";
import '@material/react-top-app-bar/dist/top-app-bar.css';

import { withRouter } from "react-router-dom";

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
  }

  render() {
    return (
      <React.Fragment>
        <TopAppBarFixedAdjust>
          <h1>Charts will be here</h1>
        </TopAppBarFixedAdjust>
      </React.Fragment>
    );
  }
}

export default withRouter(Charts);
