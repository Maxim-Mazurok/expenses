import React, { Component, FormEvent } from 'react';

import GlobalState, { TransactionType } from '../../types/GlobalState';
import {
  getAccounts,
  getCategories,
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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { TransactionTypeName } from '../../texts';
import { connect } from 'react-redux';
import Autocomplete from '../Automcomplete';
import {
  KeyboardDatePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const mapStateToProps = (state: GlobalState) => ({
  categories: getCategories(state),
  accounts: getAccounts(state),
  transaction: getTransaction(state),
  transactions: getTransactions(state),
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
  & RouteComponentProps<{ id: string }>
  & {
  classes: {
    title: string
    form: string
  }
}

interface State {
  showDeleteDialog: boolean;
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
  }
};

class TransactionForm extends Component<Props, State> {
  state: State = {
    showDeleteDialog: false,
  };

  get formIsValid(): boolean {
    // TODO: validate category (or suggest creating new)
    return this.props.transaction.amount !== undefined && this.props.transaction.amount > 0;
  }

  componentDidMount() {
    transactionFromURL(this.props);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.transactions.length !== this.props.transactions.length) {
      transactionFromURL(this.props);
    }
  }

  handleDateChange = (date: MaterialUiPickersDate): void => {
    if (date) {
      this.props.setTransaction({
        ...this.props.transaction,
        date,
      });
    }
  };

  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.hasOwnProperty('checked') ? target.checked : target.value;

    this.props.setTransaction({
      ...this.props.transaction,
      [target.name]: value,
    });
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: this.props.onSubmit();
  };

  deleteTransaction = () => {
    // TODO: implement
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullScreen open={true}
              onClose={() => this.props.history.push('/')}>
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit"
                        onClick={() => this.props.history.push('/')}
                        aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {this.props.transaction.hasOwnProperty('id') ? 'Edit' : 'New'}{' transaction'}
            </Typography>
            <Button
              color="inherit"
              type={'submit'}
              disabled={!this.formIsValid}
              onClick={() => {/*TODO: save transaction*/
              }}
            >
              {this.props.transaction.hasOwnProperty('id') ? 'update' : 'add'}
            </Button>
            {this.props.transaction.hasOwnProperty('id') &&
            <Button
              color="inherit"
              onClick={() => this.setState({ showDeleteDialog: true })}
            >
              delete {/*TODO: add icon*/}
            </Button>
            }
          </Toolbar>
        </AppBar>
        <form
          className={classes.form}
          onSubmit={this.handleSubmit}
          noValidate
        >
          <Dialog
            open={this.state.showDeleteDialog}
            onClose={() => this.setState({ showDeleteDialog: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
            >
              Do you really want to delete the transaction?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
                onClick={() => this.setState({ showDeleteDialog: false })}
                autoFocus
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={this.deleteTransaction}
                color="primary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* TODO: maybe, display type editing only when editing existing transaction */}
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
              value={this.props.transaction.type}
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
              {this.props.transaction.type === TransactionType.TRANSFER ? 'Amount Sent' : 'Amount'}
            </InputLabel>
            <Input
              id="amount"
              autoFocus={!this.props.transaction.hasOwnProperty('id')}
              name="amount"
              value={this.props.transaction.amount || ''}
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

          {this.props.transaction.type === TransactionType.TRANSFER &&
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
              value={this.props.transaction.amountReceived || ''}
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
              value={this.props.transaction.fee || ''}
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
                checked={this.props.transaction.taxable || false}
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
                ...this.props.transaction,
                category,
              })}
              label={'Category'}
              placeholder={'Select a category'}
              suggestions={this.props.categories}
              value={this.props.transaction.category}
            />
          </FormControl>

          <TextField
            fullWidth
            name="description"
            label="Description"
            value={this.props.transaction.description || ''}
            onChange={this.handleInputChange}
            margin="normal"
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              required
              autoOk
              fullWidth
              name="date"
              margin="normal"
              label="Date"
              format="MM/dd/yyyy"
              value={this.props.transaction.date || new Date()}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'date',
              }}
            />
          </MuiPickersUtilsProvider>

          <FormControl
            fullWidth
            margin={'normal'}
          >
            <Autocomplete
              required
              handleChange={(account: string) => this.props.setTransaction({
                ...this.props.transaction,
                fromAccount: account,
              })}
              label={this.props.transaction.type === TransactionType.TRANSFER ? 'From Account' : 'Account'}
              placeholder={'Select an account'}
              suggestions={this.props.accounts}
              value={this.props.transaction.fromAccount}
            />
          </FormControl>

          {this.props.transaction.type === TransactionType.TRANSFER &&
          <FormControl
            fullWidth
            margin={'normal'}
          >
            <Autocomplete
              required
              handleChange={(account: string) => this.props.setTransaction({
                ...this.props.transaction,
                toAccount: account,
              })}
              label={'To Account'}
              placeholder={'Select an account'}
              suggestions={this.props.accounts}
              value={this.props.transaction.toAccount}
            />
          </FormControl>}

          <FormControl
            fullWidth
            margin={'normal'}
          >
            <Autocomplete
              handleChange={(account: string | undefined) => this.props.setTransaction({
                ...this.props.transaction,
                cashbackAccount: account,
              })}
              label={'Cashback Account'}
              placeholder={'Select an account'}
              suggestions={this.props.accounts}
              value={this.props.transaction.cashbackAccount}
            />
          </FormControl>

          {this.props.transaction.cashbackAccount &&
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
              autoFocus={!this.props.transaction.hasOwnProperty('id')}
              name="cashbackAmount"
              value={this.props.transaction.cashbackAmount || ''}
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
      </Dialog>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TransactionForm)));
