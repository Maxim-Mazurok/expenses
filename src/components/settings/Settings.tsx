import React, { Component } from 'react';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Button from '@material/react-button';
import { connect } from 'react-redux';
import GlobalState from '../../types/GlobalState';
import { getProfile, isGapiReady } from '../../selectors';
import LinearProgress from '@material/react-linear-progress';

const mapStateToProps = (state: GlobalState) => ({
  isGapiReady: isGapiReady(state),
  profile: getProfile(state),
});

type Props = ReturnType<typeof mapStateToProps>

class Settings extends Component<RouteComponentProps<{}> & Props> {
  render() {
    return (
      <React.Fragment>
        <TopAppBarFixedAdjust>
          {!this.props.isGapiReady ?
            <LinearProgress indeterminate={true} />
            : this.props.profile &&
            <Button
              onClick={() => {
                gapi.auth2.getAuthInstance().signOut();
              }}
            >
              Sign out
            </Button>
          }
        </TopAppBarFixedAdjust>
      </React.Fragment>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Settings));
