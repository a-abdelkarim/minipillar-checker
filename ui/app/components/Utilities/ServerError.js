import React, { Component, Fragment } from "react";
import AppContext from "../../contexts/AppContext";

class ServerError extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {(context) => (
          <Fragment>
            {context.state.serverError === true ? (
              <section className="items-center justify-center inset-0 flex fixed w-full h-full z-50 bg-white overflow-hidden  ">
                <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative">
                    <img
                      src="/static/images/application-error.png"
                      className="mx-auto  "
                    ></img>
                    <blockquote className="mt-8">
                      <div className="max-w-3xl mx-auto text-center text-base leading-9  text-gray-900">
                        Application error please contact your system
                        administrator or{" "}
                        <a
                          className="text-primary cursor-pointer"
                          onClick={context.state.hideError}
                        >
                          click here
                        </a>{" "}
                        To try again .
                      </div>
                    </blockquote>
                  </div>
                </div>
              </section>
            ) : null}
          </Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default ServerError;
