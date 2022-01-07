import React, { Component, Fragment } from "react";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";
import {
  eventCreateAtArea,
  eventRecord,
  eventUpdate,
} from "../../services/events";
import { eventTypeList } from "../../services/eventTypes";
import { areaZone } from "../../services/areas";
import { citiesAreaList } from "../../services/cities";
import { eventSourceTypeList } from "../../services/eventSourceTypes";
import Select from "react-select";
import DropzoneComponent from "react-dropzone-component";
import ScrollArea from "react-scrollbar";
import DatePicker from "react-datepicker";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";
export const severity = [
  { title: "شديدة", id: "severe" },
  { title: "عالى", id: "high" },
  { title: "متوسط", id: "medium" },
  { title: "طبيعى", id: "normal" },
  { title: "منخفض", id: "low" },
];
export const confidence = [
  { title: "اكيد", id: "certain" },
  { title: "محتمل", id: "probable" },
  { title: "غير مؤكد", id: "uncertain" },
];
export const severityText = {
  severe: "شديدة",
  high: "عالى",
  medium: "متوسط",
  normal: "طبيعى",
  low: "منخفض",
};
export const confidenceText = {
  certain: "اكيد",
  probable: "محتمل",
  uncertain: "غير مؤكد",
};

class EventsAreaModal extends Component {
  state = {
    item: {
      event_sources: [],
      date: "",
      geo: {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [] },
      },
    },
    errors: { geo: { geometry: { coordinates: [null, null] } } },
    eventTypes: [],
    eventSourceTypes: [],
    pickCoordinate: false,
    areas: [],
    cities: [],
  };
  componentConfig = {
    postUrl: this.context.state.setting.uploadURL + "api/upload/file",
  };
  djsReportConfig = {
    autoProcessQueue: true,
    params: {
      fileName: "",
    },
    //retryChunks: true,
    //retryChunksLimit: 3 ,
    //chunking: true,
    parallelUploads: this.context.state.setting.parallelUploads,
    maxFilesize: this.context.state.setting.maxFilesize,
    timeout: this.context.state.setting.timeout,
    headers: {
      Authorization: "token " + localStorage.getItem("token"),
      Accept: "application/json",
    },
    maxFiles: 1,
    maxfilesexceeded: function (file) {
      this.removeAllFiles();
      this.addFile(file);
    },
    error: (file, error) => {
      if (error.message) {
        this.context.state.showCodeMessage(error.message, "error");
      }
    },
    success: (file, response, data) => {
      if (file.status === "success") {
        this.state.item.report = response.items;
        this.setState({
          loading: false,
          item: this.state.item,
          errors: [],
        });
        this.context.state.showCodeMessage(
          "File uploaded successfully .",
          "success"
        );
      } else {
        this.context.state.showCodeMessage(
          "Error while uploading file .",
          "error"
        );
      }
    },
  };
  djsImageConfig = {
    autoProcessQueue: true,
    acceptedFiles: ".png , .jpg , .gif ",
    params: {
      fileName: "",
    },
    //retryChunks: true,
    //retryChunksLimit: 3 ,
    //chunking: true,
    parallelUploads: this.context.state.setting.parallelUploads,
    maxFilesize: this.context.state.setting.maxFilesize,
    timeout: this.context.state.setting.timeout,
    headers: {
      Authorization: "token " + localStorage.getItem("token"),
      Accept: "application/json",
    },
    maxFiles: 1,
    maxfilesexceeded: function (file) {
      this.removeAllFiles();
      this.addFile(file);
    },
    error: (file, error) => {
      if (error.message) {
        this.context.state.showCodeMessage(error.message, "error");
      }
    },
    success: (file, response, data) => {
      if (file.status === "success") {
        console.log(response.items.file);
        this.state.item.image = response.items;
        this.setState({
          loading: false,
          item: this.state.item,
          errors: [],
        });
        this.context.state.showCodeMessage(
          "File uploaded successfully .",
          "success"
        );
      } else {
        this.context.state.showCodeMessage(
          "Error while uploading file .",
          "error"
        );
      }
    },
  };
  pickCoordinateCallback = (lat, lon) => {
    if ((lat == null, lon == null)) {
      this.setState({ pickCoordinate: true });
      if (this.props.update) {
        this.props.hideParentModal(true);
      }
    } else {
      let temp = this.state.item;

      temp.geo.geometry.coordinates[0] = lon;
      temp.geo.geometry.coordinates[1] = lat;

      let error = this.state.errors;

      this.setNestedObject(
        this.state.errors,
        "geo.geometry.coordinates.1",
        null
      );
      this.setNestedObject(
        this.state.errors,
        "geo.geometry.coordinates.0",
        null
      );

      this.setState({ item: temp, pickCoordinate: false, errors: error });
      this.props.hideParentModal(false);
    }
  };
  componentDidMount() {
    let temp = this.state.item;
    temp[`${this.props.eventType}_id`] = this.props.eventId;
    temp["type"] = this.props.eventType;
    this.setState({
      item: temp,
    });

    if (this.props.update || this.props.showInfo) {
      eventRecord(this.props.id)
        .then((res) => {
          res.items.date = new Date(res.items.date.replace(/-/g, "/"));
          res.items.event_date = new Date(
            res.items.event_date.replace(/-/g, "/")
          );
          let long = res.items.geo.geometry.coordinates[0];
          let lat = res.items.geo.geometry.coordinates[1];
          res.items.geo.geometry.coordinates[0] = this.context.state.DecimaltoDMS(
            long,
            "lon"
          );
          res.items.geo.geometry.coordinates[1] = this.context.state.DecimaltoDMS(
            lat,
            "lat"
          );
          this.setState({
            item: res.items,
          });
          citiesAreaList(res.items.area_id)
            .then((response) => {
              this.setState({ cities: response.items });
            })
            .catch((error) => {
              this.context.state.handelError(error);
            });
        })
        .catch((error) => {
          this.context.state.handelError(error);
        });

      eventTypeList()
        .then((res) => {
          let eventTypes = res.items.filter((item) => item.id != 1);
          this.setState((prevState) => ({
            ...prevState,
            eventTypes,
          }));
        })
        .catch((error) => {
          this.context.state.handelError(error);
        });
    } else {
      eventTypeList()
        .then((res) => {
          let eventTypes = res.items.filter((item) => item.id != 1);
          this.setState((prevState) => ({
            ...prevState,
            eventTypes,
            item: {
              ...prevState.item,
              event_type_id: res.items[0].id,
            },
          }));
        })
        .catch((error) => {
          this.context.state.handelError(error);
        });
    }

    eventSourceTypeList()
      .then((res) => {
        this.setState({
          eventSourceTypes: res.items.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          }),
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });

    areaZone().then((res) => {
      this.setState({
        areas: res.items,
      });
    });
  }
  reformatDate = (date) => {
    if (date) {
      let currentDate = date.toLocaleDateString("en-GB").split("/");
      return currentDate[2] + "-" + currentDate[1] + "-" + currentDate[0];
    }
  };
  handelchange = (e) => {
    // throw new Error("s")
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  handleChangeSelect = (key, e) => {
    let temp = this.state.item;
    temp[key] = e.target.value;
    citiesAreaList(e.target.value)
      .then((res) => {
        this.setState({ cities: res.items });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    let error = this.state.errors;
    error[key] = null;
    console.log(temp);
    this.setState({ item: temp, errors: error });
  };

  setDate = (date) => {
    let temp = this.state.item;
    temp.date = date;
    let error = this.state.errors;
    error["date"] = null;
    this.setState({ item: temp, errors: error });
  };
  setEventDate = (date) => {
    let temp = this.state.item;
    temp.event_date = date;
    this.setState({ item: temp });
  };
  handleMultiSelect = (selected) => {
    console.log(selected);
    let temp = this.state.item;
    if (selected !== null) {
      temp["event_sources"] = selected.map((item) => {
        return {
          event_source_type: { name: item.label },
          event_source_type_id: item.value,
        };
      });
      this.setState({
        item: temp,
      });
    } else {
      temp["event_sources"] = [];
      this.setState({
        item: temp,
      });
    }
  };
  save = () => {
    let checks = {
      "geo.geometry.coordinates.0": ["required", "dmsLongitude"],
      "geo.geometry.coordinates.1": ["required", "dmsLatitude"],
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
      (item.geo.geometry.coordinates[0] = this.context.state.DMStoDecimal(
        item.geo.geometry.coordinates[0],
        "lon"
      )),
        (item.geo.geometry.coordinates[1] = this.context.state.DMStoDecimal(
          item.geo.geometry.coordinates[1],
          "lat"
        ));
      if (this.props.update) {
        this.update(item);
      } else {
        this.create(item);
      }

      //back-end // update transit //
    }
  };

  update = (item) => {
    eventUpdate(this.props.id, {
      ...item,
      date: this.reformatDate(this.state.item.date),
      event_date: this.reformatDate(this.state.item.event_date),
    })
      .then((res) => {
        var geojsonFormat = new GeoJSON();
        // reads and converts GeoJSon to Feature Object
        var features = geojsonFormat.readFeatures(res.items.geo);
        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: `/static/icons/${res.items.event_type.icon.file}`,
          }),
        });
        for (let index = 0; index < features.length; index++) {
          features[index].itemId = res.items.id;
          features[index].type = "event";
          features[index].name = res.items.title;
          features[index].data = res.items;
          features[index].setStyle(iconStyle);
        }
        this.context.state.dataSources.eventDataSource.addFeatures(features);
        // this.props.refresh();
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
            this.context.state.handelError(error);
            break;
        }
      });
  };

  create = (item) => {
    eventCreateAtArea({
      ...item,
      date: this.reformatDate(this.state.item.date),
      event_date: this.reformatDate(this.state.item.event_date),
    })
      .then((res) => {
        var geojsonFormat = new GeoJSON();
        // reads and converts GeoJSon to Feature Object
        var features = geojsonFormat.readFeatures(res.items.geo);
        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: `/static/icons/${res.items.event_type.icon.file}`,
          }),
        });
        for (let index = 0; index < features.length; index++) {
          features[index].itemId = res.items.id;
          features[index].type = "event";
          features[index].name = res.items.title;
          features[index].data = res.items;
          features[index].setStyle(iconStyle);
        }
        this.context.state.dataSources.eventDataSource.addFeatures(features);
        // this.props.refresh();
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
            this.context.state.handelError(error);
            break;
        }
      });
  };

  ////

  handleNestedchange = (e) => {
    this.setNestedObject(this.state.item, e.target.name, e.target.value);
    this.setNestedObject(this.state.errors, e.target.name, null);

    this.setState({
      item: this.state.item,
      errors: this.state.errors,
    });
  };

  setNestedObject = (schema, path, value) => {
    console.log();
    var pList = path.split(".");
    var len = pList.length;
    for (var i = 0; i < len; i++) {
      var elem = pList[i];
      if (i == len - 1) {
        schema = schema[elem] = value;
      } else {
        schema = schema[elem];
      }
    }
  };

  render() {
    return (
      <div
        className={` ${
          this.state.pickCoordinate === true ? "hidden" : ""
        } arabic model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4`}
      >
        <div className="bg-white  mx-auto  shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>

            <div className="mt-2  text-sm leading-5 text-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <div className="z-10">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      نوع الحدث
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm ">
                        <div className="space-y-1">
                          <div className="relative">
                            <span className="inline-block w-full rounded-md shadow-sm">
                              {this.state.eventTypes
                                .filter((item) => {
                                  return (
                                    item.id === this.state.item.event_type_id
                                  );
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
                                          className="mr-4  flex-shrink-0 h-6 w-6 rounded-full"
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
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </span>
                                    </button>
                                  );
                                })}
                            </span>
                            {this.state.showList === true ? (
                              <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg">
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
                                    {" "}
                                    {this.state.eventTypes
                                      .filter((item) => {
                                        return item.movement === false;
                                      })
                                      .map((item, index) => {
                                        return (
                                          <li
                                            onClick={() => {
                                              let temp = this.state.item;
                                              temp["event_type_id"] = item.id;
                                              this.setState({
                                                item: temp,
                                                showList: false,
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
                                            {this.state.item.event_type_id ===
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
                      {this.state.errors.event_type_id ? (
                        <Error message={this.state.errors.event_type_id} />
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      شماليات
                    </label>
                    <input
                      autocomplete="off"
                      type="text"
                      id="latitude"
                      name="geo.geometry.coordinates.1"
                      onChange={this.handleNestedchange}
                      className="custom-input-size form-input inline-block ltr border px-2 py-2  w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.geo.geometry.coordinates[1]}
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
                    {this.state.errors?.geo?.geometry?.coordinates[1] ? (
                      <Error
                        message={this.state.errors.geo.geometry.coordinates[1]}
                      />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      شرقيات
                    </label>
                    <input
                      autocomplete="off"
                      type="text"
                      id="longitude"
                      name="geo.geometry.coordinates.0"
                      onChange={this.handleNestedchange}
                      className="form-input ltr border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.geo.geometry.coordinates[0]}
                    />
                    {this.state.errors?.geo?.geometry?.coordinates[0] ? (
                      <Error
                        message={this.state.errors.geo.geometry.coordinates[0]}
                      />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="area_id"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      المنطقة
                    </label>
                    <select
                      type="text"
                      id="area_id"
                      name="area_id"
                      onChange={(e) => {
                        this.handleChangeSelect("area_id", e);
                      }}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.area_id}
                    >
                      <option value="">اختر منطقة</option>
                      {this.state.areas.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    {this.state.errors.area_id ? (
                      <Error message={this.state.errors.area_id} />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="city_id"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      المدينة
                    </label>
                    <select
                      type="text"
                      id="city_id"
                      name="city_id"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.city_id}
                    >
                      <option value="">اختر منطقة</option>
                      {this.state.cities.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    {this.state.errors.city_id ? (
                      <Error message={this.state.errors.city_id} />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      التاريخ
                    </label>

                    <DatePicker
                      selected={this.state.item.date}
                      onChange={(date) => this.setDate(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />

                    {this.state.errors.date ? (
                      <Error message={this.state.errors.date} />
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      رقم المكاتبة
                    </label>
                    <input
                      autocomplete="off"
                      type="text"
                      id="number"
                      name="number"
                      placeholder="رقم"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.number}
                    />
                    {this.state.errors.number ? (
                      <Error message={this.state.errors.number} />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="event_date"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      تاريخ المكاتبة
                    </label>

                    <DatePicker
                      selected={this.state.item.event_date}
                      onChange={(date) => this.setEventDate(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />

                    {this.state.errors.event_date ? (
                      <Error message={this.state.errors.event_date} />
                    ) : null}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1">
                      الصورة
                    </label>

                    <DropzoneComponent
                      config={this.componentConfig}
                      djsConfig={this.djsImageConfig}
                    >
                      <div className=" sm:mt-0 sm:col-span-3">
                        <div className="max-w-lg  justify-center px-6  py-1 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="text-center">
                            <p className="mt-1 text-sm text-gray-600">
                              <button
                                type="button"
                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                              >
                                انقر لتحديد الملف
                              </button>{" "}
                              او قم بإسقاط الملفات هنا للتحميل
                            </p>
                          </div>
                          {this.state.uploading === true ? (
                            <div className="w-full mt-4">
                              <div className="shadow rounded-md w-full bg-grey-light">
                                <div
                                  className="bg-blue-600 rounded-md h-1 text-xs leading-none py-1 text-center text-white"
                                  style={{ width: `${this.state.percent}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </DropzoneComponent>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1">
                      وثيقة
                    </label>
                    <DropzoneComponent
                      config={this.componentConfig}
                      djsConfig={this.djsReportConfig}
                    >
                      <div className=" sm:mt-0 sm:col-span-3">
                        <div className="max-w-lg  justify-center px-6  py-1 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="text-center">
                            <p className="mt-1 text-sm text-gray-600">
                              <button
                                type="button"
                                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                              >
                                انقر لتحديد الملف
                              </button>{" "}
                              او قم بإسقاط الملفات هنا للتحميل
                            </p>
                          </div>
                          {this.state.uploading === true ? (
                            <div className="w-full mt-4">
                              <div className="shadow rounded-md w-full bg-grey-light">
                                <div
                                  className="bg-blue-600 rounded-md h-1 text-xs leading-none py-1 text-center text-white"
                                  style={{ width: `${this.state.percent}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </DropzoneComponent>
                  </div>
                  <div>
                    <label
                      htmlFor="confidence"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      درجة التاكيد
                    </label>

                    <select
                      type="text"
                      id="confidence"
                      name="confidence"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.confidence}
                      disabled={this.props.showInfo}
                    >
                      <option value="">اختر درجة التاكيد</option>
                      {confidence.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.title}
                          </option>
                        );
                      })}
                    </select>

                    {this.state.errors.confidence ? (
                      <Error message={this.state.errors.confidence} />
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="zoom"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      الخطورة
                    </label>

                    <select
                      type="text"
                      id="severity"
                      name="severity"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.severity}
                      disabled={this.props.showInfo}
                    >
                      <option value="">اختر الخطورة</option>
                      {severity.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.title}
                          </option>
                        );
                      })}
                    </select>

                    {this.state.errors.severity ? (
                      <Error message={this.state.errors.severity} />
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1">
                      المصادر
                    </label>
                    <div className="flex flex-col">
                      <Select
                        defaultValue={this.state.item.event_sources.map(
                          (item) => {
                            return {
                              label: item.event_source_type.name,
                              value: item.event_source_type_id,
                            };
                          }
                        )}
                        isMulti
                        name="event_sources"
                        options={this.state.eventSourceTypes}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="اختر المصادر"
                        onChange={this.handleMultiSelect}
                        value={this.state.item.event_sources.map((item) => {
                          return {
                            label: item.event_source_type.name,
                            value: item.event_source_type_id,
                          };
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      الوصف / المنطقة
                    </label>
                    <textarea
                      rows="3"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="اكتب الوصف أو المنطقة"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.description}
                      disabled={this.props.showInfo}
                    ></textarea>
                    {this.state.errors.description ? (
                      <Error message={this.state.errors.description} />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className=" block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2 sm:pb-1"
                    >
                      التفصيلات
                    </label>
                    <textarea
                      rows="3"
                      type="text"
                      id="extended_description"
                      name="extended_description"
                      placeholder="اكتب الوصف المطول"
                      onChange={this.handelchange}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.extended_description}
                      disabled={this.props.showInfo}
                    ></textarea>
                    {this.state.errors.extended_description ? (
                      <Error message={this.state.errors.extended_description} />
                    ) : null}
                  </div>
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

EventsAreaModal.contextType = AppContext;
export default EventsAreaModal;
