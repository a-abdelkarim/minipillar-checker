import React, { Component, Fragment } from "react";

import AppContext from "../../contexts/AppContext";

class SelectItemEventModel extends Component {
  state = {
    id: 0,
    item: { item_type: {} },
  };
  componentDidMount() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.id !== nextProps.id) {
      return {
        id: nextProps.id,
        item: nextProps.item,
      };
    }
    return null;
  }

  render() {
    return (
      <div
        key={this.state.id}
        className="arabic  fixed w-1/4 z-10 left-0 bottom-0 ml-5 mb-8  col-span-1 bg-white rounded-lg shadow"
      >
        <div className="w-full flex items-center justify-between p-6 space-x-6">
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="text-gray-900 text-sm leading-5 font-bold truncate">
                عرض بيانات العنصر
              </h3>
            </div>
            <p className="mt-1 text-gray-700 text-sm leading-5 truncate">
              النوع : {this.state.item.item_type.name} - Name :{" "}
              {this.state.item.name}
            </p>
            <p>{this.state.item.description}</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="-mt-px flex">
            {this.context.state.update ? (
              <div className="w-0 flex-1 flex border-r border-gray-200">
                <a
                  onClick={() => {
                    this.props.toggleItem(this.props.id);
                  }}
                  className=" cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                >
                  <span className="ml-3">تعديل</span>
                </a>
              </div>
            ) : null}

            {this.context.state.delete ? (
              <div className="-ml-px w-0 flex-1 flex border-r border-gray-200">
                <a
                  onClick={this.props.toggleDeleteItem}
                  className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                >
                  <span className="ml-3">حذف</span>
                </a>
              </div>
            ) : null}

            <div className="-ml-px w-0 flex-1 flex">
              <a
                onClick={() => {
                  this.props.toggleImages(this.props.id);
                }}
                className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
              >
                <span className="ml-3">الوثائق</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SelectItemEventModel.contextType = AppContext;
export default SelectItemEventModel;
