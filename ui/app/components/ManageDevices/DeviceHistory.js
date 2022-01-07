import React, { Component } from "react";
import { listGroups } from "../../services/groups";
import { deviceHistory } from "../../services/devices";
import DatePicker from "react-datepicker";
import {} from "../../services/groups";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";
import { LineString } from "ol/geom";
import { Stroke, Style } from "ol/style.js";
import Feature from "ol/Feature";
import * as turf from "@turf/turf";
import { point, distance } from "@turf/turf";

const deviceStatus = [
  { name: "active", status: "active" },
  { name: "inactive", status: "inactive" },
];
class DeviceHistory extends Component {
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
  componentDidMount() {}

  update = () => {
    //back-end // update transit //
  };

  create = () => {
    //back-end // update transit //
  };
  setStartDate = (date, name) => {
    let error = this.state.errors;
    error[name] = null;
    let temp = this.state.item;
    temp.start_date = date;
    this.setState({ item: temp, errors: error });
  };

  setEndDate = (date, name) => {
    let error = this.state.errors;
    error[name] = null;
    let temp = this.state.item;
    temp.end_date = date;
    this.setState({ item: temp, errors: error });
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
  reformatDate = (date) => {
    if (date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        " " +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes() +
        ":" +
        (date.getSeconds() < 10 ? "0" : "") +
        date.getSeconds()
      );
    }
  };
  save = () => {
    deviceHistory({
      start_date: this.reformatDate(this.state.item.start_date),
      end_date: this.reformatDate(this.state.item.end_date),
      device_id: this.props.id,
    })
      .then((res) => {
        if (res.items.length > 0) {
          let coordinates = res.items;
          let firstPoint = coordinates[0];
          let trips = [
            [
              [
                { created_at: firstPoint?.created_at },
                firstPoint?.longitude,
                firstPoint?.latitude,
              ],
            ],
          ];

          let split = 0;
          for (let i = 0; i < coordinates.length; i++) {
            let firstPointTime = new Date(coordinates[i]?.created_at);
            let nextPointTime = new Date(coordinates[i + 1]?.created_at);
            let differenceBetweenTwoConsecutivePoints =
              (nextPointTime - firstPointTime) / 1000 / 60;

            if (differenceBetweenTwoConsecutivePoints <= 5) {
              trips[split]?.push([
                { created_at: coordinates[i + 1].created_at },
                coordinates[i + 1].longitude,
                coordinates[i + 1].latitude,
              ]);
            } else if (differenceBetweenTwoConsecutivePoints > 5) {
              trips.push([
                [
                  { created_at: coordinates[i + 1].created_at },
                  coordinates[i + 1]?.longitude,
                  coordinates[i + 1]?.latitude,
                ],
              ]);
              split++;
            }
          }
          // console.log(trips[0][trips[0].length - 1]);
          let speeds = [];
          let removeCreationTime = (trip) => {
            for (let i = 0; i < trip.length; i++) {
              trip[i].shift();
            }
          };
          for (let i = 0; i < trips.length; i++) {
            let firstPointTime = trips[i][0][0].created_at;
            let lastPointTime = trips[i][trips[i].length - 1][0].created_at;

            let tripTime =
              (new Date(lastPointTime) - new Date(firstPointTime)) / 1000 / 60;

            let from = point([trips[i][0][1], trips[i][0][2]]);
            let to = point([
              trips[i][trips[i].length - 1][1],
              trips[i][trips[i].length - 1][2],
            ]);
            let distance = turf.distance(from, to);

            let speed = distance / tripTime; //km/min
            speeds.push(speed);
            removeCreationTime(trips[i]);
          }

          for (let i = 0; i < trips.length; i++) {
            var line = new Feature({
              geometry: new LineString(trips[i]),
            });
            var lineStyle = new Style({
              stroke: new Stroke({
                width: 2,
                color: speeds[i] > 0.02 ? "red" : "green",
              }),
            });
            line.setStyle(lineStyle);
            this.context.state.dataSources.vectorSource.addFeature(line);
          }

          this.props.close();
          this.props.closeParent();
        } else {
          console.log(this.context.state.alert("Oops! No data to display"));
        }
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
            this.context.state.handelError(errors);
            break;
        }
      });
  };

  render() {
    return (
      <div
        id="device-history"
        className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4"
      >
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
                  Start Date
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <DatePicker
                      selected={this.state.item.start_date}
                      onChange={(date) => this.setStartDate(date, "start_date")}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                      showTimeSelect
                    />
                  </div>
                  {this.state.errors.start_date ? (
                    <Error message={this.state.errors.start_date} />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="zone_id"
                className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
              >
                End Date
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                  <DatePicker
                    selected={this.state.item.end_date}
                    onChange={(date) => this.setEndDate(date, "end_date")}
                    placeholderText="YYYY-MM-DD"
                    dateFormat="yyyy-MM-dd"
                    popperClassName="rdp-fix"
                    showTimeSelect
                  />
                </div>
                {this.state.errors.end_date ? (
                  <Error message={this.state.errors.end_date} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="mb-5 mr-5  flex flex-row-reverse">
            <button
              type="button"
              onClick={this.save}
              className=" inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
            >
              submit
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
    );
  }
}
DeviceHistory.contextType = AppContext;
export default DeviceHistory;
