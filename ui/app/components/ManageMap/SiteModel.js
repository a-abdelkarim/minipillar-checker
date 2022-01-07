import React, { Component, Fragment } from "react";
import { areaList } from "../../services/areas";
import { citiesAreaList } from "../../services/cities";

import { siteRecord, siteCreate, siteUpdate } from "../../services/sites";
import AppContext from "../../contexts/AppContext";
import Error from "../Utilities/Error";

import GeoJSON from "ol/format/GeoJSON.js";
import Feature from "ol/Feature.js";
class SiteModel extends Component {
  state = {
    item: {},
    errors: {},
    areas: [],
    cities: [],
    minimized: false,
  };

  componentDidMount() {
    areaList()
      .then((response) => {
        this.setState({ areas: response.items });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });

    if (this.props.update === true) {
      siteRecord(this.props.id)
        .then((res) => {
          this.setState({ item: res.items });
          citiesAreaList(res.items.area_id)
            .then((response) => {
              this.setState({ cities: response.items });
            })
            .catch((error) => {
              this.context.state.handelError(error);
            });

          var geojsonFormat = new GeoJSON();

          // reads and converts GeoJSon to Feature Object
          var features = geojsonFormat.readFeatures(res.items.geo);
          features[0].id = res.items.id;
          features[0].type = "site";
          this.context.state.dataSources.drawDataSource.addFeatures(features);
        })
        .catch((error) => {
          this.context.state.handelError(error);
        });
    }
  }

  update = () => {
    //back-end // update transit //
    siteUpdate(this.props.id, this.state.item)
      .then((res) => {
        this.props.refresh();
        this.props.close();

        this.context.state.dataSources.siteDataSource.forEachFeature(
          (feature) => {
            if (feature.id === this.props.id) {
              this.context.state.dataSources.siteDataSource.removeFeature(
                feature
              );
            }
          }
        );

        this.context.state.dataSources.drawDataSource.clear();
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
            this.context.state.handelError(error);
            break;
        }
      });
  };

  startDraw = () => {
    this.context.state.activeInteraction(["drawPolygon", "modify"]);
    this.context.state.interaction.select.getFeatures().clear();

    this.toggleMinimized();
  };

  cancelDraw = () => {
    this.context.state.activeInteraction(["select"]);

    this.context.state.interaction.select.getFeatures().clear();
    this.toggleMinimized();
  };

  saveDraw = () => {
    this.context.state.activeInteraction(["select"]);

    let geom = [];
    this.context.state.dataSources.drawDataSource.forEachFeature(function (
      feature
    ) {
      geom.push(new Feature(feature.getGeometry()));
    });
    var writer = new GeoJSON();
    var geoJsonStr = writer.writeFeatures(geom);

    let temp = this.state.item;
    temp["geo"] = JSON.parse(geoJsonStr);

    let error = this.state.errors;
    error["geo"] = null;

    this.setState({ item: temp, errors: error });

    this.toggleMinimized();
  };

  toggleMinimized = () => {
    this.setState({
      minimized: !this.state.minimized,
    });
  };

  create = () => {
    //back-end // update transit //
    siteCreate(this.state.item)
      .then((res) => {
        this.props.refresh();
        this.props.close();
        this.context.state.dataSources.drawDataSource.clear();
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
              if (element[0] === "area") {
                element[0] = "area_id";
              }
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

  save = () => {
    if (this.props.update === true) {
      this.update();
    } else {
      this.create();
    }
  };

  render() {
    return (
      <Fragment>
        {this.state.minimized === true ? (
          <div className="fixed z-20 left-0 bottom-0 ml-5 mb-5  col-span-1 bg-white rounded-lg shadow">
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm leading-5 font-bold text-gray-900 truncate">
                    رسم المضلع
                  </h3>
                </div>
                <p className="mt-1 text-gray-700 text-sm leading-5 truncate">
                  انقر على الخريطة لبدء الرسم
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <div className="-mt-px flex">
                <div className="w-0 flex-1 flex border-r border-gray-200">
                  <a
                    onClick={this.cancelDraw}
                    className=" cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                  >
                    <span className="ml-3">الغاء</span>
                  </a>
                </div>
                <div className="-ml-px w-0 flex-1 flex">
                  <a
                    onClick={this.saveDraw}
                    className="cursor-pointer relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
                  >
                    <span className="ml-3">حفظ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
            <div className="arabic bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {this.props.title}
                </h3>
                <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
                  <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                    >
                      الإسم
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                        <input
                          autocomplete="off"
                          type="text"
                          id="name"
                          name="name"
                          onChange={this.handelchange}
                          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                          value={this.state.item.name}
                        />
                      </div>
                      {this.state.errors.name ? (
                        <Error message={this.state.errors.name} />
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
                        <select
                          onChange={(e) => {
                            this.handleChangeSelect("area_id", e);
                          }}
                          value={this.state.item.area_id}
                          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                          id="area_id"
                          name="area_id"
                        >
                          <option disabled selected>
                            اختر المنطقة
                          </option>
                          {this.state.areas.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {this.state.errors.area_id ? (
                        <Error message={this.state.errors.area_id} />
                      ) : null}
                    </div>
                  </div>
                  <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="city_id"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                    >
                      المدينة
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                        <select
                          onChange={this.handelchange}
                          value={this.state.item.city_id}
                          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                          id="city_id"
                          name="city_id"
                        >
                          <option disabled selected>
                            اختر المدينة
                          </option>
                          {this.state.cities.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {this.state.errors.city_id ? (
                        <Error message={this.state.errors.city_id} />
                      ) : null}
                    </div>
                  </div>

                  <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                    >
                      الوصف
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                        <textarea
                          type="text"
                          id="description"
                          name="description"
                          onChange={this.handelchange}
                          className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                          value={this.state.item.description}
                        ></textarea>
                      </div>

                      {this.state.errors.description ? (
                        <Error message={this.state.errors.description} />
                      ) : null}
                    </div>
                  </div>

                  <div
                    onClick={this.startDraw}
                    className="filepicker cursor-pointer dropzone mt-3 dz-clickable"
                  >
                    <div className="mt-2 sm:mt-0 sm:col-span-3">
                      <div className="max-w-lg  justify-center px-6  pb-15 pt-5 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="text-center">
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            fill="currentColor"
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            viewBox="0 0 191.148 191.148"
                          >
                            <g>
                              <g>
                                <path
                                  d="M129.707,58.028c-7.528,0-13.653,6.125-13.653,13.653c0,7.528,6.125,13.653,13.653,13.653
			c7.528,0,13.653-6.125,13.653-13.653C143.361,64.153,137.235,58.028,129.707,58.028z M129.707,78.508
			c-3.765,0-6.827-3.062-6.827-6.827s3.062-6.827,6.827-6.827c3.765,0,6.827,3.062,6.827,6.827S133.472,78.508,129.707,78.508z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M176.494,113.641l-36.768-36.768c-1.331-1.333-3.495-1.333-4.826,0c-1.333,1.333-1.333,3.494,0,4.826l36.768,36.768
			c0.666,0.667,1.539,1,2.413,1c0.874,0,1.748-0.333,2.413-1C177.827,117.135,177.827,114.974,176.494,113.641z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M123.935,61.083L87.747,24.894c-1.331-1.333-3.495-1.333-4.826,0c-1.333,1.333-1.333,3.494,0,4.826l36.188,36.188
			c0.666,0.667,1.539,1,2.413,1c0.874,0,1.748-0.333,2.413-1C125.268,64.576,125.268,62.416,123.935,61.083z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M190.147,185.321L5.827,1.001C4.853,0.023,3.383-0.269,2.108,0.26C0.832,0.789,0.001,2.034,0.001,3.414v184.32
			c0,1.884,1.529,3.413,3.413,3.413h184.32c1.381,0,2.625-0.831,3.154-2.108C191.415,187.765,191.123,186.297,190.147,185.321z
			 M6.827,184.321V11.656l172.665,172.665H6.827z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M105.814,23.894h-20.48c-1.884,0-3.413,1.529-3.413,3.413v20.48c0,1.884,1.529,3.413,3.413,3.413s3.413-1.527,3.413-3.413
			V30.721h17.067c1.884,0,3.413-1.529,3.413-3.413S107.698,23.894,105.814,23.894z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M174.081,23.894h-20.48c-1.884,0-3.413,1.529-3.413,3.413s1.529,3.413,3.413,3.413h17.067v17.067
			c0,1.884,1.529,3.413,3.413,3.413c1.884,0,3.413-1.527,3.413-3.413v-20.48C177.494,25.424,175.965,23.894,174.081,23.894z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M174.081,92.161c-1.884,0-3.413,1.529-3.413,3.413v17.067h-17.067c-1.884,0-3.413,1.529-3.413,3.413
			c0,1.884,1.529,3.413,3.413,3.413h20.48c1.884,0,3.413-1.527,3.413-3.413v-20.48C177.494,93.69,175.965,92.161,174.081,92.161z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M173.08,28.308c-1.331-1.333-3.495-1.333-4.826,0l-32.427,32.427c-1.333,1.333-1.333,3.494,0,4.826
			c0.666,0.667,1.539,1,2.413,1c0.874,0,1.748-0.333,2.413-1l32.427-32.427C174.413,31.801,174.413,29.641,173.08,28.308z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M64.854,160.428H3.414c-1.884,0-3.413,1.529-3.413,3.413s1.529,3.413,3.413,3.413h61.44c1.884,0,3.413-1.529,3.413-3.413
			S66.738,160.428,64.854,160.428z"
                                />
                              </g>
                            </g>
                            <g>
                              <g>
                                <path
                                  d="M37.547,139.948H3.414c-1.884,0-3.413,1.529-3.413,3.413s1.529,3.413,3.413,3.413h34.133c1.884,0,3.413-1.529,3.413-3.413
			S39.431,139.948,37.547,139.948z"
                                />
                              </g>
                            </g>
                          </svg>
                          <p className="mt-1 text-sm text-gray-600">
                            <button
                              type="button"
                              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                            >
                              انقر لبدء رسم المضلع
                            </button>

                            {this.state.errors.geo ? (
                              <Error message={this.state.errors.geo} />
                            ) : null}
                          </p>
                        </div>
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
                    {this.props.update ? "تحديث" : "إضافة"}
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
        )}
      </Fragment>
    );
  }
}
SiteModel.contextType = AppContext;
export default SiteModel;
