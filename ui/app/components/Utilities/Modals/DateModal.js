import React, { Component } from "react";
import moment from "moment";
import { DatetimePicker } from "rc-datetime-picker";
import "rc-datetime-picker/dist/picker.css";
export default class DateModal extends Component {
  constructor() {
    super();
    this.state = {
      moment: moment(),
    };
  }

  handleChange = (moment) => {
    this.setState({
      moment,
    });
  };
  render() {
    return (
      <div className="model-dark absolute inset-0 flex items-center justify-center layer-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <DatetimePicker
                moment={this.state.moment}
                onChange={this.handleChange}
              />
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  this.props.action(
                    this.state.moment.format("YYYY-MM-DD HH:mm:ss")
                  );
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-green-700 bg-green-100 hover:bg-red-50 focus:outline-none focus:border-green-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Save
              </button>

              <button
                type="button"
                onClick={this.props.hide}
                className="inline-flex items-center ml-5 px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
