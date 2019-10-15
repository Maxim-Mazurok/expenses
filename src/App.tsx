import React, { Component } from 'react';

import { MainConnected } from './components/main';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import GlobalState from './types/GlobalState';
import { getClientId, getSpreadSheetId } from './selectors';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setProfile } from './actions/setProfile';
import { setGapiReady } from './actions/setGapiReady';
import { CssBaseline } from '@material-ui/core';
import { setSheetId } from './actions/setSheetId';
import { loadAllData } from './actions/loadAllData';

const mapStateToProps = (state: GlobalState) => ({
  clientId: getClientId(state),
  spreadSheetId: getSpreadSheetId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setProfile,
      setGapiReady,
      setSheetId,
      loadAllData,
    },
    dispatch,
  );

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {}

interface State {
  accounts: string[],
  categories: string[],
  processing: boolean,
  isGapiReady: boolean,
}

class App extends Component<Props, State> {
  state: State = {
    accounts: [],
    categories: [],
    processing: true,
    isGapiReady: false,
  };

  loadGAPI = (): Promise<void> => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    window.document.body.appendChild(script);
    return new Promise<void>((resolve, reject) => {
      script.addEventListener('error', error => reject(error));
      script.addEventListener('load', () => resolve());
    });
  };

  loadClient = (): Promise<void> => {
    return new Promise<void>(((resolve, reject) => {
      gapi.load('client:auth2', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Error loading client')),
        // timeout: 5000,
        // ontimeout: () => reject(new Error('Client loading timed out')),
      });
    }));
  };

  signIn = (): void => {
    gapi.auth2
      .getAuthInstance()
      .isSignedIn.listen(this.signedInChanged);
    this.signedInChanged(
      gapi.auth2.getAuthInstance().isSignedIn.get(),
    );
  };

  signedInChanged = (signedIn: boolean) => {
    const profile = signedIn ? gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile() : undefined;
    this.props.setProfile(profile);
  };

  initClient = (): Promise<void> => {
    return gapi.client
      .init({
        discoveryDocs: [
          'https://sheets.googleapis.com/$discovery/rest?version=v4',
        ],
        clientId: this.props.clientId,
        scope:
          'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly',
      });
  };

  loadSheetId = async () => {
    if (process.env.REACT_APP_SHEET_NAME === undefined) return -1; // TODO: handle error

    const { spreadSheetId } = this.props;

    const response: gapi.client.Response<gapi.client.sheets.Spreadsheet> = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: spreadSheetId,
      includeGridData: false,
    });

    if (response.result.sheets === undefined) return; // TODO: handle error

    const transactionsSheet = response.result.sheets.find(sheet => sheet.properties && sheet.properties.title === process.env.REACT_APP_SHEET_NAME);

    if (transactionsSheet === undefined || transactionsSheet.properties === undefined) {
      // TODO: handle error
      return;
    }

    this.props.setSheetId(transactionsSheet.properties.sheetId);
  };

  async componentDidMount() {
    try {
      await this.loadGAPI();
      await this.loadClient();
      await this.initClient();
      try {
        await this.loadSheetId();
      } catch (e) {
        // TODO: fix sign in flow
      }
      this.props.setGapiReady(true);
      this.props.loadAllData();
      this.signIn();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <CssBaseline />
        <MainConnected />
      </BrowserRouter>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
