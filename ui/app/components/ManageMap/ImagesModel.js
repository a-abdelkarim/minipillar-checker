import React, { Component, Fragment } from "react";

import { itemRecord, itemImage } from "../../services/items";
import AppContext from "../../contexts/AppContext";
import DropzoneComponent from "react-dropzone-component";
import ScrollArea from "react-scrollbar";
import Axios from "axios";
import Lightbox from "react-awesome-lightbox";
class ImagesModel extends Component {
  state = {
    items: [],
    item: {},
    errors: {},
    types: [],
    imageUrl: null,
    minimized: false,
  };
  componentConfig = {
    postUrl: this.context.state.setting.uploadURL + "api/upload/file",
  };

  downloadAs = (url, name) => {
    Axios.get(url, {
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      responseType: "blob",
    })
      .then((response) => {
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(response.data);
        a.href = url;
        a.download = name;
        a.click();
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  djsConfig = {
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
      console.log(error);
      if (error != "" && error != null) {
        this.context.state.showCodeMessage(error.message, "error");
      }
    },
    success: (file, response, data) => {
      console.log("success");
      if (file.status === "success") {
        this.context.state.showCodeMessage(
          "File uploaded successfully .",
          "success"
        );
        itemImage(this.props.id, {
          file: response.items.file,
          original: response.items.original,
        })
          .then((res) => {
            this.loadData();
          })
          .catch((errors) => {
            this.context.state.handelError(errors);
          });
      } else {
        this.context.state.showCodeMessage(
          "Error while uploading file .",
          "error"
        );
      }
    },
  };
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    console.log(1111);
    itemRecord(this.props.id)
      .then((res) => {
        this.setState({
          items:
            res.items.mobile === true
              ? res.items.sub_item_type.item_type_files
              : res.items.item_images,
          item: res.items,
        });
      })
      .catch((errors) => {
        this.context.state.handelError(errors);
      });
  };
  render() {
    return (
      <Fragment>
        {this.state.imageUrl !== null ? (
          <Lightbox
            onClose={() => {
              this.setState({ imageUrl: null });
            }}
            image={this.state.imageUrl}
          ></Lightbox>
        ) : null}
        <div className="arabic model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
          <div className="bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                الصور
              </h3>
              <div className="mt-5 ">
                <ScrollArea
                  style={{
                    overflow: "hidden",
                    height: "120px",
                  }}
                >
                  <div className="overflow-hidden pb-2/3">
                    {this.state.items
                      .filter((item) => {
                        return (
                          ["png", "jpg", "gif"].indexOf(
                            item.file.name.split(".")[1]
                          ) >= 0
                        );
                      })
                      .map((item) => {
                        return (
                          <div
                            onClick={() => {
                              if (
                                ["png", "jpg", "jpeg", "gif"].indexOf(
                                  item.file.name.split(".")[1]
                                ) != -1
                              ) {
                                console.log("Image");
                                this.setState({
                                  imageUrl: `${
                                    process.env.NODE_ENV !== "production"
                                      ? "http://localhost:8000/"
                                      : "/"
                                  }static/data/${item.file.name}`,
                                });
                              } else {
                                this.downloadAs(
                                  `${
                                    process.env.NODE_ENV !== "production"
                                      ? "http://localhost:8000/"
                                      : "/"
                                  }api/download/${item.file.name}`,
                                  item.file.title +
                                    "." +
                                    item.file.name.split(".")[1]
                                );
                              }
                            }}
                            className="w-20  text-center cursor-pointer m-2 float-left h-20"
                          >
                            <img
                              key={item.id}
                              className="   mx-1 object-cover w-20  shadow-lg rounded-lg"
                              src={
                                ["png", "jpg", "gif"].indexOf(
                                  item.file.name.split(".")[1]
                                ) >= 0
                                  ? `${
                                      process.env.NODE_ENV !== "production"
                                        ? "http://localhost:8000/"
                                        : "/"
                                    }static/data/${item.file.name}`
                                  : `/static/images/file.png`
                              }
                              alt=""
                            />
                            <span>{item.file.title}</span>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              </div>

              <h3 className="text-lg leading-6 font-medium text-gray-900">
                الوثائق
              </h3>
              <div className="mt-5 ">
                <ScrollArea
                  style={{
                    overflow: "hidden",
                    height: "120px",
                  }}
                >
                  <div className="overflow-hidden pb-2/3">
                    {this.state.items
                      .filter((item) => {
                        return (
                          ["png", "jpg", "gif"].indexOf(
                            item.file.name.split(".")[1]
                          ) == -1
                        );
                      })
                      .map((item) => {
                        return (
                          <div
                            onClick={() => {
                              this.downloadAs(
                                `${
                                  process.env.NODE_ENV !== "production"
                                    ? "http://localhost:8000/"
                                    : "/"
                                }api/download/${item.file.name}`,
                                item.file.title +
                                  "." +
                                  item.file.name.split(".")[1]
                              );
                            }}
                            className="w-20  text-center cursor-pointer m-2 float-left h-30"
                          >
                            <img
                              key={item.id}
                              className=" h-20  mx-1 object-cover    shadow-lg rounded-lg"
                              src={
                                ["png", "jpg", "gif"].indexOf(
                                  item.file.name.split(".")[1]
                                ) >= 0
                                  ? `${
                                      process.env.NODE_ENV !== "production"
                                        ? "http://localhost:8000/"
                                        : "/"
                                    }api/download/${item.file.name}`
                                  : `/static/images/file.png`
                              }
                              alt=""
                            />
                            <span className="mt-4">{item.file.title}</span>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              </div>

              {this.state.item.mobile === false ? (
                <div className="mt-5">
                  <DropzoneComponent
                    className="mt-3"
                    config={this.componentConfig}
                    djsConfig={this.djsConfig}
                  >
                    <div className="mt-2 sm:mt-0 sm:col-span-3">
                      <div className="max-w-lg  justify-center px-6  pb-15 pt-5 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <p className="mt-1 text-sm text-gray-600">
                            <button
                              type="button"
                              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                            >
                              انقر لتحديد الملف
                            </button>{" "}
                            او قم بإسقاط الملفات هنا للتحميل
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG , JPG up to 24MB
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
                    {this.state.errors.file ? (
                      <Error message={this.state.errors.file} />
                    ) : null}
                  </DropzoneComponent>
                </div>
              ) : null}
              <div className="mt-5  flex flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    this.props.toggleImages(0);
                  }}
                  className=" inline-flex items-center px-3   py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150"
                >
                  الغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
ImagesModel.contextType = AppContext;
export default ImagesModel;
