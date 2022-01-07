import React, { Component, useState } from "react";
import Transition from "./Transition";
import ScrollArea from "react-scrollbar";
import { Link } from "react-router-dom";
import UserSettingModel from "../Utilities/Modals/UserSettingModel";

class Header extends Component {
  state = {
    userMenu: false,
    user: JSON.parse(localStorage.getItem("user")),
    notificationMenu: false,
    showUserSetting: false,
  };

  toggleUserSetting = (id) => {
    this.setState({
      showUserSetting: !this.state.showUserSetting,
    });
  };

  componentDidMount() {
    this.clickOutsideUserMenuEvent = document.addEventListener(
      "mouseup",
      this.handleClickOutsideUserMenu
    );
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.clickOutsideUserMenuEvent);
  }

  userMenuRef = React.createRef();
  handleClickOutsideUserMenu = (e) => {
    if (
      this.userMenuRef.current != null &&
      !this.userMenuRef.current.contains(e.target)
    ) {
      this.setState({ userMenu: false });
    }
  };
  handleClickInsideUserMenu = () =>
    this.setState({ userMenu: !this.state.userMenu });

  handleLogout = () => {
    localStorage.clear();
    window.location = "/login";
  };

  render() {
    return (
      <div className="border-b flex flex-col  ">
        {this.state.showUserSetting ? (
          <UserSettingModel hide={this.toggleUserSetting}></UserSettingModel>
        ) : null}

        <div
          className={`relative ${
            this.state.userMenu === true ? "z-10 " : null
          } flex-shrink-0 flex h-16 bg-white`}
        >
          <button
            onClick={this.props.toggleSide}
            className="px-4 bg-gray-500 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-400 focus:text-gray-400  "
            aria-label="Open sidebar"
          >
            <svg
              enableBackground="new 0 0 32 32"
              className="h-6 w-6"
              fill="#fff"
              version="1.1"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z"
                id="XMLID_294_"
              />
              <path
                d="M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z"
                id="XMLID_295_"
              />
              <path
                d="M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z"
                id="XMLID_297_"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* <img className="h-8 mt-4 w-auto" src="/static/images/logo.png" /> */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className=" px-2 relative     ">
                <button
                  ref={this.userMenuRef}
                  type="button"
                  onClick={this.handleClickInsideUserMenu}
                  className="inline-flex justify-center w-full   pt-2 bg-white text-sm   font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {this.state.user.first_name + " " + this.state.user.last_name}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <p className=" max-w-2xl  text-xxs  text-gray-500">Admin </p>
                <Transition
                  show={this.state.userMenu}
                  enter="transition ease-out duration-100 transform"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75 transform"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="arabic origin-top-right absolute right-0 mt-5 mr-2 w-56 rounded-md shadow-lg">
                    <div className="rounded-md bg-white shadow-xs">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <a
                          onClick={this.toggleUserSetting}
                          className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          User Settings{" "}
                        </a>
                        <a
                          className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          Support{" "}
                        </a>
                        <a
                          className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          onClick={this.handleLogout}
                        >
                          Logout{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline"
                    id="user-menu"
                    aria-label="User menu"
                    aria-haspopup="true"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src="/static/images/avatar.png"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
