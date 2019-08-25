import React, { ChangeEvent, Component, FormEvent } from 'react';
import { MDCTextField } from '@material/textfield';
import { MDCDialog } from '@material/dialog';

import '@material/form-field/dist/mdc.form-field.css';
import '@material/select/dist/mdc.select.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';

import './TransactionForm.scss';
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
  IconButton,
  Theme,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { TransactionTypeName } from '../../texts';
import { formatDateToHTML } from '../../helpers';
import { connect } from 'react-redux';

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
  }
}

interface State {
}

const styles = (theme: Theme) => {
  return createStyles({
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  });
};

class TransactionForm extends Component<RouteComponentProps<{}> & Props, State> {
  private form: HTMLFormElement | null = null;
  private amountInput: HTMLInputElement | null = null;
  private dialog: MDCDialog | null = null;

  get formIsValid(): boolean {
    return this.props.transaction.amount > 0;
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;

    this.props.setTransaction({
      ...this.props.transaction,
      [target.name]: target.value,
    });
  };

  componentDidMount() {
    document.querySelectorAll('.mdc-text-field').forEach(selector => {
      new MDCTextField(selector);
    });
    if (this.props.transaction === undefined && this.amountInput !== null) {
      this.amountInput.focus();
    }
  }

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: this.props.onSubmit();
  };

  initializeDeleteModal = (element: HTMLDivElement) => {
    if (element) {
      this.dialog = new MDCDialog(element);
      this.dialog.listen('MDCDialog:closed', () => {
        // TODO: Do we still need this? a fix for not closing the modal dialog properly
        document.body.className = document.body.className.replace(
          'mdc-dialog-scroll-lock',
          '',
        );
        // TODO: this.props.onDelete(this.props.transaction);
      });
    }
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
            >
              {this.props.transaction.hasOwnProperty('id') ? 'update' : 'add'}
            </Button>
            {this.props.transaction &&
            <Button
              color="inherit"
              onClick={() => this.dialog && this.dialog.open()}
            >
              delete {/*TODO: add icon*/}
            </Button>
            }
          </Toolbar>
        </AppBar>
        <form
          onSubmit={this.handleSubmit}
          ref={form => {
            this.form = form;
          }}
          noValidate
        >
          <div className="mdc-dialog"
               role="alertdialog"
               aria-modal="true"
               aria-labelledby="my-dialog-title"
               aria-describedby="my-dialog-content"
               ref={this.initializeDeleteModal}
          >
            <div className="mdc-dialog__container">
              <div className="mdc-dialog__surface">
                <h2 className="mdc-dialog__title" id="my-dialog-title">Are you
                  sure?</h2>
                <div className="mdc-dialog__content" id="my-dialog-content">
                  Do you really want to delete the transaction?
                </div>
                <footer className="mdc-dialog__actions">
                  <button type="button"
                          className="mdc-button mdc-dialog__button"
                          data-mdc-dialog-action="no">
                    <span className="mdc-button__label">Cancel</span>
                  </button>
                  <button type="button"
                          className="mdc-button mdc-dialog__button mdc-dialog__button--default"
                          data-mdc-dialog-action="yes">
                    <span className="mdc-button__label">Delete</span>
                  </button>
                </footer>
              </div>
            </div>
            <div className="mdc-dialog__scrim" />
          </div>


          <div className="mdc-form-field">
            <select
              name="type"
              className="mdc-select"
              value={this.props.transaction.type}
              onChange={this.handleInputChange}
              required
            >
              <option value={TransactionType.INCOME}
                      key={TransactionType.INCOME}>{TransactionTypeName(TransactionType.INCOME)}</option>
              <option value={TransactionType.EXPENSE}
                      key={TransactionType.EXPENSE}>{TransactionTypeName(TransactionType.EXPENSE)}</option>
            </select>
          </div>
          <div className="mdc-form-field">
            <div className="mdc-text-field">
              <input
                name="amount"
                min={0}
                className="mdc-text-field__input"
                ref={el => {
                  this.amountInput = el;
                }}
                value={this.props.transaction.amount}
                onChange={this.handleInputChange}
                type="number"
                step="0.01"
                required
              />
              <label className="mdc-text-field__label">Amount</label>
            </div>
          </div>

          <div className="mdc-form-field">
            <select
              name="category"
              className="mdc-select"
              value={this.props.transaction.category}
              onChange={this.handleInputChange}
              required
            >
              {this.props.categories.map(category =>
                <option value={category} key={category}>{category}</option>,
              )}
            </select>
          </div>

          <div className="mdc-form-field">
            <div className="mdc-text-field">
              <input
                name="description"
                className="mdc-text-field__input"
                value={this.props.transaction.description}
                onChange={this.handleInputChange}
                type="text"
              />
              <label className="mdc-text-field__label">Description</label>
            </div>
          </div>

          <div className="mdc-form-field">
            <div className="mdc-text-field">
              <input
                name="date"
                className="mdc-text-field__input"
                value={formatDateToHTML(this.props.transaction.date)}
                onChange={this.handleInputChange}
                type="date"
                required
              />
              <label className="mdc-text-field__label">Date</label>
            </div>
          </div>

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
