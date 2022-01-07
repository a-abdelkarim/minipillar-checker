import React, { Component, Fragment } from "react";
import Side from "./Side";
import Header from "./Header";
import AppContext from "../../contexts/AppContext";
import { withRouter } from "react-router-dom";

class Container extends Component {
  state = {
    toggleSide: true,
  };

  toggleSide = () => {
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
  };

  render() {
    return (
      <Fragment>
        {this.props.location.pathname !== "/login" &&
        this.props.location.pathname !== "/userZone" ? (
          <div className=" h-screen bg-white flex overflow-hidden  ">
            <div
              id="loadinBar"
              className="w-full fixed header-bar widthTransition"
            >
              <span></span>
            </div>

            <div className="flex flex-shrink-0">
              <Side toggleSide={this.state.toggleSide}></Side>
            </div>

            <div className="flex flex-col w-0 flex-1 overflow-hidden">
              <Header toggleSide={this.toggleSide}></Header>

              <main
                className={`flex-1 relative z-0  overflow-hidden ${
                  this.props.location.pathname !== "/map" ? "p-5" : null
                }   focus:outline-none`}
                tabIndex="0"
              >
                {this.props.children}
              </main>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}
Container.contextType = AppContext;
export default withRouter(Container);
