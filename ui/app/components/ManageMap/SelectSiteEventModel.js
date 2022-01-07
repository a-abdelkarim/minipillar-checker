import React, { Component, Fragment } from "react";

import AppContext from "../../contexts/AppContext";

class SelectSiteEventModel extends Component {
  state = {
    id: 0,
    site: {},
    user: JSON.parse(localStorage.getItem("user")),
  };
  componentDidMount() {
    if (
      JSON.parse(localStorage.getItem("user")).first_name !==
      this.state.user.first_name
    ) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user")),
      });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.id !== nextProps.id) {
      return {
        id: nextProps.id,
        site: nextProps.site,
      };
    }
    return null;
  }

  render() {
    return (
      <div
        key={this.state.id}
        className="arabic fixed w-2/6 z-10 left-0 bottom-0 ml-5 mb-8  col-span-1 bg-white rounded-lg shadow"
      >
        <div className="w-full flex items-center justify-between p-6 space-x-6">
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="text-gray-900 text-sm leading-5 font-bold truncate">
                معلومات الموقع
              </h3>
            </div>
            <p className="mt-1 text-gray-700 text-sm leading-5 truncate">
              الإسم : {this.state.site.name}
            </p>
            <p>{this.state.site.description}</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="-mt-px flex">
            {this.context.state.update ? (
              <div className="w-0 flex-1 flex border-r border-gray-200">
                <a
                  onClick={() => {
                    this.props.toggleSite(this.props.id);
                  }}
                  className=" cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                >
                  <span className="">تحديث</span>
                </a>
              </div>
            ) : null}

            {this.context.state.delete ? (
              <div className="-ml-px w-0 flex-1 flex border-r border-gray-200">
                <a
                  onClick={this.props.toggleDeleteSite}
                  className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                >
                  <span className="">حذف</span>
                </a>
              </div>
            ) : null}

            <div className="-ml-px w-0 flex-1 flex border-r border-gray-200">
              <a
                onClick={() => {
                  this.props.toggleEvents("site", this.props.id);
                }}
                className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
              >
                <span className="">الأحداث</span>
              </a>
            </div>
            <div className="-ml-px w-0 flex-1 flex border-r border-gray-200">
              <a
                onClick={() => {
                  this.props.toggleInventory(0);
                }}
                className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
              >
                <span className="">العناصر</span>
              </a>
            </div>
            {this.state.user.type !== "viewer" ? (
              <div className="-ml-px w-0 flex-1 flex border-r border-gray-200">
                <a
                  onClick={() => {
                    this.props.selectSite(this.props.id);
                    this.props.toggleItem(0);
                  }}
                  className="cursor-pointer relative w-0 flex-1 inline-flex
                  items-center justify-center py-4 text-sm leading-5
                  text-gray-700 font-medium border border-transparent
                  rounded-br-lg hover:text-gray-500 focus:outline-none
                  focus:shadow-outline-blue focus:border-blue-300 focus:z-10
                  transition ease-in-out duration-150"
                >
                  <span className="">إضافه عنصر</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
SelectSiteEventModel.contextType = AppContext;
export default SelectSiteEventModel;
