import React, { Component } from "react";
import { listGroups } from "../../services/groups";
import {
  createDevice,
  updateDevice,
  deviceRecord,
} from "../../services/devices";

import {} from "../../services/groups";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";

const deviceStatus = [
  { name: "active", status: "active" },
  { name: "inactive", status: "inactive" },
];
class DeviceModal extends Component {
  state = {
    item: {
      geo: {
        type: "FeatureCollection",
        features: [],
      },
    },
    errors: {},
    groups: [],
    areas: [],
  };
  componentDidMount() {
    listGroups()
      .then((res) => {
        this.setState({
          groups: res.items,
        });
      })
      .catch((error) => this.context.state.handelError(error));
    if (this.props.update === true) {
      deviceRecord(this.props.id)
        .then((res) => {
          this.setState({ item: res.items });
        })
        .catch((error) => {
          this.context.state.handelError(errors);
        });
    }
  }

  update = () => {
    //back-end // update transit //
    updateDevice(this.props.id, this.state.item)
      .then((res) => {
        this.props.refresh();
        this.props.close();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 422:
            let temp = {};
            for (
              let index = 0;
              index < error.response.data.errors.length;
              index++
            ) {
              const element = error.response.data.errors[index];
              console.log(element);
              temp[element[0]] = element[1][0];
            }
            this.setState({ errors: temp });
            break;
          default:
            this.context.state.handelError(errors);
            break;
        }
      });
  };

  create = () => {
    //back-end // update transit //
    createDevice(this.state.item)
      .then((res) => {
        this.props.refresh();
        this.props.close();
      })
      .catch((error) => {
        switch (error.response.status) {
          case 422:
            let temp = {};
            for (
              let index = 0;
              index < error.response.data.errors.length;
              index++
            ) {
              const element = error.response.data.errors[index];
              temp[element[0]] = element[1][0];
            }
            this.setState({ errors: temp });
            break;
          default:
            this.context.state.handelError(errors);
            break;
        }
      });
  };

  handelchange = (e) => {
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  handleChangeSelect = (key, e) => {
    let temp = this.state.item;
    temp[key] = e.target.value;
    // areaZoneList(e.target.value)
    //   .then((res) => {
    //     this.setState({ areas: res.items });
    //   })
    //   .catch((error) => {
    //     this.context.state.handelError(error);
    //   });
    let error = this.state.errors;
    error[key] = null;
    console.log(temp);
    this.setState({ item: temp, errors: error });
  };

  save = () => {
    console.log(this.props.update);
    if (this.props.update === true) {
      this.update();
    } else {
      this.create();
    }
  };

  render() {
    return (
      <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
        <div className="bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Name{" "}
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
                    />
                  </div>
                  {this.state.errors.name ? (
                    <Error message={this.state.errors.name} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="zone_id"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Group
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.group_id}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="group_id"
                      name="group_id"
                    >
                      <option value="0">Select group</option>
                      {this.state.groups.map((item, index) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.group_id ? (
                    <Error message={this.state.errors.group_id} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="zone_id"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Status
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.status}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="status"
                      name="status"
                    >
                      <option value="0">Choose Status</option>
                      {deviceStatus.map((item, index) => {
                        return (
                          <option key={index} value={item.status}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.group_id ? (
                    <Error message={this.state.errors.group_id} />
                  ) : null}
                </div>
              </div>
              {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Code
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="code"
                      name="code"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.code}
                    />
                  </div>
                  {this.state.errors.code ? (
                    <Error message={this.state.errors.code} />
                  ) : null}
                </div>
              </div> */}

              {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="hardware"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Hardware
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="hardware"
                      name="hardware"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.hardware}
                    />
                  </div>
                  {this.state.errors.hardware ? (
                    <Error message={this.state.errors.hardware} />
                  ) : null}
                </div>
              </div> */}

              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.description}
                    ></textarea>
                  </div>

                  {this.state.errors.description ? (
                    <Error message={this.state.errors.description} />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-5  flex flex-row-reverse">
              <button
                type="button"
                onClick={this.save}
                className=" inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
              >
                {this.props.update ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={this.props.close}
                className=" inline-flex items-center  px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 mr-5 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
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
DeviceModal.contextType = AppContext;
export default DeviceModal;
