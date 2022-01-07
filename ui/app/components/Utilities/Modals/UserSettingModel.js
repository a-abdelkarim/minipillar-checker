import React, { Component, Fragment } from "react";

import AppContext from "../../../contexts/AppContext";
import ScrollArea from "react-scrollbar";
import { ChangePassword, UpdateUserInfo } from "../../../services/user";
import { userRecord } from "../../../services/users";
import Error from "../Error";

class UserSettingModel extends Component {
  state = {
    item: {},
    passwordItem: {},
    errors: {},
    userData: {},
  };

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("user"));
    let userId = userData.id;
    let temp = this.state.item;
    temp["first_name"] = userData.first_name;
    temp["last_name"] = userData.last_name;
    temp["email"] = userData.email;
    temp["mobile"] = userData.mobile;
    // Object.assign(temp, userData)
    console.log(temp);
    this.setState({
      item: temp,
      userId,
    });
  }

  handelchange = (e, name = "item") => {
    console.log(e);
    let temp = this.state[name];
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ [name]: temp, errors: error });
  };

  handleUserInfo = () => {
    UpdateUserInfo(this.state.item)
      .then((res) => {
        userRecord(this.state.userId)
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.items));
          })
          .catch((error) => {
            this.context.state.handelError(error);
          });
        this.context.state.showCodeMessage(res.meta.message, "success");
        // window.location = "/login";
      })
      .catch((error) => {
        console.log(error.response);
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
            this.context.state.handelError(error);
            break;
        }
      });
  };

  handleChangePassword = () => {
    let { new_password, confirm_password } = this.state.passwordItem;
    if (new_password !== confirm_password) {
      let temp = this.state.errors;
      temp["new_password"] = "Passwords don't match";
      temp["confirm_password"] = "Passwords don't match";
      this.setState({
        errors: temp,
      });
    } else {
      ChangePassword(this.state.passwordItem)
        .then((res) => {
          this.context.state.showCodeMessage(res.meta.message, "success");
          // window.location = "/login";
        })
        .catch((error) => {
          console.log(error);
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
              this.context.state.handelError(error);
              break;
          }
        });
    }
  };
  render() {
    return (
      <Fragment>
        <div className=" fixed h-full   right-0 bottom-0   pt-4 pr-4 z-30 w-full  bg-white  ">
          <button
            onClick={this.props.hide}
            type="button"
            className=" fixed p-2 z-30  mr-8  right-0 border border-gray-300 rounded-full text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
          >
            <svg
              id="Outlined"
              style={{ width: 24, height: 24 }}
              viewBox="0 0 32 32"
            >
              <title />
              <g id="Fill">
                <polygon points="28.71 4.71 27.29 3.29 16 14.59 4.71 3.29 3.29 4.71 14.59 16 3.29 27.29 4.71 28.71 16 17.41 27.29 28.71 28.71 27.29 17.41 16 28.71 4.71" />
              </g>
            </svg>
          </button>

          <ScrollArea
            style={{
              overflow: "hidden",
              height: "calc(100% - 20px )",
            }}
          >
            <div>
              <div className="max-w-screen-lg ml-auto mr-auto">
                <div className="mt-1 ">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Personal Information{" "}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
                      Always use an address where you can receive mail{" "}
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="first_name"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        First name{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="first_name"
                            name="first_name"
                            value={this.state.item.first_name}
                            onChange={this.handelchange}
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.first_name ? (
                            <Error message={this.state.errors.first_name} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="last_name"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Last name{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="last_name"
                            name="last_name"
                            value={this.state.item.last_name}
                            onChange={this.handelchange}
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.last_name ? (
                            <Error message={this.state.errors.last_name} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Email{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="email"
                            type="email"
                            name="email"
                            value={this.state.item.email}
                            onChange={this.handelchange}
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.email ? (
                            <Error message={this.state.errors.email} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="mobile"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Mobile{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="mobile"
                            name="mobile"
                            value={this.state.item.mobile}
                            onChange={this.handelchange}
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.mobile ? (
                            <Error message={this.state.errors.mobile} />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-screen-lg ml-auto mr-auto mt-8 border-t border-gray-200 pt-5">
                  <div className="flex justify-end">
                    <span className="ml-3 inline-flex rounded-md shadow-sm">
                      <button
                        onClick={this.handleUserInfo}
                        className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Update User Info{" "}
                      </button>
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 sm:mt-5 sm:pt-10">
                  <div>
                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                      Password{" "}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
                      Change Password{" "}
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-5">
                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="old_password"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Old Password{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="old_password"
                            name="old_password"
                            type="password"
                            onChange={(e) =>
                              this.handelchange(e, "passwordItem")
                            }
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.old_password ? (
                            <Error message={this.state.errors.old_password} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="new_password"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        New Password{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="new_password"
                            name="new_password"
                            type="password"
                            onChange={(e) =>
                              this.handelchange(e, "passwordItem")
                            }
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.new_password ? (
                            <Error message={this.state.errors.new_password} />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        for="confirm_password"
                        className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Confirm Password{" "}
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                          <input
                            autocomplete="off"
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            onChange={(e) =>
                              this.handelchange(e, "passwordItem")
                            }
                            className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                          {this.state.errors.confirm_password ? (
                            <Error
                              message={this.state.errors.confirm_password}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-screen-lg ml-auto mr-auto mt-8 border-t border-gray-200 pt-5">
                <div className="flex justify-end">
                  <span className="ml-3 inline-flex rounded-md shadow-sm">
                    <button
                      onClick={this.handleChangePassword}
                      className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      Change Password{" "}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </Fragment>
    );
  }
}
UserSettingModel.contextType = AppContext;
export default UserSettingModel;
