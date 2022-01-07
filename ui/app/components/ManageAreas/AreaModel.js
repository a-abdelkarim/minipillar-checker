import React, { Component } from "react";
// import { zoneList } from "../../services/zones";

import { areaRecord, areaCreate, areaUpdate } from "../../services/areas";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";

class AreaModel extends Component {
  state = {
    item: {},
    errors: {},
    zones: [],
  };
  componentDidMount() {
    if (this.props.update === true) {
      areaRecord(this.props.id)
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
    areaUpdate(this.props.id, this.state.item)
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
    areaCreate(this.state.item)
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

  save = () => {
    console.log(this.props.update);
    if (this.props.update === true) {
      this.update();
    } else {
      this.create();
    }
  };
  pickCoordinate = () => {
    document.getElementById("area-modal").style.display = "none";
    document.getElementById("main-modal").style.display = "none";
    this.context.state.setPickCoordinateCallback((lat, lon) => {
      document.getElementById("main-modal").style.display = "block";
      document.getElementById("area-modal").style.display = "flex";
      let temp = this.state.item;
      temp["longitude"] = lon;
      temp["latitude"] = lat;
      this.setState({
        item: temp,
      });
    });
  };

  render() {
    return (
      <div
        id="area-modal"
        className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4"
      >
        <div className="bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700 relative">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Longitude
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2 ">
                  <div className=" justify-between max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="longitude"
                      name="longitude"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.longitude}
                    />
                  </div>

                  <img
                    src="/static/icons/pick.svg"
                    style={{
                      width: "28px",
                      cursor: "pointer",
                      position: "absolute",
                      right: "-1rem",
                      top: "1.5rem",
                    }}
                    onClick={this.pickCoordinate}
                  />

                  {this.state.errors.longitude ? (
                    <Error message={this.state.errors.longitude} />
                  ) : null}
                </div>
              </div>{" "}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Latitude
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="latitude"
                      name="latitude"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.latitude}
                    />
                  </div>
                  {this.state.errors.latitude ? (
                    <Error message={this.state.errors.latitude} />
                  ) : null}
                </div>
              </div>{" "}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="radius"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Radius
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="radius"
                      name="radius"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.radius}
                    />
                  </div>
                  {this.state.errors.radius ? (
                    <Error message={this.state.errors.radius} />
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
AreaModel.contextType = AppContext;
export default AreaModel;
