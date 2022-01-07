import React, { Component } from "react";
import Error from "../Error";
import AppContext from "../../../contexts/AppContext";
import { eventTypeList } from "../../../services/eventTypes";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON";

import Select from "react-select";
import { eventSearch } from "../../../services/events";
import { Circle } from "ol/geom";
import Feature from "ol/feature";
import * as turf from "@turf/turf";
import DatePicker from "react-datepicker";
class EventLocation extends Component {
  state = {
    item: { event_types: [], raduis: "1", start_date: "", end_date: "" },
    errors: {},
    eventTypes: [],
    pickCoordinate: false,
  };
  setStartDate = (start_date) => {
    let temp = this.state.item;
    let error = this.state.errors;
    error["start_date"] = null;
    temp.start_date = start_date;
    this.setState({ item: temp, errors: error });
  };
  setEndDate = (end_date) => {
    let temp = this.state.item;
    let error = this.state.errors;
    error["end_date"] = null;
    temp.end_date = end_date;
    this.setState({ item: temp, errors: error });
  };
  componentDidMount() {
    eventTypeList()
      .then((res) => {
        let event_types = res.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        event_types.unshift({ label: "تحديد الكل", value: 0 });
        this.setState({
          event_types,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  }

  handelchange = (e) => {
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  handleEventType = (selected, name) => {
    let temp = this.state.item;
    let error = this.state.errors;
    error[name] = null;
    console.log(selected);

    if (selected !== null) {
      if (
        selected.filter((item) => {
          return item.value === 0;
        }).length >= 1
      ) {
        console.log("done");
        temp.event_types = [
          ...this.state.event_types
            .filter((item) => item.value === 0)
            .map((item) => {
              return {
                event_type: { name: item.label },
                event_type_id: item.value,
              };
            }),
        ];

        let valuesToView = this.state.event_types.filter(
          (item) => item.value !== 0
        );

        console.log(valuesToView);
        this.setState({
          item: temp,
          errors: error,
          valuesToView,
          allOptions: true,
        });
        return false;
      }
      temp["event_types"] = selected.map((item) => {
        return {
          event_type: { name: item.label },
          event_type_id: item.value,
        };
      });
      this.setState({
        item: temp,
        errors: error,
      });
    } else {
      temp["event_types"] = [];
      this.setState({
        item: temp,
        errors: error,
        valuesToView: [],
        allOptions: false,
      });
    }
    if (selected.length == 0) {
      this.setState({
        valuesToView: [],
        allOptions: false,
      });
    }
  };
  reformatDate = (date) => {
    if (date) {
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    }
  };
  save = () => {
    let checks = {
      longitude: ["required", "dmsLongitude"],
      latitude: ["required", "dmsLatitude"],
      start_date: ["required", "start date"],
      end_date: ["required", "end date"],
      event_types: ["required"],
      raduis: ["raduis", "decimalRadius"],
    };

    let errors = this.context.state.validation(this.state.item, checks);
    let error = false;

    this.setState({
      errors: {
        ...errors,
      },
    });
    Object.keys(checks).forEach((key) => {
      console.log(this.context.state.getProperty(errors, key));
      console.log(key);
      if (this.context.state.getProperty(errors, key) !== undefined) {
        error = true;
      }
    });

    if (error === false) {
      let item = JSON.parse(JSON.stringify(this.state.item));
      (item.latitude = this.context.state.DMStoDecimal(item.latitude)),
        (item.longitude = this.context.state.DMStoDecimal(item.longitude)),
        eventSearch({
          ...item,
          start_date: this.reformatDate(this.state.item.start_date),
          date_analyze: 0,
          end_date: this.reformatDate(this.state.item.end_date),
        })
          .then((res) => {
            console.log(res);
            this.context.state.saveSearchData(
              "event_location",
              res.meta.date_analyze,
              {
                ...item,
                start_date: this.reformatDate(this.state.item.start_date),
                end_date: this.reformatDate(this.state.item.end_date),
              }
            );
            this.context.state.dataSources.eventDataSource.clear(0);
            this.context.state.dataSources.drawDataSource.clear(0);
            var geojsonFormat = new GeoJSON();

            var circle = turf.circle(
              [item.longitude, item.latitude],
              item.raduis,
              { steps: 256, units: "kilometers" }
            );

            circle = new GeoJSON().readFeature(circle);
            this.context.state.viewer
              .getView()
              .fit(circle.getGeometry().getExtent(), {
                constrainResolution: false,
              });
            this.context.state.dataSources.drawDataSource.addFeatures([circle]);

            res.items.forEach((item) => {
              // reads and converts GeoJSon to Feature Object
              var features = geojsonFormat.readFeatures(item.geo);

              var iconStyle = new Style({
                image: new Icon({
                  anchor: [0.5, 46],
                  anchorXUnits: "fraction",
                  anchorYUnits: "pixels",
                  src: `/static/icons/${item.event_type.icon.file}`,
                }),
              });
              for (let index = 0; index < features.length; index++) {
                features[index].itemId = item.id;
                features[index].type = "event";
                features[index].name = item.title;
                features[index].data = item;
                features[index].setStyle(iconStyle);
              }
              console.log(features);
              this.context.state.dataSources.eventDataSource.addFeatures(
                features
              );
            });
            this.props.close(res.items);
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
    }
  };

  pickCoordinateCallback = (lat, lon) => {
    if ((lat == null, lon == null)) {
      this.setState({ pickCoordinate: true });
    } else {
      let temp = this.state.item;

      temp.latitude = lat;

      temp.longitude = lon;

      let error = this.state.errors;
      error["latitude"] = null;
      error["longitude"] = null;

      this.setState({ item: temp, pickCoordinate: false, errors: error });
    }
  };
  render() {
    return (
      <div
        className={` ${
          this.state.pickCoordinate === true ? "hidden" : ""
        }  model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4`}
      >
        <div
          className={` ${
            this.state.pickCoordinate === true ? "hidden" : ""
          } arabic bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg`}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              البحث عن الأحداث
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="latitude"
                  className=" block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  شماليات
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md  sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="latitude"
                      name="latitude"
                      onChange={this.handelchange}
                      className="custom-input-size ltr form-input border px-2 py-2 inline-block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.latitude}
                    />
                    <img
                      onClick={() => {
                        this.pickCoordinateCallback(null, null);
                        this.context.state.setPickCoordinateCallback(
                          this.pickCoordinateCallback
                        );
                      }}
                      src="/static/icons/world.svg"
                      alt=""
                      className="selectLocation inline-block cursor-pointer mr-2"
                    />
                    <div className="flex justify-between">
                      {this.state.errors.latitude ? (
                        <Error message={this.state.errors.latitude} />
                      ) : null}
                      <p class=" ltr mt-2 text-sm text-gray-500">
                        17 22 65.16 E مثال
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  شرقيات
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md  sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="longitude"
                      name="longitude"
                      onChange={this.handelchange}
                      className=" ltr form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.longitude}
                    />
                    <div className="flex justify-between">
                      {this.state.errors.longitude ? (
                        <Error message={this.state.errors.longitude} />
                      ) : null}
                      <p class=" ltr mt-2 text-sm text-gray-500">
                        17 22 65.16 E مثال
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="start date"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  من
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md  sm:max-w-xs">
                    <DatePicker
                      selected={this.state.item.start_date}
                      onChange={(start_date) => this.setStartDate(start_date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />
                    {this.state.errors.start_date ? (
                      <Error message={this.state.errors.start_date} />
                    ) : null}{" "}
                  </div>{" "}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="end date"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  الى
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md  sm:max-w-xs">
                    <DatePicker
                      selected={this.state.item.end_date}
                      onChange={(end_date) => this.setEndDate(end_date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />
                    {this.state.errors.end_date ? (
                      <Error message={this.state.errors.end_date} />
                    ) : null}{" "}
                  </div>{" "}
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="raduis"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  نصف القطر- كم
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md  sm:max-w-xs">
                    <input
                      autocomplete="off"
                      type="text"
                      id="raduis"
                      name="raduis"
                      defaultValue="1"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.raduis}
                    />
                  </div>

                  {this.state.errors.raduis ? (
                    <Error message={this.state.errors.raduis} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="event_types"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  الحدث
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <Select
                      defaultValue={this.state.item.event_types}
                      isMulti
                      name="event_types"
                      options={this.state.event_types}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="اختر الحدث"
                      onChange={(selected) =>
                        this.handleEventType(selected, "event_types")
                      }
                      value={
                        this.state.allOptions
                          ? this.state.valuesToView
                          : this.state.item.event_types.map((item) => {
                              return {
                                label: item.event_type.name,
                                value: item.event_type_id,
                              };
                            })
                      }
                    />
                  </div>
                  {this.state.errors.event_types ? (
                    <Error message={this.state.errors.event_types} />
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
                بحث
              </button>
              <button
                type="button"
                onClick={() => {
                  this.props.close();
                }}
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

EventLocation.contextType = AppContext;
export default EventLocation;
