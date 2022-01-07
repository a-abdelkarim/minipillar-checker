import React, { Component } from "react";
export default class Visibility extends Component {
  state = {
    visable: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visable !== this.state.visable) {
      this.setState({ visable: nextProps.visable });
    }
  }

  componentDidMount() {
    this.setState({ visable: this.props.visable });
  }

  render() {
    return (
      <li
        className={`inline-block mb-1 cursor-pointer  ${
          this.state.visable ? "" : "hide"
        }`}
        onClick={this.props.action}
      >
        <img
          src="/assets/icons/eye.svg"
          alt="eye"
          className={`raster-layers `}
        />
      </li>
    );
  }
}
