import React, { Component, Fragment } from "react";
export default class Delete extends Component {
  render() {
    return (
      <li className="inline-block mb-1 cursor-pointer">
        <img
          src="/assets/icons/trash.svg"
          alt="eye"
          className="raster-layers"
          onClick={this.props.action}
        />
      </li>
    );
  }
}
