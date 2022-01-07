import React, { Component } from "react";
import { eventRecord } from "../../services/events";
import Select from "react-select";
class EventInfo extends Component {
  state = {
    item: { event_type: {} },
    errors: {},
  };
  componentDidMount() {
    eventRecord(this.props.id)
      .then((res) => {
        this.setState({
          item: res.items,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  }
  render() {
    return (
      <div className="model-dark z-20 bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
        <div className="bg-white max-w-3xl mx-auto w-5/6 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-bold text-gray-900">
              {this.props.title}
            </h3>

            <div className="mt-2  text-sm leading-5 text-gray-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.title}
                  />
                  {this.state.errors.title ? (
                    <Error message={this.state.errors.title} />
                  ) : null}
                </div>
                <div className="flex flex-col ">
                  <label className="text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    Image
                  </label>
                  <select
                    type="text"
                    className="form-input border px-2 py-2  w-full rounded-md sm:text-sm sm:leading-5"
                    name="image_id"
                    value={this.state.item.image_id}
                    onChange={(e) => this.handelchange(e)}
                  >
                    <option>select image</option>
                  </select>
                </div>
              </div>

              <div className="mt-1  grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="event_type_id"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Event type
                  </label>

                  <select
                    type="text"
                    id="event_type_id"
                    name="event_type_id"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.event_type_id}
                  >
                    <option value="">Select Event type</option>
                    {this.state.eventTypes.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>

                  {this.state.errors.event_type_id ? (
                    <Error message={this.state.errors.event_type_id} />
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                    Report
                  </label>
                  <select
                    type="text"
                    name="report_id"
                    value={this.state.item.report_id}
                    onChange={(e) => this.handelchange(e)}
                    className="form-input border px-2 py-2  w-full rounded-md sm:text-sm sm:leading-5"
                  >
                    <option>Select report</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="confidence"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Confidence
                  </label>

                  <select
                    type="text"
                    id="confidence"
                    name="confidence"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.confidence}
                  >
                    <option value="">Select Confidence</option>
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
                <div className="flex flex-col">
                  <label
                    htmlFor="zoom"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Severity
                  </label>

                  <select
                    type="text"
                    id="severity"
                    name="severity"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.severity}
                  >
                    <option value="">Select Severity</option>
                    {serverity.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="zoom"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    date
                  </label>
                  <input
                    autocomplete="off"
                    type="date"
                    id="date"
                    name="date"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.date}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="zoom"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    time
                  </label>
                  <input
                    autocomplete="off"
                    type="time"
                    id="time"
                    name="time"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.time}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.longitude}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Latitude
                  </label>

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
              </div>
              <div className="grid grid-cols-1 mt-4">
                <div className="flex flex-col">
                  <Select
                    // defaultValue={[colourOptions[2], colourOptions[3]]}
                    isMulti
                    name="colors"
                    options={this.state.eventSourceTypes}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="SourceTypes"
                    onChange={this.handleMultiSelect}
                    // value={this.state.item.colors}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className=" text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Description
                  </label>
                  <textarea
                    rows="3"
                    type="text"
                    id="description"
                    name="description"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.description}
                  ></textarea>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className=" text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Extended Description
                  </label>
                  <textarea
                    rows="3"
                    type="text"
                    id="extended_description"
                    name="extended_description"
                    onChange={this.handelchange}
                    className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                    value={this.state.item.description}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="mt-5  flex flex-row-reverse">
              <button
                type="button"
                onClick={this.save}
                className=" inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
              >
                {this.props.update ? "Update " : "Add "}
              </button>
              <button
                type="button"
                onClick={() => {
                  this.props.close();
                }}
                className=" inline-flex items-center px-3 mr-5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition ease-in-out duration-150"
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

export default EventInfo;
