import React, { Component } from "react";

export default class Warning extends Component {
  render() {
    return (
      <p className="text-attention text-xxs mt-1">
        {this.props.icon === "true"  ? (
          <img
            src="/assets/icons/warning.svg"
            alt=""
            className="warning inline-block"
          />
        ) : null}
        {this.props.message}
      </p>
    );
  }
}
