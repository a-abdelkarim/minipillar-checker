import React, { Component, Fragment } from "react";
import { itemTypeList, itemTypeSubList } from "../../services/itemTypes";
import ScrollArea from "react-scrollbar";
import { itemCreateSub } from "../../services/items";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";

import GeoJSON from "ol/format/GeoJSON.js";
import Feature from "ol/Feature.js";
class AddMobileItem extends Component {
  state = {
    item: {},
    errors: {},
    types: [],
    subTypes: [],
    showSub: false,
    showSubList: false,
    showList: false,
    minimized: false,
  };

  getSub = (id) => {
    itemTypeSubList(id)
      .then((response) => {
        this.setState({
          subTypes: response.items,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  };

  componentDidMount() {
    itemTypeList()
      .then((response) => {
        this.setState({
          types: response.items.filter((item) => item.mobile),
          item: { id: 0, site_id: this.props.site_id },
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  }

  handelchange = (e) => {
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    if (e.target.name === "count") {
      temp[e.target.name] = parseInt(e.target.value, 10);
    }
    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  save = () => {
    let checks = {
      name: ["required"],
      count: ["required"],
      item_type: ["required"],
      sub_item_type: ["required"],
    };

    let errors = this.context.state.validation(this.state.item, checks);
    let error = false;

    this.setState({
      errors: {
        ...errors,
      },
    });
    Object.keys(checks).forEach((key) => {
      // console.log(this.context.state.getProperty(errors, key));
      // console.log(key);
      if (this.context.state.getProperty(errors, key) !== undefined) {
        error = true;
      }
    });
    if (error === false) {
      this.props.create([this.state.item]);
    }
  };

  render() {
    return (
      <Fragment>
        <div className="arabic model-dark-z bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
          <div className="bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-bold text-gray-900">
                {this.props.title}
              </h3>
              <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
                <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    العنوان
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                      <input
                        autocomplete="off"
                        type="text"
                        id="name"
                        name="name"
                        onChange={this.handelchange}
                        className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                        value={this.state.item.name}
                      ></input>
                    </div>

                    {this.state.errors.name ? (
                      <Error message={this.state.errors.name} />
                    ) : null}
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    النوع
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                      <div className="space-y-1">
                        <div className="relative">
                          <span className="inline-block w-full rounded-md shadow-sm">
                            {this.state.types.filter((item) => {
                              return item.id === this.state.item.item_type_id;
                            }).length === 0 ? (
                              <button
                                onClick={() => {
                                  this.setState({
                                    showList: !this.state.showList,
                                  });
                                }}
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded="true"
                                aria-labelledby="listbox-label"
                                className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-normal block truncate">
                                    اختر النوع
                                  </span>
                                </div>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <svg
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </span>
                              </button>
                            ) : null}

                            {this.state.types
                              .filter((item) => {
                                return item.id === this.state.item.item_type_id;
                              })
                              .map((item, index) => {
                                return (
                                  <button
                                    onClick={() => {
                                      this.setState({
                                        showList: !this.state.showList,
                                      });
                                    }}
                                    key={index}
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded="true"
                                    aria-labelledby="listbox-label"
                                    className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={`/static/icons/${item.icon.file}`}
                                        alt=""
                                        className="mr-4 flex-shrink-0 h-6 w-6 rounded-full"
                                      />
                                      <span className="mr-4 text-gray-700 font-normal block truncate">
                                        {item.name}
                                      </span>
                                    </div>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                      <svg
                                        className="h-5 w-5 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                      >
                                        <path
                                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                          stroke-width="1.5"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>
                                    </span>
                                  </button>
                                );
                              })}
                          </span>
                          {this.state.showList === true ? (
                            <div className="  z-10 absolute mt-1 w-full rounded-md bg-white shadow-lg">
                              <ul
                                tabindex="-1"
                                role="listbox"
                                aria-labelledby="listbox-label"
                                aria-activedescendant="listbox-item-3"
                                className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                              >
                                <ScrollArea
                                  style={{
                                    overflow: "hidden",
                                    maxHeight: "200px",
                                  }}
                                >
                                  {this.state.types.map((item, index) => {
                                    return (
                                      <li
                                        onClick={() => {
                                          // this.state.item.icon_id = item.icon_id;
                                          this.state.item.item_type_id =
                                            item.id;
                                          // this.state.item.mobile = item.mobile;
                                          this.state.item.item_type = item;
                                          this.state.item.sub_item_type_id = null;
                                          let error = this.state.errors;
                                          error["item_type"] = null;
                                          if (item.mobile === true) {
                                            this.getSub(item.id);
                                          }
                                          this.setState({
                                            showSub: item.mobile,
                                            item: this.state.item,
                                            showList: false,
                                            errors: error,
                                          });
                                        }}
                                        key={index}
                                        id="listbox-item-0"
                                        role="option"
                                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                                      >
                                        <div className="flex items-center ">
                                          <img
                                            src={`/static/icons/${item.icon.file}`}
                                            alt=""
                                            className="mr-4 flex-shrink-0 h-6 w-6 rounded-full"
                                          />
                                          <span className="mr-4 text-gray-700 font-normal block truncate">
                                            {item.name}
                                          </span>
                                        </div>
                                        {this.state.item.item_type_id ===
                                        item.id ? (
                                          <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg
                                              className="h-5 w-5"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                              />
                                            </svg>
                                          </span>
                                        ) : null}
                                      </li>
                                    );
                                  })}
                                </ScrollArea>
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {this.state.errors.item_type ? (
                      <Error message={this.state.errors.item_type} />
                    ) : null}
                  </div>
                </div>

                {this.state.showSub === true ? (
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                    >
                      النوع الفرعي
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                        <div className="space-y-1">
                          <div className="relative">
                            <span className="inline-block w-full rounded-md shadow-sm">
                              {this.state.subTypes.filter((item) => {
                                return (
                                  item.id === this.state.item.sub_item_type_id
                                );
                              }).length === 0 ? (
                                <button
                                  onClick={() => {
                                    this.setState({
                                      showSubList: !this.state.showSubList,
                                    });
                                  }}
                                  type="button"
                                  aria-haspopup="listbox"
                                  aria-expanded="true"
                                  aria-labelledby="listbox-label"
                                  className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="font-normal block truncate">
                                      اختر النوع الفرعي
                                    </span>
                                  </div>
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                      className="h-5 w-5 text-gray-400"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      stroke="currentColor"
                                    >
                                      <path
                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              ) : null}

                              {this.state.subTypes
                                .filter((item) => {
                                  return (
                                    item.id === this.state.item.sub_item_type_id
                                  );
                                })
                                .map((item, index) => {
                                  return (
                                    <button
                                      onClick={() => {
                                        this.setState({
                                          showSubList: !this.state.showSubList,
                                        });
                                      }}
                                      key={index}
                                      type="button"
                                      aria-haspopup="listbox"
                                      aria-expanded="true"
                                      aria-labelledby="listbox-label"
                                      className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                    >
                                      <div className="flex items-center ">
                                        <img
                                          src={`/static/icons/${item.icon.file}`}
                                          alt=""
                                          className="mr-4 flex-shrink-0 h-6 w-6 rounded-full"
                                        />
                                        <span className="mr-4 text-gray-700 font-normal block truncate">
                                          {item.name}
                                        </span>
                                      </div>
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg
                                          className="h-5 w-5 text-gray-400"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                          stroke="currentColor"
                                        >
                                          <path
                                            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </button>
                                  );
                                })}
                            </span>
                            {this.state.showSubList === true ? (
                              <div className=" z-10 absolute mt-1 w-full rounded-md bg-white shadow-lg">
                                <ul
                                  tabindex="-1"
                                  role="listbox"
                                  aria-labelledby="listbox-label"
                                  aria-activedescendant="listbox-item-3"
                                  className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                                >
                                  <ScrollArea
                                    style={{
                                      overflow: "hidden",
                                      maxHeight: "200px",
                                    }}
                                  >
                                    {this.state.subTypes.map((item, index) => {
                                      return (
                                        <li
                                          onClick={() => {
                                            // this.state.item.icon_id = item.icon_id;
                                            this.state.item.sub_item_type_id =
                                              item.id;
                                            this.state.item.sub_item_type = item;
                                            let error = this.state.errors;
                                            error["sub_item_type"] = null;
                                            this.setState({
                                              item: this.state.item,
                                              showSubList: false,
                                              errors: error,
                                            });
                                          }}
                                          key={index}
                                          name="sub_item_type"
                                          id="listbox-item-0"
                                          role="option"
                                          className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                                        >
                                          <div className="flex items-center ">
                                            <img
                                              src={`/static/icons/${item.icon.file}`}
                                              alt=""
                                              className="mr-4 flex-shrink-0 h-6 w-6 rounded-full"
                                            />
                                            <span className="mr-4 text-gray-700 font-normal block truncate">
                                              {item.name}
                                            </span>
                                          </div>
                                          {this.state.item.sub_item_type_id ===
                                          item.id ? (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                              <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                              >
                                                <path
                                                  fill-rule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clip-rule="evenodd"
                                                />
                                              </svg>
                                            </span>
                                          ) : null}
                                        </li>
                                      );
                                    })}
                                  </ScrollArea>
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {this.state.errors.sub_item_type ? (
                        <Error message={this.state.errors.sub_item_type} />
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {this.state.showSub === true ? (
                  <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="count"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                    >
                      العدد
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                        <input
                          autocomplete="off"
                          type="number"
                          id="count"
                          name="count"
                          onChange={this.handelchange}
                          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                          value={this.state.item.count}
                        ></input>
                      </div>

                      {this.state.errors.count ? (
                        <Error message={this.state.errors.count} />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mt-5  flex flex-row-reverse">
                <button
                  type="button"
                  onClick={this.save}
                  className=" inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                >
                  إضافه
                </button>
                <button
                  type="button"
                  onClick={this.props.close}
                  className=" inline-flex items-center  px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 ml-5 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
AddMobileItem.contextType = AppContext;
export default AddMobileItem;
