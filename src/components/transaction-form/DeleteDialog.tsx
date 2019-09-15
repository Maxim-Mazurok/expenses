import React, { Component } from 'react';

import GlobalState from '../../types/GlobalState';
import { getSheetId, getSpreadSheetId } from '../../selectors';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setTransaction } from '../../actions/setTransaction';
import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Transaction } from '../../types/Transaction';
import { withSnackbar, WithSnackbarProps } from 'notistack';

const mapStateToProps = (state: GlobalState) => ({
  spreadSheetId: getSpreadSheetId(state),
  sheetId: getSheetId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setTransaction,
    },
    dispatch,
  );

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  & WithSnackbarProps
  & {
  classes: {
    buttonWrapper: string
    buttonProgress: string
  }
} & {
  onClose: () => void
  transaction: Transaction
};

interface State {
  processing: boolean;
}

export const loadingIconSize = 24;

const styles = () =>
  createStyles({
    buttonWrapper: {
      position: 'relative',
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -loadingIconSize / 2,
      marginLeft: -loadingIconSize / 2,
    },
  });

class DeleteDialog extends Component<Props, State> {
  state: State = {
    processing: false,
  };

  deleteTransaction = async () => {
    const { id } = this.props.transaction;
    if (id === undefined) return false; // TODO: handle error, show some error message, maybe?
    this.setState({ processing: true });
    const match = id.match(/^.+![A-Z]+(\d+)/);
    if (match === null) return false; // TODO: handle error, show some error message, maybe?
    const transactionRow = parseInt(match[1]);
    gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: this.props.spreadSheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: this.props.sheetId,
                  dimension: 'ROWS',
                  startIndex: transactionRow - 1,
                  endIndex: transactionRow,
                },
              },
            },
          ],
        },
      })
      .then(
        () => {
          this.setState({ processing: false });
          this.props.history.push('/');
          this.props.enqueueSnackbar('Successfully deleted', {
            variant: 'success',
          });
          // TODO: reload data
        }, (response: gapi.client.Response<gapi.client.sheets.BatchUpdateSpreadsheetResponse>) => {
          this.setState({ processing: false });
          this.props.enqueueSnackbar('Error while deleting transaction', {
            variant: 'error',
          });
          console.error('Something went wrong'); // TODO handle error
          console.error(response);
        });
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={true}
        onClose={this.props.onClose}
        aria-labelledby="delete-transaction"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-transaction"
        >
          Do you really want to delete the transaction?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            You can restore deleted transaction using
            {' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.google.com/docs/answer/190843?co=GENIE.Platform%3DDesktop&hl=en"
            >
              Version history
            </a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={this.state.processing}
            onClick={this.props.onClose}
            autoFocus
            color="primary"
          >
            Cancel
          </Button>
          <div
            className={classes.buttonWrapper}
          >
            <Button
              disabled={this.state.processing}
              onClick={this.deleteTransaction}
              color="primary"
            >
              Delete
              {this.state.processing && <CircularProgress
                size={loadingIconSize}
                className={classes.buttonProgress}
                disableShrink
              />}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(
  withSnackbar(
    connect(mapStateToProps, mapDispatchToProps)(
      withStyles(styles)(DeleteDialog),
    ),
  ),
);
