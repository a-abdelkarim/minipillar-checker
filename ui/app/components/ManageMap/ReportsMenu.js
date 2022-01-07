import React, { Component } from "react";
import AppContext from "../../contexts/AppContext";

class ReportsMenu extends Component {
  render() {
    return (
      <div
        className={`arabic model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4`}
      >
        <div className="bg-white  mx-auto  shadow sm:rounded-lg w-1/4">
          <ul className="divide-y divide-gray-200">
            <li className="py-4 flex">
              <div className="mr-3">
                <p
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => {
                    this.context.state.showReportModel("model:EventsByDate");
                    this.props.toggleViewReporting();
                  }}
                >
                  تقرير الاحداث عن مدة
                </p>
                <p className="text-sm text-gray-500">
                   رصد واكتشاف تكرار الحدث خلال فترة محددة
                </p>
              </div>
            </li>
            <li className="py-4 flex">
              <div className="mr-3">
                <p
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => {
                    this.context.state.showReportModel("model:EventsByMonth");
                    this.props.toggleViewReporting();
                  }}
                >
                  تقرير الاحداث شهرى
                </p>
                <p className="text-sm text-gray-500">
                   رصد واكتشاف تكرار الحدث خلال شهر
                </p>
              </div>
            </li>
            <li className="py-4 flex">
              <div className="mr-3">
                <p
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => {
                    this.context.state.showReportModel("model:SiteByDate");
                    this.props.toggleViewReporting();
                  }}
                >
                  تقرير تحركات عن موقع
                </p>
                <p className="text-sm text-gray-500">
                   رصد واكتشاف الاحداث للعناصر عن موقع
                </p>
              </div>
            </li>
            <li className="py-4 flex">
              <div className="mr-3">
                <p
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={() => {
                    this.context.state.showReportModel(
                      "model:EventsByDateLocation"
                    );
                    this.props.toggleViewReporting();
                  }}
                >
                   تقرير الاحداث بالاحداثيات عن مدة
                </p>
                <p className="text-sm text-gray-500">
                    رصد واكتشاف تكرار الحدث بالاحداثيات  خلال فترة محددة
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-5  flex flex-row-reverse">
            <button
              type="button"
              onClick={this.props.toggleViewReporting}
              className="mb-4 inline-flex items-center  px-4 py-2   text-sm leading-5 font-medium rounded-md  ml-5 bg-white  focus:outline-none focus:border-blue-300 focus:shadow-outline-blue   transition ease-in-out duration-150 text-blue-700 bg-blue-100 hover:bg-blue-50 focus:outline-none"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ReportsMenu.contextType = AppContext;
export default ReportsMenu;
