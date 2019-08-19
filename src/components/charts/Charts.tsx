import React from 'react';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { withRouter } from 'react-router-dom';

function Charts() {
  return (
    <React.Fragment>
      <TopAppBarFixedAdjust>
        <h1>Charts will be here</h1>
      </TopAppBarFixedAdjust>
    </React.Fragment>
  );
}

export default withRouter(Charts);
