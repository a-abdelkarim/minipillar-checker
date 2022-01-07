import React, { Component, Fragment } from "react";

export default class Alert extends Component {
  state = {
    data: [],
  };

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.alerts) {
      return props;
    }
  }

  renderAlerts = () => {
    let alertsArray = [];
    this.state.data.map((alert, index) => {
      alertsArray.push(
        <div
          key={alert.uuid}
          style={{ right: 10, top: index * 100 }}
          className="max-w-sm  z-50 absolute mt-4  w-full bg-white shadow-lg rounded-lg pointer-events-auto"
        >
          <div className="rounded-lg shadow-xs overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {alert.type === "sucsess" ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : null}
                  {alert.type === "error" ? (
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : null}
                  {alert.type === "info" ? (
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : null}
                  {alert.type === "warning" ? (
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : null}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm leading-5 font-bold text-gray-900">
                    {alert.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-gray-700">
                    {alert.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => {
                      this.props.hideCodeMessage(alert.uuid);
                    }}
                    className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return alertsArray;
  };

  render() {
    return (
      <div
        style={{ zIndex: 500 }}
        className="fixed inset-0   justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end"
      >
        {this.renderAlerts()}
      </div>
    );
  }
}
