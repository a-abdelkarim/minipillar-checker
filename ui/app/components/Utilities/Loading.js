import React, { Component, Fragment } from "react";
import AppContext from "../../contexts/AppContext";

class Loading extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {(context) => (
          <Fragment>
            {context.state.Loading === true ? (
              <div className="holdLoading">
                <img src="/static/images/loader.svg" alt="loading" />
              </div>
            ) : null}
          </Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Loading;
