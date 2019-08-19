import React from 'react';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { withRouter } from 'react-router-dom';

function Settings() {
  return (
    <React.Fragment>
      <TopAppBarFixedAdjust>
        <h1>Settings will be here</h1>
      </TopAppBarFixedAdjust>
    </React.Fragment>
  );
}

export default withRouter(Settings);
