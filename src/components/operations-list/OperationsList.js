import React, { Component } from "react";
import OperationDetails from "./OperationDetails.js"
import "@material/list/dist/mdc.list.css";
import "./OperationsList.css";

class OperationsList extends Component {
  render() {
    return (
      <ul className="mdc-list mdc-list--two-line mdc-list--avatar-list">
        {this.props.expenses.map(expense =>
          <OperationDetails
            key={expense.id}
            expense={expense}
            onSelect={this.props.onSelect}
          />
        )}
      </ul>
    );
  }
}

export default OperationsList;
