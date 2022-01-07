import React, { Component } from "react";

export default class DeleteModal extends Component {
  render() {
    return (
      <div className=" model-dark-z absolute inset-0 flex items-center justify-center layer-4">
        <div className="bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <p>{this.props.children}</p>
            </div>
            <div className="mt-5  flex flex-row-reverse">
              <button
                type="button"
                onClick={this.props.action}
                className="inline-flex  ml-5 items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={this.props.hide}
                className="inline-flex items-center  px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
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
