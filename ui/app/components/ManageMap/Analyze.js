import React, { Component } from "react";
import AppContext from "../../contexts/AppContext";
import { areaZone } from "../../services/areas";
import { eventAnalyze } from "../../services/events";
import { eventTypeList } from "../../services/eventTypes";
import { severity } from "./EventsModal";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Error from "../Utilities/Error";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";
class Analyze extends Component {
  state = {
    item: { date_analyze: 0, areas: [], event_types: [], severity: [] },
    errors: {},
    areas: [],
    zones: [],
    event_types: [],
    allOptions: false,
    severity: [],
    allSeverities: false,
  };

  componentDidMount() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.setState({ zones: user.user_zones });

    eventTypeList()
      .then((res) => {
        let event_types = res.items.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        event_types.unshift({ label: "Select All", value: 0 });
        this.setState({
          event_types,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    let mappedSeveirty = severity.map((item) => {
      return {
        label: item.title,
        value: item.id,
      };
    });
    mappedSeveirty.unshift({ label: "Select All", value: 0 });
    this.setState({
      severity: mappedSeveirty,
    });
  }

  handelchange = (e) => {
    // throw new Error("s")
    let temp = this.state.item;
    if (e.target.name === "zone_id") {
      if (this.state.item.zone_id !== "") {
        areaZone(e.target.value).then((res) => {
          let areas = res.items.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          areas.unshift({ label: "Select All", value: 0 });
          this.setState({ areas });
        });
      }
    }
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
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

  handleSeverity = (selected, name) => {
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
        temp.severity = [
          ...this.state.severity
            .filter((item) => item.value === 0)
            .map((item) => {
              return {
                severity: { name: item.label },
                severity_id: item.value,
              };
            }),
        ];

        let severityOptions = this.state.severity.filter(
          (item) => item.value !== 0
        );

        // console.log(valuesToView);
        this.setState({
          item: temp,
          errors: error,
          severityOptions,
          allSeverities: true,
        });
        return false;
      }
      temp["severity"] = selected.map((item) => {
        return {
          severity: { name: item.label },
          severity_id: item.value,
        };
      });
      this.setState({
        item: temp,
        errors: error,
      });
    } else {
      temp["severity"] = [];
      this.setState({
        item: temp,
        errors: error,
        severityOptions: [],
        allSeverities: false,
      });
    }
    if (selected.length == 0) {
      this.setState({
        severityOptions: [],
        allSeverities: false,
      });
    }
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

  handleArea = (selected, name) => {
    let temp = this.state.item;
    let error = this.state.errors;
    error[name] = null;
    if (selected !== null) {
      if (
        selected.filter((item) => {
          return item.value === 0;
        }).length >= 1
      ) {
        temp.areas = [
          ...this.state.areas
            .filter((item) => {
              return item.value !== 0;
            })
            .map((item) => {
              return { area: { name: item.label }, area_id: item.value };
            }),
        ];
        this.setState({
          item: temp,
        });
        return false;
      }

      temp["areas"] = selected.map((item) => {
        return {
          area: { name: item.label },
          area_id: item.value,
        };
      });
      this.setState({
        item: temp,
        errors: error,
      });
    } else {
      temp["areas"] = [];
      this.setState({
        item: temp,
        errors: error,
      });
    }
  };

  handleMultiSelect = (selected, name) => {
    let temp = this.state.item;
    let error = this.state.errors;
    error[name] = null;
    if (selected !== null) {
      if (
        selected.filter((item) => {
          return item.value === 0;
        }).length >= 1
      ) {
        temp.areas = [
          ...this.state.areas
            .filter((item) => {
              return item.value !== 0;
            })
            .map((item) => {
              return { area: { name: item.label }, area_id: item.value };
            }),
        ];
        this.setState({
          item: temp,
        });
        return false;
      }

      temp[name] = selected.map((item) => {
        return {
          [name]: { name: item.label },
          [name + "_id"]: item.value,
        };
      });
      this.setState({
        item: temp,
        errors: error,
      });
    } else {
      temp[name] = [];
      this.setState({
        item: temp,
        errors: error,
      });
    }
  };

  reformatDate = (date) => {
    if (date) {
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
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
    this.props.clearMap();
    let checks = {
      severity: ["required"],
      end_date: ["required"],
      start_date: ["required"],
      zone_id: ["required"],
      event_types: ["required"],
      areas: ["required"],
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
      eventAnalyze({
        ...this.state.item,
        start_date: this.reformatDate(this.state.item.start_date),
        end_date: this.reformatDate(this.state.item.end_date),
      })
        .then((res) => {
          console.log(res);
          this.context.state.dataSources.eventDataSource.clear(0);
          this.context.state.saveSearchData(
            "event_analyze",
            res.meta.date_analyze,
            {
              ...this.state.item,
              start_date: this.reformatDate(this.state.item.start_date),
              end_date: this.reformatDate(this.state.item.end_date),
            }
          );
          res.items.forEach((item) => {
            var geojsonFormat = new GeoJSON();
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
              this.context.state.handelError(error);
              break;
          }
        });
    }
  };

  render() {
    return (
      <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
        <div className="arabic bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">تحليل</h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  تاريخ البدء
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <DatePicker
                      selected={this.state.item.start_date}
                      onChange={(date) => this.setStartDate(date, "start_date")}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />
                  </div>
                  {this.state.errors.start_date ? (
                    <Error message={this.state.errors.start_date} />
                  ) : null}
                </div>
              </div>
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  تاريخ الانتهاء
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <DatePicker
                      selected={this.state.item.end_date}
                      onChange={(date) => this.setEndDate(date, "end_date")}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy-MM-dd"
                      popperClassName="rdp-fix"
                    />
                  </div>
                  {this.state.errors.end_date ? (
                    <Error message={this.state.errors.end_date} />
                  ) : null}
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="zone_id"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  الجهة
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <select
                      onChange={this.handelchange}
                      value={this.state.item.zone_id}
                      className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      id="zone_id"
                      name="zone_id"
                    >
                      <option value="">اختر الجهة</option>
                      {this.state.zones.map((item, index) => {
                        return (
                          <option key={index} value={item.zone.id}>
                            {item.zone.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {this.state.errors.zone_id ? (
                    <Error message={this.state.errors.zone_id} />
                  ) : null}
                </div>
              </div>
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  المنطقة
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <Select
                      defaultValue={this.state.item.areas}
                      isMulti
                      name="areas"
                      options={this.state.areas}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="اختر المنطقة"
                      onChange={(selected) =>
                        this.handleArea(selected, "areas")
                      }
                      value={this.state.item.areas.map((item) => {
                        return {
                          label: item.area.name,
                          value: item.area_id,
                        };
                      })}
                    />
                  </div>
                  {this.state.errors.areas ? (
                    <Error message={this.state.errors.areas} />
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
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                <label
                  htmlFor="severity"
                  className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  الخطورة
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                    <Select
                      defaultValue={this.state.item.severity}
                      isMulti
                      name="severity"
                      options={this.state.severity}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="اختر الخطورة"
                      onChange={(selected) =>
                        this.handleSeverity(selected, "severity")
                      }
                      value={
                        this.state.allSeverities
                          ? this.state.severityOptions
                          : this.state.item.severity.map((item) => {
                              return {
                                label: item.severity.name,
                                value: item.severity_id,
                              };
                            })
                      }
                    />
                  </div>
                  {this.state.errors.severity ? (
                    <Error message={this.state.errors.severity} />
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
                className=" inline-flex items-center px-3 ml-5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150"
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

Analyze.contextType = AppContext;
export default Analyze;
