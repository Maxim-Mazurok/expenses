import React, { Component } from "react";
import OperationIcon from "./OperationIcon";

export default class OperationDetails extends Component {
  static formatDate(date) {
    const dateParts = date.split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  render() {
    return (
      <li
        className="mdc-list-item"
        onClick={() => this.props.onSelect(this.props.expense)}
      >
        <OperationIcon category={this.props.expense.category} />
        <span className="mdc-list-item__text">
          {this.props.expense.category}
          <span className="mdc-list-item__text__secondary">
            {OperationDetails.formatDate(this.props.expense.date)}
            {this.props.expense.description
              ? ` ${this.props.expense.description.replace(/^(.{14}).+/, "$1…")}`
              : ""}
          </span>
        </span>
        <span className="mdc-list-item__end-detail">
          {this.props.expense.account.indexOf('(usd)') === -1 ? '₴' : '$'}{this.props.expense.amount}
        </span>
      </li>
    );
  }
}