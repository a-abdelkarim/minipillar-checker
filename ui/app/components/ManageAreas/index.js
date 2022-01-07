import React, { Component, Fragment } from "react";
import { CSSTransition } from "react-transition-group";
import ScrollArea from "react-scrollbar";
import ReactTagInput from "@pathofdev/react-tag-input";

import { areaDelete, areaRecords } from "../../services/areas";
import AppContext from "../../contexts/AppContext";

import AreaModel from "./AreaModel";
import DeleteModal from "../Utilities/Modals/DeleteModal";
// Layout
import Container from "../Layout/Container";
class ManageAreas extends Component {
  constructor() {
    super();
    this.state = {
      show: true,

      showUpdate: false,
      showCreate: false,
      showDelete: false,

      items: [],
      selectedId: null,
      selectedArea: {},

      searchQuery: [],
      filterQuery: [],
      orderQuery: { type: "id", order: false },
      page: 1,
      pages: 1,
    };
  }

  search = (tags) => {
    //set search value at state and context
    this.setState(
      {
        page: 1,
        searchQuery: tags,
      },
      this.getData
    );
    this.context.state.setSearchQuery(tags);
  };

  delete = () => {
    //back-end // delete transit //
    areaDelete(this.state.selectedId)
      .then((res) => {
        this.getData();
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    //hide window
    this.toggleDelete();
  };

  //on user click to show or hide transit
  handleChange = (field) => {
    let id = parseInt(field.target.value);
    //show loading
    let items = this.state.items.map((item) => {
      if (item.id === id) {
        item.loading = true;
      }
      return item;
    });
    this.setState({
      items: items,
    });
  };

  //on user click delete
  toggleDelete = (id) => {
    this.setState({
      selectedId: id,
      showDelete: !this.state.showDelete,
    });
  };

  // add order
  addOrder = (type) => {
    let temp = this.state.orderQuery;
    if (temp.type === type) {
      temp.order = temp.order === "desc" ? "asc" : "desc";
    } else {
      temp = { type: type, order: "desc" };
    }
    //save order to state
    this.setState(
      {
        orderQuery: temp,
      },
      //update the table data
      this.getData
    );
    //save order to context
    this.context.state.setOrderQuery(temp);
  };

  changepage = (page) => {
    //save page to state
    this.setState(
      {
        page: page,
      },
      //update the table data
      this.getData
    );
    //save page to context
  };

  //back-end // get table data
  getData = () => {
    areaRecords({
      page: this.state.page, // send page number
      order: this.state.orderQuery, // send order value
      search: this.state.searchQuery, // send search value
    })
      .then((res) => {
        //update state and save the data
        this.setState({
          pages: Math.ceil(parseInt(res.meta.total) / 30),
          total: parseInt(res.meta.total),
          items: res.items,
          loading: false,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  };
  componentDidMount() {
    //if user reopen the component will try to get the save data from context
    this.getData();
  }
  //on user click update
  toggleUpdate = (id) => {
    this.setState({
      selectedId: id,
      showUpdate: true,
      showCreate: false,
    });
  };

  toggleCreateModal = () => {
    this.setState({
      showUpdate: false,
      showCreate: true,
    });
  };
  handleModal = () => {
    this.setState({
      showCreate: false,
      showUpdate: false,
    });
  };

  // create order icon next to the selected col
  renderOrder = (type, spacing) => {
    if (type !== this.state.orderQuery.type) {
      return (
        <svg
          alt="order"
          onClick={() => this.addOrder(type)}
          className={`absolute ${spacing} w-3 orderLocation mr-2 cursor-pointer  order`}
          viewBox="0 0 1792 1792"
        >
          <path
            fill="#a0aec0"
            d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"
          />
        </svg>
      );
    } else {
      switch (this.state.orderQuery.order) {
        case "desc":
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className={`absolute ${spacing} w-3 orderLocation mr-2 cursor-pointer  order`}
              viewBox="0 0 1792 1792"
            >
              <path d="M1408 704q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" />
            </svg>
          );
          break;
        case "asc":
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className={`absolute ${spacing} w-3 orderLocation mr-2 cursor-pointer  order`}
              viewBox="0 0 1792 1792"
            >
              <path d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
            </svg>
          );
          break;
        default:
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className={`absolute ${spacing} w-3 orderLocation mr-2 cursor-pointer  order`}
              viewBox="0 0 1792 1792"
            >
              <path
                fill="#a0aec0"
                d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"
              />
            </svg>
          );
          break;
      }
    }
  };
  // create  pagination UI
  renderPages = () => {
    let elements = [];
    let from = this.state.page - 3 > 1 ? this.state.page - 3 : 1;
    let to =
      this.state.page + 3 < this.state.pages
        ? this.state.page + 3
        : this.state.pages;

    if (this.state.page > 3) {
      elements.push(
        <span
          key={0}
          className="-mt-px pb-3 border-t-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500"
        >
          ...
        </span>
      );
    }

    for (let index = from; index <= to; index++) {
      if (index === this.state.page) {
        elements.push(
          <a
            key={index}
            className="-mt-px border-b-2 pb-3 border-blue-500 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700 transition ease-in-out duration-150"
          >
            {index}
          </a>
        );
      } else {
        elements.push(
          <a
            key={index}
            onClick={() => this.changepage(index)}
            className="cursor-pointer pb-3 -mt-px border-b-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150"
          >
            {index}
          </a>
        );
      }
    }

    if (this.state.page - 3 < this.state.pages && this.state.pages > 3) {
      elements.push(
        <span
          key={this.state.pages + 1}
          className="-mt-px pb-3 border-t-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-500"
        >
          ...
        </span>
      );
    }

    return elements;
  };
  // render  component
  render() {
    return (
      <Fragment>
        <CSSTransition
          in={this.state.show}
          timeout={500}
          classNames="fade"
          unmountOnExit
          appear
        >
          <Fragment>
            <div
              id="main-modal"
              className="map-db absolute z-20 bg-white right-0 p-8"
            >
              <div className=" flex justify-between items-center flex-wrap sm:flex-no-wrap">
                <div className="">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Manage Areas{" "}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500"></p>
                </div>
              </div>
              <div className="mt-1 mb-1 flex justify-between">
                <div className=" w-1/4 pt-1">
                  <h2 className="text-sm">Search</h2>
                  <div className="py-2">
                    <ReactTagInput
                      placeholder="Enter search keyword..."
                      tags={this.state.searchQuery}
                      onChange={(tag) => this.search(tag)}
                    />
                  </div>
                </div>
                <div>
                  <img
                    src="/static/icons/cancel.svg"
                    style={{
                      width: "28px",
                      cursor: "pointer",
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                    }}
                    onClick={this.props.close}
                  />
                  <button
                    onClick={this.toggleCreateModal}
                    className=" px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                  >
                    Create Area{" "}
                  </button>
                </div>
              </div>
              <ScrollArea
                style={{
                  overflow: "hidden",
                  height: "calc(100% - 200px )",
                }}
              >
                <div className="border-t mt-5 border-gray-200 flex flex-col">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className=" py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              #
                            </th>
                            <th className="relative  border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {this.renderOrder("longitude", "right-9")}
                              Longitude
                            </th>
                            <th className="relative  py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {this.renderOrder("latitude", "right-9")}
                              Latitude
                            </th>
                            <th className="relative py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {this.renderOrder("radius", "right-0")}
                              Radius
                            </th>
                            <th className="relative pr-8  py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {this.state.items.map((item, index) => (
                            <tr
                              className="hover:bg-gray-100 "
                              flag={item.flag}
                              key={item.id}
                            >
                              <td className=" py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900 text-center">
                                {item.id}
                              </td>
                              <td className="  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900 text-center">
                                {item.longitude}
                              </td>
                              <td className="  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900 text-center">
                                {item.latitude}
                              </td>
                              <td className=" flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900 text-center">
                                {item.radius}
                              </td>

                              <td className="px-5 py-2 whitespace-no-wrap text-right border-b border-gray-200 text-xs leading-5 font-medium ">
                                {this.context.state.delete ? (
                                  <button
                                    onClick={() => {
                                      this.toggleDelete(item.id);
                                    }}
                                    className="cursor-pointer text-blue-600  hover:text-blue-900"
                                  >
                                    Delete
                                  </button>
                                ) : null}
                                <span className="px-2">|</span>
                                {this.context.state.update ? (
                                  <button
                                    onClick={() => {
                                      this.toggleUpdate(item.id);
                                    }}
                                    className="cursor-pointer text-blue-600  hover:text-blue-900"
                                  >
                                    Edit
                                  </button>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <nav className="mt-5 bottom-0 px-4 flex items-center justify-between sm:px-0">
                <div className="hidden md:flex">{this.renderPages()} </div>

                <div className="w-0 flex-1 flex justify-end">
                  <div className="hidden sm:block">
                    <p className="text-sm  leading-5 text-gray-700">
                      show
                      <span className="font-medium ml-1 mr-1">
                        {(this.state.page - 1) * 30 + 1}
                      </span>
                      to
                      <span className="font-medium ml-1 mr-1">
                        {(this.state.page - 1) * 30 + 30 > this.state.total
                          ? this.state.total
                          : (this.state.page - 1) * 30 + 30}
                      </span>
                      from
                      <span className="font-medium ml-1 mr-1">
                        {this.state.total}
                      </span>
                      total
                    </p>
                  </div>
                </div>
              </nav>
            </div>
          </Fragment>
        </CSSTransition>
        {this.state.showCreate || this.state.showUpdate ? (
          <AreaModel
            title={this.state.showUpdate ? "Update Area" : "Add Area"}
            refresh={this.getData}
            id={this.state.selectedId}
            update={this.state.showUpdate}
            close={this.handleModal}
          />
        ) : null}
        {this.state.showDelete ? (
          <DeleteModal
            title="Delete Area"
            hide={this.toggleDelete}
            action={this.delete}
          >
            Are you sure you want to do this{" "}
          </DeleteModal>
        ) : null}
      </Fragment>
    );
  }
}
ManageAreas.contextType = AppContext;
export default ManageAreas;
