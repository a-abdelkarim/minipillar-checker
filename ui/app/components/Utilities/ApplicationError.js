import React, { Component, Fragment } from "react";
import AppContext from "../../contexts/AppContext";

class ApplicationError extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {(context) => (
          <Fragment>
            {context.state.applicationError === true ? (
              <section className="items-center justify-center inset-0 flex fixed w-full h-full z-80 bg-white overflow-hidden  ">
                <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative">
                    <img
                      src="/static/images/application-error.png"
                      className="mx-auto  "
                    ></img>
                    <blockquote className="mt-8">
                      <div className="max-w-3xl mx-auto text-center text-base leading-9  text-gray-900">
                        <p>
                          Application error please contact the system
                          administrator
                        </p>
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

export default ApplicationError;
