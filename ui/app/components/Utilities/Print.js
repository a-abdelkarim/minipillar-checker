import React, { Component} from "react";
import AppContext from "../../contexts/AppContext";


class ApplicationError extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <iframe title="printFrame"  id="printFrame" className="printFrame"></iframe>
        )}
      </AppContext.Consumer>
    );
  }
}

export default ApplicationError;
