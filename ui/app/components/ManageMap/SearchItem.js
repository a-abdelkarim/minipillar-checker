import React, { Component, Fragment } from "react";
import ScrollArea from "react-scrollbar";
import * as turf from "@turf/turf";
import GeoJSON from "ol/format/GeoJSON";
import AppContext from "../../contexts/AppContext";
import { eventAnalyze, eventViewerAnalyze } from "../../services/events";
import { eventSearch } from "../../services/events";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";

class SearchItem extends Component {
  state = {
    items: [],
    orderQuery: { type: "id", order: false },
    page: 1,
    pages: 1,
    user: JSON.parse(localStorage.getItem("user")),
    interval: true,
  };

  componentDidMount() {
    this.setState({
      items: this.props.searchItem,
    });
    if (this.state.interval === true && this.state.user.type === "viewer") {
      this.interval = setInterval(() => {
        this.getNewData();
      }, 30000);
    }
  }

  removeInterval = () => {
    this.setState({ interval: false });
    clearInterval(this.interval);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getNewData = () => {
    if (this.context.state.searchType === "event_analyze") {
      this.context.state.event_analyze.order = this.state.orderQuery;
      this.context.state.event_analyze.date_analyze = this.context.state.searchTime;
      eventViewerAnalyze(this.context.state.event_analyze).then((res) => {
        this.setState({
          items: [...res.items, ...this.state.items],
        });
        if (res.items.length >= 1) {
          this.audio = new Audio("/static/sounds/message.mp3");
          this.audio.load();
          this.audio.play();

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

            var circle = turf.circle(
              features[0].getGeometry().flatCoordinates,
              10,
              { steps: 10, units: "kilometers" }
            );

            circle = new GeoJSON().readFeature(circle);
            this.context.state.viewer
              .getView()
              .fit(circle.getGeometry().getExtent(), {
                constrainResolution: false,
              });
          });
        }
        this.context.state.saveSearchTime(res.meta.date_analyze);
      });
    }
    if (this.context.state.searchType === "event_location") {
      this.context.state.event_location.order = this.state.orderQuery;
      this.context.state.event_location.date_analyze = this.context.state.searchTime;

      eventSearch(this.context.state.event_location).then((res) => {
        this.setState({
          items: [...res.items, ...this.state.items],
        });

        if (res.items.length >= 1) {
          this.audio = new Audio("/static/sounds/message.mp3");
          this.audio.load();
          this.audio.play();

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

            var circle = turf.circle(
              features[0].getGeometry().flatCoordinates,
              10,
              { steps: 10, units: "kilometers" }
            );

            circle = new GeoJSON().readFeature(circle);
            this.context.state.viewer
              .getView()
              .fit(circle.getGeometry().getExtent(), {
                constrainResolution: false,
              });
          });
        }
        this.context.state.saveSearchTime(res.meta.date_analyze);
      });
    }
  };

  getData = () => {
    if (this.context.state.searchType === "event_analyze") {
      this.context.state.event_analyze.order = this.state.orderQuery;
      this.context.state.event_analyze.date_analyze = 0;

      eventAnalyze(this.context.state.event_analyze).then((res) => {
        this.setState({
          items: res.items,
        });
      });
    }
    if (this.context.state.searchType === "event_location") {
      this.context.state.event_location.order = this.state.orderQuery;
      this.context.state.event_location.date_analyze = 0;

      eventSearch(this.context.state.event_location).then((res) => {
        this.setState({
          items: res.items,
        });
      });
    }
  };

  addOrder = (type) => {
    let temp = this.state.orderQuery;
    if (temp.type === type) {
      temp.order = temp.order === "desc" ? "asc" : "desc";
    } else {
      temp = { type: type, order: "desc" };
    }
    //save order to state
    this.setState(
      {
        orderQuery: temp,
      },
      //update the table data
      this.getData
    );
    //save order to context
    this.context.state.setOrderQuery(temp);
  };
  // create order icon next to the selected col
  renderOrder = (type) => {
    if (type !== this.state.orderQuery.type) {
      return (
        <svg
          alt="order"
          onClick={() => this.addOrder(type)}
          className="absolute right-0 w-3 orderLocation mr-2 cursor-pointer float-left order"
          viewBox="0 0 1792 1792"
        >
          <path
            fill="#a0aec0"
            d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"
          />
        </svg>
      );
    } else {
      switch (this.state.orderQuery.order) {
        case "desc":
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className="absolute right-0 w-3 orderLocation mr-2 cursor-pointer float-left order"
              viewBox="0 0 1792 1792"
            >
              <path d="M1408 704q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z" />
            </svg>
          );
          break;
        case "asc":
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className="absolute right-0 w-3 orderLocation mr-2 cursor-pointer float-left order"
              viewBox="0 0 1792 1792"
            >
              <path d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
            </svg>
          );
          break;
        default:
          return (
            <svg
              alt="order"
              onClick={() => this.addOrder(type)}
              className="absolute right-0 w-3 orderLocation mr-2 cursor-pointer float-left order"
              viewBox="0 0 1792 1792"
            >
              <path
                fill="#a0aec0"
                d="M1408 1088q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45zm0-384q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"
              />
            </svg>
          );
          break;
      }
    }
  };

  goToLOcation = (center) => {
    var circle = turf.circle(center, 1, { steps: 256, units: "kilometers" });

    circle = new GeoJSON().readFeature(circle);
    this.context.state.viewer.getView().fit(circle.getGeometry().getExtent(), {
      constrainResolution: false,
    });
  };

  render() {
    return (
      <div
        style={{ width: 600 }}
        className="fixed h-full pr-20 right-0 bottom-0  pt-4 pl-4 z-20   bg-white  "
      >
        <ScrollArea
          style={{
            overflow: "hidden",
            height: " 100% ",
          }}
        >
          <Fragment>
            {this.state.user.type === "viewer" &&
            this.state.interval === true ? (
              <div
                key={this.state.id}
                className="arabic  fixed w-1/4 z-10 top-0 left-0  mb-5  col-span-1  "
              >
                <div className="w-full flex items-center justify-between p-6 space-x-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white text-sm leading-5 font-medium truncate">
                        <span
                          onClick={this.removeInterval}
                          className="text-blue-500 cursor-pointer"
                        >
                          ألغاء
                        </span>{" "}
                        التحديث التلقائى للاحداث
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className=" mt-2    flex flex-col">
              <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block min-w-full   overflow-hidden sm:rounded-lg border-b border-gray-200">
                  <table className="arabic min-w-full">
                    <thead>
                      <tr>
                        <th className="relative pr-8 px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium  text-gray-700 uppercase tracking-wider">
                          {this.renderOrder("title")}
                          الحدث
                        </th>
                        <th className="relative pr-8 px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium  text-gray-700 uppercase tracking-wider">
                          {this.renderOrder("site")}
                          الموقع
                        </th>
                        <th className="relative pr-8 px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium  text-gray-700 uppercase tracking-wider">
                          {this.renderOrder("date")}
                          التاريخ
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white">
                      {this.state.items.map((item, index) => (
                        <tr
                          onClick={() => {
                            this.goToLOcation(item.geo.geometry.coordinates);
                          }}
                          className="hover:bg-gray-100 "
                        >
                          <td className="px-4  cursor-pointer py-2  border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                            <img
                              className="flex-shrink-0 h-6 w-6 rounded-full absolute"
                              src={`/static/icons/${item.event_type.icon.file}`}
                            />{" "}
                            <span className="mr-8">
                              {" "}
                              {item.title} <br />
                            </span>
                          </td>
                          {item.site ? (
                            <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {item.site.name}
                            </td>
                          ) : item.area ? (
                            <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {item.area.name}
                            </td>
                          ) : null}
                          <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Fragment>
        </ScrollArea>
      </div>
    );
  }
}
SearchItem.contextType = AppContext;

export default SearchItem;
