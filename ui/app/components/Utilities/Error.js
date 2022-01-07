import React, { Component } from "react";

export default class Error extends Component {
  render() {
    return (
      <p
        className={`text-error text-xs mt-1 ${
          this.props.styles ? this.props.styles : ""
        }`}
      >
        {this.props.icon === "true" ? (
          <img
            src="/assets/icons/error.svg"
            alt=""
            className="warning inline-block"
          />
        ) : null}
        {this.props.message}
      </p>
    );
  }
}
