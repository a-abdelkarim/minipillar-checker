import React, { Component } from "react";
import AppContext from "./AppContext";
import moment from "moment";
import Alert from "./../components/Utilities/Alert";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css";

const Cesium = window.Cesium;
class AppProvider extends Component {
  constructor() {
    super();
    this.state = {
      setting: {
        uploadURL:
          process.env.NODE_ENV !== "production"
            ? "http://localhost:8000/"
            : "/",
        parallelUploads: 15,
        maxFilesize: 500,
        timeout: 3600000,
      },
      validation: this.validation,
      serverError: false,
      applicationError: false,
      codeMessage: false,
      codeMessageText: "",
      codeMessageType: "",
      serverErrorMessage: "",
      cameraMode: "globe",
      showServerError: this.showServerError,
      handelError: this.handelError,
      showCodeMessage: this.showCodeMessage,
      hideError: this.hideError,
      clearMessage: this.clearMessage,
      dataSources: {},
      setDataSources: this.setDataSources,

      pickCoordinateCallback: this.pickCoordinateCallback,
      setPickCoordinateCallback: this.setPickCoordinateCallback,
      pickCoordinate: false,

      interaction: {},
      setInteraction: this.setInteraction,
      activeInteraction: this.activeInteraction,

      showApplicationError: this.showApplicationError,
      viewer: {},
      setRefreshMap: this.setRefreshMap,
      setViewer: this.setViewer,

      DecimaltoDMS: this.DecimaltoDMS,
      DMStoDecimal: this.DMStoDecimal,

      alerts: [],
      searchQuery: [],
      filterQuery: [],
      orderQuery: { type: "id", order: "desc" },
      event_location: {},
      event_analyze: {},
      orderLayerQuery: { type: "name", order: "desc" },
      setSearchQuery: this.setSearchQuery,
      setFilterQuery: this.setFilterQuery,
      setOrderQuery: this.setOrderQuery,
      setOrderLayerQuery: this.setOrderLayerQuery,
      setViewInterval: this.setViewInterval,
      interval: 60,
      backgrounds: [],
      setBackgrounds: this.setBackgrounds,
      showAlert: false,
      getProperty: this.getProperty,
      setProperty: this.setProperty,
      saveSearchData: this.saveSearchData,
      saveSearchTime: this.saveSearchTime,
      delete: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).type !== "viewer"
          ? JSON.parse(localStorage.getItem("user")).delete
          : null
        : null,
      update: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).type !== "viewer"
          ? JSON.parse(localStorage.getItem("user")).update
          : null
        : null,

      handleReport: this.handleReport,
      showApplicationError: this.showApplicationError,

      //reports
      viewReport: this.viewReport,
      showReportModel: this.showReportModel,
      showAndViewReport: this.showAndViewReport,
      hideReportModel: this.hideReportModel,
      showReport: this.showReport,
      printArea: this.printArea,
      reportData: {},

      //alert
      alert: this.alert,
    };
  }

  alert = (message) => {
    toast(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 8000,
      style: {},
    });
  };

  printArea = () => {
    var content = document.getElementById("printArea");
    var frame = document.getElementById("printFrame").contentWindow;
    frame.document.open();
    frame.document.write(content.innerHTML);

    var otherhead = frame.document.getElementsByTagName("head")[0];
    var link = frame.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("media", "all");
    link.setAttribute("href", "/static/css/print.css");
    otherhead.appendChild(link);

    console.log(content.innerHTML);
    frame.document.close();
    frame.focus();
    setTimeout(() => {
      frame.print();
      this.loadingOff();
    }, 1000);

    this.setState({ reportName: "" });
  };

  handleReport = () => {
    this.setState({
      showReport: !this.state.showReport,
    });
  };
  saveReportData = (data) => {
    this.setState({
      reportData: data,
    });
  };

  loadingOn = () => {
    this.setState({ loading: true });
  };
  loadingOff = () => {
    this.setState({ loading: false });
  };

  showAndViewReport = (data, name) => {
    this.loadingOn();
    this.setState({ reportName: name, reportData: data });
  };
  showReport = (name) => {
    this.loadingOn();
    this.setState({ reportName: name });
  };
  viewReport = (data) => {
    let name = this.state.reportName.replace("model", "report");
    this.setState({ reportName: name, reportData: data });
  };
  hideReportModel = () => {
    this.setState({ reportName: "" });
  };
  showReportModel = (name) => {
    this.setState({ reportName: name });
  };

  pickCoordinateCallback = (lat, lon) => {
    this.setState({
      pickCoordinate: false,
    });
    this.state.pickCoordinateCallbackFn(lat, lon);
  };

  setPickCoordinateCallback = (pickCoordinateCallbackFn) => {
    this.setState({
      pickCoordinate: true,
      pickCoordinateCallbackFn: pickCoordinateCallbackFn,
    });
  };

  setInteraction = (interaction) => {
    this.setState({ interaction: interaction });
  };
  setBackgrounds = (backgrounds) => {
    this.setState({ backgrounds: backgrounds });
  };

  saveSearchData = (type, time, data) => {
    this.setState({
      [type]: data,
      searchType: type,
      searchTime: time,
    });
  };
  saveSearchTime = (time) => {
    this.setState({
      searchTime: time,
    });
  };

  activeInteraction = (interaction) => {
    Object.keys(this.state.interaction).forEach((key) => {
      if (interaction.indexOf(key) >= 0) {
        this.state.viewer.addInteraction(this.state.interaction[key]);
      } else {
        this.state.viewer.removeInteraction(this.state.interaction[key]);
      }
    });
  };

  setTransitMode = (transitMode) => {
    this.setState({ transitMode: transitMode });
  };

  setViewInterval = (interval) => {
    this.setState({ interval: interval });
  };

  setPage = (page) => {
    this.setState({ page: page });
  };
  setSearchQuery = (array) => {
    this.setState({ searchQuery: array });
  };
  setFilterQuery = (array) => {
    this.setState({ filterQuery: array });
  };
  setOrderQuery = (array) => {
    this.setState({ orderQuery: array });
  };
  setOrderLayerQuery = (array) => {
    this.setState({ orderLayerQuery: array });
  };
  setTransits = (array) => {
    this.setState({ transits: array });
  };
  setLayers = (array, updateClock = false) => {
    this.setState({ layers: array }, this.updateClock(updateClock));
  };
  setViewer = (viewer) => {
    this.setState({ viewer: viewer });
  };
  showApplicationError = () => {
    this.setState({ applicationError: true });
  };
  showServerError = (error) => {
    this.setState({
      serverError: true,
      serverErrorMessage: error.response.data,
    });
  };

  updateClock = (update) => {
    setTimeout(() => {
      let dates = [];
      for (let index = 0; index < this.state.layers.length; index++) {
        let startDate = new Date(this.state.layers[index].start + "+00:00");

        dates.push({
          timeStamp: moment(startDate, "YYYY-MM-DD HH:MM:SS")
            .utc()
            .subtract({ minutes: 30 }),
        });
        console.log(this.state.layers[index].end);
        if (this.state.layers[index].end != null) {
          let endDate = new Date(this.state.layers[index].end + "+00:00");
          dates.push({
            timeStamp: moment(endDate, "YYYY-MM-DD HH:MM:SS").utc(),
          });
        }
      }

      if (dates.length >= 2) {
        dates.order(function (left, right) {
          return moment.utc(left.timeStamp).diff(moment.utc(right.timeStamp));
        });

        this.state.viewer.timeline.zoomTo(
          Cesium.JulianDate.fromDate(dates[0].timeStamp.toDate()),
          Cesium.JulianDate.fromDate(dates[dates.length - 1].timeStamp.toDate())
        );
      }

      if (update === true && dates.length >= 1) {
        this.state.viewer.clock.currentTime = Cesium.JulianDate.fromDate(
          dates[0].timeStamp.add({ minutes: 30 }).toDate()
        );
      }
    }, 1000);
  };

  clearMessage = () => {
    this.setState({
      codeMessageType: "",
      codeMessageText: "",
    });
  };
  setDataSources = (dataSources) => {
    this.setState({
      dataSources: dataSources,
    });
  };

  hideError = () => {
    this.setState({ codeError: false, serverError: false });
  };
  handelError = (error) => {
    // console.log(error);
    if (!error.response) {
      this.showApplicationError();
    } else {
      switch (error.response.status) {
        case 404:
          this.showApplicationError();
          break;
        case 403:
          this.showApplicationError();
          break;
        case 500:
          this.showServerError(error);
          break;
        case 400:
          this.showCodeMessage("Error", error.response.data, "error");
          break;
        case 401:
          localStorage.clear();
          window.location = "login";
          break;
        default:
          break;
      }
    }
  };

  DecimaltoDMS = (cord, type) => {
    var cord = parseFloat(cord);

    var mapDatum = 0;

    if (type == "lat") {
      if (isNaN(cord) || cord > 90 || cord < -90) {
        console.log("Latitude must be between -90 and 90");
        return;
      } else {
        return cord >= 0
          ? this.toDMS(cord, "dms", 4, "") + " N"
          : +this.toDMS(cord, "dms", 4, "") + " S";
      }
    } else {
      if (isNaN(cord) || cord > 180 || cord < -180) {
        console.log("Longitude must be between -180 and 180");
        return;
      } else {
        return cord < 0
          ? this.toDMS(cord, "dms", 4, "0") + " W"
          : this.toDMS(cord, "dms", 4, "0") + " E";
      }
    }
  };

  toDMS = (deg, format, dp, marks, zero) => {
    if (typeof deg == "object")
      throw new TypeError("this.toDMS - deg is [DOM?] object");
    if (isNaN(deg)) return null; // give up here if we can't make a number from deg

    // default values
    if (typeof format == "undefined") format = "dms";
    marks = typeof marks !== "undefined" ? marks : false;

    if (typeof dp == "undefined") {
      switch (format) {
        case "d":
          dp = 4;
          break;
        case "dm":
          dp = 2;
          break;
        case "dms":
          dp = 0;
          break;
        default:
          format = "dms";
          dp = 0; // be forgiving on invalid format
      }
    }

    deg = Math.abs(deg); // (unsigned result ready for appending compass dir'n)

    switch (format) {
      case "d":
        d = deg.toFixed(dp); // round degrees
        if (d < 100) d = "0" + d; // pad with leading zeros
        if (d < 10) d = "0" + d;
        if (marks == true) {
          dms = d + "\u00B0"; // add º symbol
        } else {
          dms = d; // add º symbol
        }
        break;
      case "dm":
        var min = (deg * 60).toFixed(dp); // convert degrees to minutes & round
        var d = Math.floor(min / 60); // get component deg/min
        var m = (min % 60).toFixed(dp); // pad with trailing zeros
        if (d < 100) d = "0" + d; // pad with leading zeros
        if (d < 10) d = "0" + d;
        if (m < 10) m = "0" + m;
        if (marks == true) {
          dms = d + "\u00B0" + m + "\u2032"; // add º, ' symbols
        } else {
          dms = d + " " + m; // add º, ' symbols
        }
        break;
      case "dms":
        var sec = (deg * 3600).toFixed(dp); // convert degrees to seconds & round
        var d = Math.floor(sec / 3600); // get component deg/min/sec

        var m = Math.floor(sec / 60) % 60;
        var s = (sec % 60).toFixed(dp); // pad with trailing zeros

        //if (d < 100) d = zero +  d;            // pad with leading zeros
        //if (d < 10) d = '0' +  d;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        if (marks == true) {
          var dms = d + "\u00B0 " + m + "\u2032 " + s + "\u2033 "; // add º, ' symbols
        } else {
          var dms = d + " " + m + " " + s; // add º, ' symbols
        }
        break;
    }

    return dms;
  };

  DMStoDecimal = (dms, type) => {
    console.log(type);
    var direction = dms;
    //remove spaces
    dms = dms.replace(/[^0-9.EWNS]/g, "");
    dms = dms.replace(",", ".");

    var direction = direction.slice(direction.length - 1, direction.length);
    if (["n", "s", "w", "e"].includes(direction.toLowerCase()) == true) {
      dms = dms.replace(direction, "");
    } else {
      if (type == "lon") {
        direction = "e";
      } else {
        direction = "n";
      }
    }

    var temp = dms.split(".");

    dms = temp[0];

    if (dms.length == 7) {
      var degrees = parseFloat(dms.slice(0, 3));
      var minutes = parseFloat(dms.slice(3, 5));
      var seconds = parseFloat(dms.slice(5, dms.length));
    } else {
      var degrees = parseFloat(dms.slice(0, 2));
      var minutes = parseFloat(dms.slice(2, 4));
      var seconds = parseFloat(dms.slice(4, dms.length));
    }

    var dd = degrees + minutes / 60 + (seconds + ("." + temp[1])) / (60 * 60);

    if (
      direction == "S" ||
      direction == "W" ||
      direction == "s" ||
      direction == "w"
    ) {
      dd = dd * -1;
    } // Don't do anything for N or E

    return dd;
  };

  // validation = (key) => {
  //   let keys = {
  //     decimalLatitude: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
  //     decimalLongitude: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
  //     numeric: /^-{0,1}\d+$/,
  //     double: /^[+-]?\d+(\.\d+)?$/,
  //   };

  //   return keys[key];
  // };
  validation = (data, check) => {
    var checks = {
      decimalLatitude: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
      decimalLongitude: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
      dmsLatitude: /^[0-9]{2}[" "][0-9]{2}[" "](?:\b[0-9]+(?:\.[0-9]*)?|\.[0-9]+\b)[" "][N|S]$/i,
      dmsLongitude: /^[0-9]{2}[" "][0-9]{2}[" "](?:\b[0-9]+(?:\.[0-9]*)?|\.[0-9]+\b)[" "][E|W]$/i,
      numeric: /^-{0,1}\d+$/,
      double: /^[+-]?\d+(\.\d+)?$/,
      string: /^[a-zA-Z0-9]*$/,
      auralMorse: /^([\-\.]*)*$/,
      designator: /^([A-Z]|[0-9]|[, !"&#$%'\(\)\*\+\-\./:;<=>\?@\[\\\]\^_\|\{\}])*$/,
    };

    var errors = {};
    for (var key in check) {
      let itemValue = this.getProperty(data, key);
      for (var index in check[key]) {
        let type = check[key][index];

        if (type === "required") {
          if (
            itemValue === undefined ||
            itemValue === null ||
            itemValue == ""
          ) {
            errors = this.setProperty(errors, key, "This field is required");
          }
          console.log(errors);
        } else if (
          this.getProperty(errors, key) === undefined &&
          itemValue !== undefined
        ) {
          switch (type.split(":")[0]) {
            case "min":
              if (typeof itemValue == "number") {
                if (itemValue < parseInt(type.split(":")[1])) {
                  errors = this.setProperty(
                    errors,
                    key,
                    "Minimum value id is " + type.split(":")[1]
                  );
                }
              } else {
                if (itemValue.length < parseInt(type.split(":")[1])) {
                  errors = this.setProperty(
                    errors,
                    key,
                    "Minimum value id is " + type.split(":")[1]
                  );
                }
              }

              break;
            case "max":
              if (typeof itemValue == "number") {
                if (itemValue > parseInt(type.split(":")[1])) {
                  errors = this.setProperty(
                    errors,
                    key,
                    "Minimum value id is " + type.split(":")[1]
                  );
                }
              } else {
                if (itemValue.length > parseInt(type.split(":")[1])) {
                  errors = this.setProperty(
                    errors,
                    key,
                    "Minimum value id is " + type.split(":")[1]
                  );
                }
              }
              break;
            case "latitude":
              if (
                !itemValue.match(checks["decimalLatitude"]) &&
                this.state.coordinateSystem === "DD"
              ) {
                errors = this.setProperty(
                  errors,
                  key,
                  "Invalid latitude value"
                );
              }

              if (
                !itemValue.match(checks["dmsLatitude"]) &&
                this.state.coordinateSystem === "DMS"
              ) {
                errors = this.setProperty(
                  errors,
                  key,
                  "Invalid latitude value"
                );
              }
              break;
            case "longitude":
              if (
                !itemValue.match(checks["decimalLongitude"]) &&
                this.state.coordinateSystem === "DD"
              ) {
                errors = this.setProperty(
                  errors,
                  key,
                  "Invalid longitude value"
                );
              }
              if (
                !itemValue.match(checks["dmslLongitude"]) &&
                this.state.coordinateSystem === "DMS"
              ) {
                errors = this.setProperty(
                  errors,
                  key,
                  "Invalid longitude value"
                );
              }
              break;
            default:
              if (!itemValue.match(checks[type])) {
                errors = this.setProperty(
                  errors,
                  key,
                  `This field must be ${type} value`
                );
              }
              break;
          }
        } else if (this.getProperty(errors, key) === undefined) {
          errors = this.setProperty(errors, key, "Invalid field value");
        }
      }
    }
    return errors;
  };

  getProperty = (obj, prop) => {
    var last = obj;
    var parts = prop.split(".");
    var l = parts.length;
    var value = undefined;
    for (var i = 0; i < l; i++) {
      var current = parts[i];

      if (i == l - 1) {
        value = last[current];
      } else {
        if (last[current] == undefined) {
          last[current] = {};
          last = last[current];
        } else {
          last = last[current];
        }
      }
    }
    if (value !== undefined && value !== null) {
      value = value.toString();
    }
    return value;
  };

  setProperty = (obj, prop, value) => {
    var last = obj;
    var parts = prop.split(".");
    var l = parts.length;
    for (var i = 0; i < l; i++) {
      var current = parts[i];

      if (i == l - 1) {
        last[current] = value;
      } else {
        if (last[current] == undefined) {
          last[current] = {};
          last = last[current];
        } else {
          last = last[current];
        }
      }
    }
    return obj;
  };

  showCodeMessage = (title, message, type) => {
    let id = uuidv4();

    this.setState(
      {
        showAlert: true,
        alerts: [
          ...this.state.alerts,
          {
            title: title,
            message: message,
            type: type,
            uuid: id,
          },
        ],
      },
      () => {
        setTimeout(() => {
          this.hideCodeMessage(id);
        }, 5000);
      }
    );
  };

  hideCodeMessage = (uuid) => {
    console.log(uuid);
    let temp = this.state.alerts.filter((item) => {
      return item.uuid !== uuid;
    });
    console.log(temp);
    this.setState({
      showAlert: temp.length >= 1 ? true : false,
      alerts: temp,
    });
  };
  render() {
    return (
      <AppContext.Provider
        value={{
          state: this.state,
        }}
      >
        <ToastContainer />
        {this.state.showAlert === true ? (
          <Alert
            hideCodeMessage={this.hideCodeMessage}
            data={this.state.alerts}
          ></Alert>
        ) : null}

        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
