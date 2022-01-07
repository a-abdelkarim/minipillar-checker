import React, { Component } from "react";
import Error from "../Error";
import AppContext from "../../../contexts/AppContext";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";
import GeoJSON from "ol/format/GeoJSON";

class Location extends Component {
  state = {
    item: {},
    errors: {},
  };

  handelchange = (e) => {
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };

  save = () => {
    let checks = {
      longitude: ["required", "dmsLongitude"],
      latitude: ["required", "dmsLatitude"],
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
      var center = [
        this.context.state.DMStoDecimal(this.state.item.longitude),
        this.context.state.DMStoDecimal(this.state.item.latitude),
      ];

      this.context.state.viewer.getView().setCenter(center);
      this.context.state.viewer.getView().setZoom(14);
      var geojsonFormat = new GeoJSON();
      var features = geojsonFormat.readFeatures({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [
                this.context.state.DMStoDecimal(this.state.item.longitude),
                this.context.state.DMStoDecimal(this.state.item.latitude),
              ],
            },
          },
        ],
      });

      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: `/static/icons/0ddcb7ba-2eb2-4c76-be83-2cda9f1a8bb1.png`,
        }),
      });
      for (let index = 0; index < features.length; index++) {
        features[index].type = "icon";
        features[index].setStyle(iconStyle);
      }
      this.context.state.dataSources.drawDataSource.addFeatures(features);

      this.props.close();
    }
  };
  render() {
    return (
      <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
        <div className="arabic bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              البحث عن موقع
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
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
                      className="ltr form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                      value={this.state.item.latitude}
                    />
                    <p class=" ltr mt-2 text-sm text-gray-500">
                      30 31 36.16 N مثال
                    </p>
                  </div>

                  {this.state.errors.latitude ? (
                    <Error message={this.state.errors.latitude} />
                  ) : null}
                </div>
              </div>

              <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
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
                    <p class=" ltr mt-2 text-sm text-gray-500">
                      17 22 65.16 E مثال
                    </p>
                  </div>

                  {this.state.errors.longitude ? (
                    <Error message={this.state.errors.longitude} />
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
                تأكيد
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

Location.contextType = AppContext;
export default Location;
