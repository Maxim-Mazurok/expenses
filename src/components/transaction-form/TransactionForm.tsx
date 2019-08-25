import React, { Component, FormEvent } from 'react';

import GlobalState, { TransactionType } from '../../types/GlobalState';
import { getAccounts, getCategories, getTransaction } from '../../selectors';
import { NewTransaction, Transaction } from '../../types/Expense';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { setTransaction } from '../../actions/setTransaction';
import {
  AppBar,
  Button,
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
  & {
  transaction?: Transaction | NewTransaction,
}
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

class TransactionForm extends Component<RouteComponentProps<{}> & Props, State> {
  state: State = {
    showDeleteDialog: false,
  };

  get formIsValid(): boolean {
    // TODO: validate category (or suggest creating new)
    return this.props.transaction.amount !== null && this.props.transaction.amount > 0;
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

    this.props.setTransaction({
      ...this.props.transaction,
      [target.name]: target.value,
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
            <FormLabel>Transaction type</FormLabel>
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
            >
              Amount
            </InputLabel>
            <Input
              id="amount"
              autoFocus
              name="amount"
              value={this.props.transaction.amount}
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

          <FormControl
            fullWidth
            margin={'normal'}
          >
            <Autocomplete
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
            value={this.props.transaction.description}
            onChange={this.handleInputChange}
            margin="normal"
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              fullWidth
              name="date"
              margin="normal"
              label="Date"
              format="MM/dd/yyyy"
              value={this.props.transaction.date}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'date',
              }}
            />
          </MuiPickersUtilsProvider>

          <div className="mdc-form-field">
            <select
              name="account"
              className="mdc-select"
              value={this.props.transaction.account}
              onChange={this.handleInputChange}
              required
            >
              {this.props.accounts.map(account =>
                <option value={account} key={account}>{account}</option>,
              )}
            </select>
          </div>
        </form>
      </Dialog>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TransactionForm)));
