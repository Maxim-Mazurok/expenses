import React, { Component } from 'react';

import GlobalState from '../../types/GlobalState';
import { getSheetId, getSpreadSheetId } from '../../selectors';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setTransaction } from '../../actions/setTransaction';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Transaction } from '../../types/Transaction';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { loadAllData } from '../../actions/loadAllData';
import { ButtonWithProgress } from '../ButtonWithProgress';

const mapStateToProps = (state: GlobalState) => ({
  spreadSheetId: getSpreadSheetId(state),
  sheetId: getSheetId(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setTransaction,
      loadAllData,
    },
    dispatch,
  );

type Props =
  & ReturnType<typeof mapStateToProps>
  & ReturnType<typeof mapDispatchToProps>
  & RouteComponentProps
  & WithSnackbarProps
  & {
  onClose: () => void
  transaction: Transaction
};

interface State {
  processing: boolean;
}

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
          this.props.loadAllData();
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
    const { processing } = this.state;

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
          <ButtonWithProgress
            buttonProps={{
              color: 'primary',
            }}
            disabled={this.state.processing}
            onClick={this.deleteTransaction}
            text="Delete"
            processing={processing}
          />
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(
  withSnackbar(
    connect(mapStateToProps, mapDispatchToProps)(
      DeleteDialog,
    ),
  ),
);
