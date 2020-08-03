import React, { Component, FormEvent } from 'react';

import GlobalState, { TransactionType } from '../../types/GlobalState';
import {
  getAccounts,
  getCategories,
  getSheetId,
  getSpreadSheetId,
  getTransaction,
  getTransactions,
} from '../../selectors';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setTransaction } from '../../actions/setTransaction';
import {
  AppBar,
  Button,
  Checkbox,
  createStyles,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  Toolbar,
  Typography,
  withStyles,
  Container,
} from '@material-ui/core';
import { Close, Delete } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { TransactionTypeName } from '../../texts';
import { connect } from 'react-redux';
import Autocomplete from '../Automcomplete';
import {
  DatePicker,
  LocalizationProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import DeleteDialog from './DeleteDialog';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { cellRowNumber, formatTransaction } from '../../helpers';
import { Transaction } from '../../types/Transaction';
import { loadAllData } from '../../actions/loadAllData';
import { ButtonWithProgress } from '../ButtonWithProgress';

const mapStateToProps = (state: GlobalState) => ({
  categories: getCategories(state),
  accounts: getAccounts(state),
  transaction: getTransaction(state),
  transactions: getTransactions(state),
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
  & RouteComponentProps<{ id: string }>
  & WithSnackbarProps
  & {
    classes: {
      title: string
      form: string
    }
  }

interface State {
  showDeleteDialog: boolean;
  processing: boolean;
}

const styles = (theme: Theme) => {
  return createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    form: {
      margin: theme.spacing(2),
    },
  });
};

const transactionFromURL = (props: Props): void => {
  const id = props.match.params.id;
  if (id !== undefined) {
    const transaction = props.transactions.find(t => t.id === id);
    if (transaction !== undefined) {
      if (transaction.amountReceived === undefined && transaction.rate !== undefined) {
        transaction.amountReceived = transaction.rate * transaction.amount;
      }
      props.setTransaction(transaction);
    }
  } else {
    props.setTransaction({
      ...props.transaction,
      date: new Date(),
    });
  }

};

enum SubmitAction {
  APPEND,
  UPDATE,
}

class TransactionForm extends Component<Props, State> {
  state: State = {
    showDeleteDialog: false,
    processing: false,
  };

  formIsValid(): boolean {
    const { transaction, categories, accounts } = this.props;
    const { amount, category, fromAccount } = transaction;

    const validAmount = amount !== undefined && amount > 0;
    const validCategory = category !== undefined && categories.indexOf(category) !== -1;
    const validDate = true; // TODO validate date
    const validFromAccount = fromAccount !== undefined && accounts.indexOf(fromAccount) !== -1;

    return validAmount
      && validCategory
      && validDate
      && validFromAccount
      ;
  }

  componentDidMount() {
    transactionFromURL(this.props);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.transactions.length !== this.props.transactions.length) {
      transactionFromURL(this.props);
    }
  }

  handleDateChange = (date: Date | null): void => {
    if (date) {
      this.props.setTransaction({
        ...this.props.transaction,
        date,
      });
    }
  };

  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' && target.hasOwnProperty('checked') ? target.checked : target.value;

    this.props.setTransaction({
      ...this.props.transaction,
      [target.name]: value,
    });
  };

  submitAction = async (action: SubmitAction): Promise<gapi.client.Response<gapi.client.sheets.BatchUpdateSpreadsheetResponse>> => {
    const { transaction, spreadSheetId, sheetId } = this.props;
    switch (action) {
      case SubmitAction.APPEND:
        return gapi.client.sheets.spreadsheets
          .batchUpdate({
            spreadsheetId: spreadSheetId,
            resource: {
              requests: [
                {
                  appendCells: {
                    sheetId,
                    fields: '*',
                    rows: [{
                      values: formatTransaction(transaction as Transaction),
                    }],
                  },
                },
              ],
            },
          });
      case SubmitAction.UPDATE:
        if (typeof transaction.id !== 'undefined') {
          return gapi.client.sheets.spreadsheets
            .batchUpdate({
              spreadsheetId: spreadSheetId,
              resource: {
                requests: [
                  {
                    updateCells: {
                      fields: '*',
                      start: {
                        rowIndex: cellRowNumber(transaction.id),
                        sheetId,
                      },
                      rows: [{
                        values: formatTransaction(transaction as Transaction),
                      }],
                    },
                  },
                ],
              },
            });
        }
    }
    throw new Error('Can\'t perform an action'); // TODO: error handling
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    this.setState({ processing: true });
    const submitAction: SubmitAction = this.props.transaction.id
      ? SubmitAction.UPDATE
      : SubmitAction.APPEND;

    this.submitAction(submitAction).then(
      () => {
        this.setState({ processing: false });
        this.props.history.push('/');
        this.props.enqueueSnackbar(`Successfully ${submitAction === SubmitAction.APPEND ? 'added' : 'updated'}`, {
          variant: 'success',
        });
        this.props.loadAllData();
      },
      (response: Error) => {
        console.error('Something went wrong');
        console.error(response);
        this.setState({ processing: false });
        this.props.enqueueSnackbar(`Failed to ${submitAction === SubmitAction.APPEND ? 'add' : 'update'}`, {
          variant: 'error',
        });
      },
    );
  };

  render() {
    const { classes, transaction, history, categories } = this.props;
    const { processing } = this.state;

    return (
      <Dialog fullScreen open={true}
        onClose={() => history.push('/')}>
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit"
              onClick={() => history.push('/')}
              aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {transaction.hasOwnProperty('id') ? 'Edit' : 'New'}{' transaction'}
            </Typography>
            <ButtonWithProgress
              buttonProps={{
                color: 'inherit',
              }}
              disabled={this.state.processing || !this.formIsValid()}
              onClick={this.handleSubmit}
              text={transaction.hasOwnProperty('id') ? 'Update' : 'Add'}
              processing={processing}
            />
            {transaction.hasOwnProperty('id') &&
              <Button
                color="inherit"
                onClick={() => this.setState({ showDeleteDialog: true })}
              >
                <Delete />
              delete
            </Button>
            }
          </Toolbar>
        </AppBar>
        <Container maxWidth="xs">
          <form
            className={classes.form}
            onSubmit={this.handleSubmit}
          >
            {
              this.state.showDeleteDialog &&
              transaction.hasOwnProperty('id') &&
              transaction.id !== undefined &&
              <DeleteDialog
                onClose={() => this.setState({ showDeleteDialog: false })}
                transaction={transaction}
              />
            }

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <FormLabel
                required
              >
                Transaction type
            </FormLabel>
              <RadioGroup
                name="type"
                value={transaction.type}
                onChange={this.handleInputChange}
                row
              >
                <FormControlLabel
                  value={TransactionType.EXPENSE}
                  control={<Radio />}
                  label={TransactionTypeName(TransactionType.EXPENSE)}
                />
                <FormControlLabel
                  value={TransactionType.INCOME}
                  control={<Radio />}
                  label={TransactionTypeName(TransactionType.INCOME)}
                />
                <FormControlLabel
                  value={TransactionType.TRANSFER}
                  control={<Radio />}
                  label={TransactionTypeName(TransactionType.TRANSFER)}
                />
              </RadioGroup>
            </FormControl>

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <InputLabel
                htmlFor="amount"
                required
              >
                {transaction.type === TransactionType.TRANSFER ? 'Amount Sent' : 'Amount'}
              </InputLabel>
              <Input
                id="amount"
                autoFocus={!transaction.hasOwnProperty('id')}
                name="amount"
                value={transaction.amount || ''}
                onChange={this.handleInputChange}
                type="number"
                inputProps={{
                  step: 0.01,
                  min: 0,
                }}
                required
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (['-', '+', 'e'].indexOf(event.key) !== -1) {
                    // also fixes https://material-ui.com/components/text-fields/#shrink
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>

            {transaction.type === TransactionType.TRANSFER &&
              <FormControl
                fullWidth
                margin={'normal'}
              >
                <InputLabel
                  htmlFor="amountReceived"
                  required
                >
                  Amount Received
            </InputLabel>
                <Input
                  id="amountReceived"
                  name="amountReceived"
                  value={transaction.amountReceived || ''}
                  onChange={this.handleInputChange}
                  type="number"
                  inputProps={{
                    step: 0.01,
                    min: 0,
                  }}
                  required
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (['-', '+', 'e'].indexOf(event.key) !== -1) {
                      // also fixes https://material-ui.com/components/text-fields/#shrink
                      event.preventDefault();
                    }
                  }}
                />
              </FormControl>}

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <InputLabel
                htmlFor="fee"
              >
                Fee
            </InputLabel>
              <Input
                id="fee"
                name="fee"
                value={transaction.fee || ''}
                onChange={this.handleInputChange}
                type="number"
                inputProps={{
                  step: 0.01,
                  min: 0,
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (['-', '+', 'e'].indexOf(event.key) !== -1) {
                    // also fixes https://material-ui.com/components/text-fields/#shrink
                    event.preventDefault();
                  }
                }}
              />
            </FormControl>

            <FormControlLabel
              name="taxable"
              control={
                <Checkbox
                  checked={transaction.taxable || false}
                  onChange={this.handleInputChange}
                />
              }
              label="Taxable"
            />

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <Autocomplete
                required
                handleChange={(category: string) => this.props.setTransaction({
                  ...transaction,
                  category,
                })}
                label={'Category'}
                placeholder={'Select a category'}
                suggestions={categories}
                value={transaction.category}
              />
            </FormControl>

            <TextField
              fullWidth
              name="description"
              label="Description"
              value={transaction.description || ''}
              onChange={this.handleInputChange}
              margin="normal"
            />

            <LocalizationProvider dateAdapter={DateFnsUtils}>
              <DatePicker
                renderInput={
                  props => <TextField {...props} required name="date" fullWidth margin="normal" />}
                label="Date"
                inputFormat="MM/dd/yyyy"
                value={transaction.date || new Date()}
                onChange={this.handleDateChange}
                OpenPickerButtonProps={{
                  'aria-label': 'date',
                }}
              />
            </LocalizationProvider>

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <Autocomplete
                required
                handleChange={(account: string) => this.props.setTransaction({
                  ...transaction,
                  fromAccount: account,
                })}
                label={transaction.type === TransactionType.TRANSFER ? 'From Account' : 'Account'}
                placeholder={'Select an account'}
                suggestions={this.props.accounts}
                value={transaction.fromAccount}
              />
            </FormControl>

            {transaction.type === TransactionType.TRANSFER &&
              <FormControl
                fullWidth
                margin={'normal'}
              >
                <Autocomplete
                  required
                  handleChange={(account: string) => this.props.setTransaction({
                    ...transaction,
                    toAccount: account,
                  })}
                  label={'To Account'}
                  placeholder={'Select an account'}
                  suggestions={this.props.accounts}
                  value={transaction.toAccount}
                />
              </FormControl>}

            <FormControl
              fullWidth
              margin={'normal'}
            >
              <Autocomplete
                handleChange={(account: string | undefined) => this.props.setTransaction({
                  ...transaction,
                  cashbackAccount: account,
                })}
                label={'Cashback Account'}
                placeholder={'Select an account'}
                suggestions={this.props.accounts}
                value={transaction.cashbackAccount}
              />
            </FormControl>

            {transaction.cashbackAccount &&
              <FormControl
                fullWidth
                margin={'normal'}
              >
                <InputLabel
                  htmlFor="cashbackAmount"
                  required
                >
                  Cashback Amount
            </InputLabel>
                <Input
                  id="cashbackAmount"
                  autoFocus={!transaction.hasOwnProperty('id')}
                  name="cashbackAmount"
                  value={transaction.cashbackAmount || ''}
                  onChange={this.handleInputChange}
                  type="number"
                  inputProps={{
                    step: 0.01,
                    min: 0,
                  }}
                  required
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (['-', '+', 'e'].indexOf(event.key) !== -1) {
                      // also fixes https://material-ui.com/components/text-fields/#shrink
                      event.preventDefault();
                    }
                  }}
                />
              </FormControl>}
          </form>
        </Container>
      </Dialog>
    );
  }
}

export default withRouter(
  withSnackbar(
    connect(mapStateToProps, mapDispatchToProps)(
      withStyles(styles)(TransactionForm),
    ),
  ),
);
