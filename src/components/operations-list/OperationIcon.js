import React, { Component } from 'react';

export default class OperationIcon extends Component {
  static iconFrom(category) {
    switch (category) {
      case "Groceries":
        return "local_grocery_store";
      case "Restaurants":
        return "local_dining";
      case "Car":
        return "directions_car";
      case "Hobbies":
        return "local_library";
      case "Household":
        return "home";
      case "Shopping":
        return "local_mall";
      case "Health":
        return "local_hospital";
      case "Entertainment":
        return "local_movies";
      case "Tech":
        return "important_devices";
      case "Taxi":
        return "local_taxi";
      case "Education":
        return "school";
      default:
        return "attach_money";
    }
  }

  render() {
    return (
      <span
        className={`mdc-list-item__start-detail ${this.props.category}`}
        role="presentation"
      >
        <i className="material-icons" aria-hidden="true">
          {OperationIcon.iconFrom(this.props.category)}
        </i>
      </span>
    );
  }
}
