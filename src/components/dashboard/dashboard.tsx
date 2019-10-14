/// <reference path="./../../../node_modules/@types/gapi.client/index.d.ts" />
import React, { Component } from 'react';

import { TransactionsList } from '../index';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import GlobalState, { TransactionType } from '../../types/GlobalState';
import { getProfile, getSpreadSheetId, isGapiReady } from '../../selectors';
import { Transaction } from '../../types/Transaction';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setNewTransactionType } from '../../actions/setNewTransactionType';
import {
  Button,
  createStyles,
  Fab,
  LinearProgress,
  StyledComponentProps,
  Theme,
  withStyles,
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';
import { setTransaction } from '../../actions/setTransaction';

const mapStateToProps = (state: GlobalState) => ({
  spreadSheetId: getSpreadSheetId(state),
  isGapiReady: isGapiReady(state),
  profile: getProfile(state),
  loadAllDataError: state.loadAllData.error,
  loadAllDataLoading: state.loadAllData.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setTransaction,
      setNewTransactionType,
    },
    dispatch,
  );

interface State {
  expenses: Transaction[];
  currentMonth?: string;
  previousMonth?: string;
}

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & StyledComponentProps
  & {
  classes: {
    fab: string
    fabContainer: string
  }
}

const styles = (theme: Theme) => {
  const fabMargin = theme.spacing(2);
  return createStyles({
    fab: {
      marginRight: fabMargin,
      marginBottom: fabMargin,
      color: theme.palette.common.white,
    },
    fabContainer: {
      position: 'fixed',
      bottom: 0,
      right: 0,
    },
  });
};

class Dashboard extends Component<RouteComponentProps<{}> & Props, State> {
  state: State = {
    expenses: [],
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        {(!this.props.isGapiReady || this.props.loadAllDataLoading) &&
        <LinearProgress variant="indeterminate" />
        }
        {this.props.isGapiReady && this.props.profile === undefined &&
        <div className="center">
          <Button
            onClick={() => {
              gapi.auth2.getAuthInstance().signIn();
            }}
          >
            Sign in
          </Button>
        </div>}
        {this.props.profile &&
        <>
          <TransactionsList />
          <div className={classes.fabContainer}>
            <Fab
              onClick={() => this.onNewTransaction(TransactionType.INCOME)}
              className={classes.fab}
              aria-label="Add income"
              style={{ background: green[600] }}
            >
              <Add />
            </Fab>
            <Fab
              onClick={() => this.onNewTransaction(TransactionType.EXPENSE)}
              className={classes.fab}
              aria-label="Add expense"
              style={{ background: red[600] }}
            >
              <Remove />
            </Fab>
          </div>
        </>}
      </>
    );
  }

  onNewTransaction = (type: TransactionType) => {
    this.props.history.push('/transaction');
    this.props.setTransaction({ type });
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard)));
