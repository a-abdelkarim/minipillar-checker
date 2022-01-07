import React, { Component } from "react";

import { userCreate, userUpdate, userRecord } from "../../services/users";

import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";
import Select from "react-select";

class UserModel extends Component {
  state = {
    item: { user_zones: [] },
    errors: {},
    permissions: [
      { title: "yes", value: true },
      { title: "no", value: false },
    ],
    userTypes: [
      { title: "administrator", value: "administrator" },
      { title: "editor", value: "editor" },
    ],
    zones: [],
  };
  componentDidMount() {
    if (this.props.update === true) {
      userRecord(this.props.id)
        .then((res) => {
          this.setState({ item: res.items });
        })
        .catch((error) => {
          this.context.state.handelError(error);
        });
    }
  }

  // handleMultiSelect = (selected) => {
  //   console.log(selected);
  //   let temp = this.state.item;
  //   if (selected !== null) {
  //     temp["user_zones"] = selected.map((item) => {
  //       return {
  //         zone: { name: item.label },
  //         zone_id: item.value,
  //       };
  //     });
  //     this.setState({
  //       item: temp,
  //     });
  //   } else {
  //     delete temp["user_zones"];
  //     this.setState({
  //       item: temp,
  //     });
  //   }
  // };

  update = () => {
    //back-end // update transit //
    userUpdate(this.props.id, this.state.item)
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

  create = () => {
    //back-end // update transit //
    userCreate(this.state.item)
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
    if (e.target.value === "true" || e.target.value === "false") {
      temp[e.target.name] = JSON.parse(e.target.value);
    } else {
      temp[e.target.name] = e.target.value;
    }

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  save = () => {
    if (this.props.update === true) {
      this.update();
    } else {
      this.create();
    }
  };

  render() {
    return (
      <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
        <div className=" bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  first name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="first_name"
                      name="first_name"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.first_name}
                    />
                  </div>
                  {this.state.errors.first_name ? (
                    <Error message={this.state.errors.first_name} />
                  ) : null}
                </div>
              </div>
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  last name
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="last_name"
                      name="last_name"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.last_name}
                    />
                  </div>
                  {this.state.errors.last_name ? (
                    <Error message={this.state.errors.last_name} />
                  ) : null}
                </div>
              </div>
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Email
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="email"
                      name="email"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.email}
                    />
                  </div>
                  {this.state.errors.email ? (
                    <Error message={this.state.errors.email} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  type
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.type}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="type"
                      name="type"
                    >
                      <option value="0">Choose type</option>
                      {this.state.userTypes.map((item, index) => {
                        return (
                          <option key={index} value={item.value}>
                            {item.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.type ? (
                    <Error message={this.state.errors.type} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  update
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.update}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="update"
                      name="update"
                    >
                      <option value="0">Choose type</option>
                      {this.state.permissions.map((item, index) => {
                        return (
                          <option key={index} value={item.value}>
                            {item.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.update ? (
                    <Error message={this.state.errors.update} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  delete
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.delete}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="delete"
                      name="delete"
                    >
                      <option value="0">Choose type</option>
                      {this.state.permissions.map((item, index) => {
                        return (
                          <option key={index} value={item.value}>
                            {item.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.delete ? (
                    <Error message={this.state.errors.delete} />
                  ) : null}
                </div>
              </div>
              {/* <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  المناطق
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <Select
                      defaultValue={this.state.item.user_zones.map((item) => {
                        return {
                          label: item.zone.name,
                          value: item.zone_id,
                        };
                      })}
                      isMulti
                      name="user_zones"
                      options={this.state.zones}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="اختر الجهة"
                      onChange={this.handleMultiSelect}
                      value={this.state.item.user_zones.map((item) => {
                        return {
                          label: item.zone.name,
                          value: item.zone_id,
                        };
                      })}
                    />
                  </div>
                  {this.state.errors.zones ? (
                    <Error message={this.state.errors.zones} />
                  ) : null}
                </div>
              </div> */}
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Password{" "}
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      name="username"
                      className="hidden"
                    ></input>
                    <input
                      autocomplete="off"
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="off"
                      aria-autocomplete="none"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.password}
                    />
                  </div>
                  <p
                    className="mt-2 text-sm text-gray-500"
                    id="email-description"
                  >
                    احتفظ بكلمة المرور فارغة لاستخدام كلمة المرور القديمة.
                  </p>
                  {this.state.errors.password ? (
                    <Error message={this.state.errors.password} />
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
                {this.props.update ? "تحديث " : "إضافة"}
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
    );
  }
}
UserModel.contextType = AppContext;
export default UserModel;
