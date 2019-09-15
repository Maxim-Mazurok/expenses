import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import GlobalState from '../../types/GlobalState';
import { getProfile, isGapiReady } from '../../selectors';
import { Button, LinearProgress } from '@material-ui/core';

const mapStateToProps = (state: GlobalState) => ({
  isGapiReady: isGapiReady(state),
  profile: getProfile(state),
});

type Props = ReturnType<typeof mapStateToProps>

class Settings extends Component<RouteComponentProps<{}> & Props> {
  render() {
    return (
      !this.props.isGapiReady ?
        <LinearProgress variant="indeterminate" />
        : this.props.profile &&
        <Button
          onClick={() => {
            gapi.auth2.getAuthInstance().signOut();
          }}
        >
          Sign out
        </Button>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Settings));
