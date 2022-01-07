import React, { Component } from "react";

export default class Switch extends Component {
  render() {
    return (
      <div className="ml-18 mt-2 relative">
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>

        {this.props.text ? (
          <p className="inline-block text-xs text-helper absolute ml-4 -mt-1">
            {this.props.text}
          </p>
        ) : (
          ""
        )}
        <hr className="border-helper -ml-2 mr-8"></hr>
      </div>
    );
  }
}
