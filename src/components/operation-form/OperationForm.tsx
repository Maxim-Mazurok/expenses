import React, { ChangeEvent, Component, FormEvent } from 'react';
import { MDCTextField } from '@material/textfield';
import { MDCDialog } from '@material/dialog';

import '@material/form-field/dist/mdc.form-field.css';
import '@material/select/dist/mdc.select.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/button/dist/mdc.button.css';
import '@material/dialog/dist/mdc.dialog.css';

import './OperationForm.scss';

interface Props {
  categories: string[],
  accounts: string[],
  expense?: Expense,
  onSubmit: (...args: any) => void,
  onCancel: (...args: any) => void,
  onDelete: (...args: any) => void,
  onChange: (...args: any) => void,
}

interface State {
  isValid: boolean,
  expense: Expense | null,
}

class OperationForm extends Component<Props, State> {
  state = {
    isValid: false,
    expense: this.props.expense || null,
  };
  private form: HTMLFormElement | null = null;
  private amountInput: HTMLInputElement | null = null;
  private dialog: MDCDialog | null = null;

  handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;

    target.reportValidity();
    if (this.form !== null) {
      this.setState({ isValid: this.form.checkValidity() });
    }
    this.props.onChange(target.name, target.value);
  };

  componentDidMount() {
    document.querySelectorAll('.mdc-text-field').forEach(selector => {
      new MDCTextField(selector);
    });
    if (this.props.expense === undefined && this.amountInput !== null) {
      this.amountInput.focus();
    }
  }

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    this.props.onSubmit();
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
        this.props.onDelete(this.props.expense);
      });
    }
  };

  render() {
    return (
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
             ref={this.initializeDeleteModal}>
          >
          <div className="mdc-dialog__container">
            <div className="mdc-dialog__surface">
              <h2 className="mdc-dialog__title" id="my-dialog-title">Are you
                sure?</h2>
              <div className="mdc-dialog__content" id="my-dialog-content">
                Do you really want to delete the operation?
              </div>
              <footer className="mdc-dialog__actions">
                <button type="button" className="mdc-button mdc-dialog__button"
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
          <div className="mdc-text-field">
            <input
              name="amount"
              className="mdc-text-field__input"
              ref={el => {
                this.amountInput = el;
              }}
              value={this.props.expense ? this.props.expense.amount : 0}
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
            value={this.props.expense ? this.props.expense.category : ''}
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
              value={this.props.expense ? this.props.expense.description : ''}
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
              value={this.props.expense ? this.props.expense.date : ''}
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
            value={this.props.expense ? this.props.expense.account : ''}
            onChange={this.handleInputChange}
            required
          >
            {this.props.accounts.map(account =>
              <option value={account} key={account}>{account}</option>,
            )}
          </select>
        </div>

        <div className="mdc-form-field mdc-form-submit">
          <input
            type="submit"
            className="mdc-button"
            value={this.props.expense ? 'Update' : 'Add'}
            disabled={!this.state.isValid}
          />
          {this.props.expense &&
          <input
            type="button"
            className="mdc-button"
            onClick={() => this.dialog && this.dialog.open()}
            value="Delete"
          />}
          <input
            type="button"
            className="mdc-button"
            onClick={() => this.props.onCancel()}
            value="Close"
          />
        </div>
      </form>
    );
  }
}

export default OperationForm;
