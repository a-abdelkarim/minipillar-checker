import React, { Component, useState } from "react";
import Transition from "../Layout/Transition";
import ScrollArea from "react-scrollbar";
import { Link } from "react-router-dom";
class UserBar extends Component {
  state = {
    userMenu: false,
    user: JSON.parse(localStorage.getItem("user")),

    notificationMenu: false,
  };

  componentDidMount() {
    this.clickOutsideUserMenuEvent = document.addEventListener(
      "mouseup",
      this.handleClickOutsideUserMenu
    );
  }

  componentDidUpdate() {
    if (
      JSON.parse(localStorage.getItem("user")).first_name !==
      this.state.user.first_name
    ) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user")),
      });
    }
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
      <div
        className={` absolute mt-4 z-10 right-0 top-0 mr-8  ${
          this.state.userMenu === true ? "z-10 " : null
        }  `}
      >
        <div className="flex-1 px-4 flex justify-between">
          <div className="mr-4 flex items-center md:mr-6">
            <div className="px-2 relative">
              <button
                ref={this.userMenuRef}
                type="button"
                onClick={this.handleClickInsideUserMenu}
                className="inline-flex justify-center w-full  text-white pt-2 text-sm   font-medium  hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
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
              <p className=" max-w-2xl  text-xxs  text-gray-500">
                {this.state.user.type}
              </p>
              <Transition
                show={this.state.userMenu}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="absolute origin-top-left   left-0 mt-5 mr-8 w-40 rounded-md shadow-lg">
                  <div className="rounded-md bg-white shadow-xs">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        onClick={this.props.toggleUserSetting}
                        className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        role="menuitem"
                      >
                        Account Settings{" "}
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        role="menuitem"
                      >
                        Support
                      </a>
                      {this.state.user.type === "administrator" ? (
                        <a
                          href="/admin/groups"
                          className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                          role="menuitem"
                        >
                          Dashboard{" "}
                        </a>
                      ) : null}
                      <a
                        className="block px-4 py-2 cursor-pointer text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                        role="menuitem"
                        onClick={this.handleLogout}
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            <div className="mr-3 relative">
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
    );
  }
}

export default UserBar;
