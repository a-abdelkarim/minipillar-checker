import React, { Component, Fragment } from "react";
import { CSSTransition } from "react-transition-group";

export default class Tooltip extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  state = {
    show: false,
  };

  componentDidMount() {
    this.setState({ show: true }, () => {
      document.addEventListener("mousedown", this.handleClickOutside);
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.hide();
    }
  }

  hide = () => {
    this.setState({ show: false }, () => {
      setTimeout(() => {
        this.props.action();
      }, 500);
    });
  };

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  render() {
    return (
      <Fragment>
        <CSSTransition
          in={this.state.show}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <div
            ref={this.setWrapperRef}
            className=" rounded-sm bg-tooltip absolute mt-6  ml-6 tooltip text-white"
          >
            <h2 className="text-xs p-1 ml-1">{this.props.title}</h2>
            <p className="text-xs pl-1 ml-1">{this.props.children}</p>
            <input
              onClick={this.hide}
              type="button"
              value="Esc to close"
              className="  h-5 mb-2 text-black px-2 text-xs ml-2 mt-2 rounded-sm"
            />
          </div>
        </CSSTransition>
      </Fragment>
    );
  }
}
