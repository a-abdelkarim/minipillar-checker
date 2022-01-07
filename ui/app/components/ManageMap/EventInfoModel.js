import React, { Component, Fragment } from "react";

import AppContext from "../../contexts/AppContext";
import ScrollArea from "react-scrollbar";
import { eventRecord } from "../../services/events";
import { confidence, severity } from "./EventsModal";
import Lightbox from "react-awesome-lightbox";
class EventInfoModel extends Component {
  state = {
    item: {
      user: {},
      event_type: {},
      city: {},
      area: {},
      event_sources: [],
      image: {},
      report: {},
    },
    imageUrl: null,
  };

  componentDidMount() {
    eventRecord(this.props.id)
      .then((res) => {
        let data = res.items;
        data.confidence = confidence
          .filter((item) => (item.id === data.confidence ? item.title : ""))
          .map((item) => item.title);
        data.severity = severity
          .filter((item) => (item.id === data.severity ? item.title : ""))
          .map((item) => item.title);
        console.log(data);
        this.setState({
          item: data,
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  }
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
        <div className="fixed h-full arabic bottom-0 pr-24 pl-4 py-4 z-40 w-full  bg-black bg-opacity-50   ">
          <div className="bg-white relative m-20 h-auto w-auto p-5 rounded-md">
            <button
              onClick={this.props.hide}
              type="button"
              className=" absolute p-2 z-30  ml-5 left-0 border border-gray-300 rounded-full text-sm leading-5 font-medium text-gray-900 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
            >
              <svg
                id="Outlined"
                style={{ width: 24, height: 24 }}
                viewBox="0 0 32 32"
              >
                <title />
                <g id="Fill">
                  <polygon points="28.71 4.71 27.29 3.29 16 14.59 4.71 3.29 3.29 4.71 14.59 16 3.29 27.29 4.71 28.71 16 17.41 27.29 28.71 28.71 27.29 17.41 16 28.71 4.71" />
                </g>
              </svg>
            </button>

            <ScrollArea
              style={{
                overflow: "hidden",
                height: "calc(100% - 20px )",
              }}
            >
              <div>
                <div className=" px-4 ml-auto mr-auto">
                  <div className="mt-1 ">
                    <div>
                      <h3 className="text-lg leading-6 font-bold text-gray-900">
                        <div> معلومات الحدث </div>
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
                        التاريخ : {this.state.item.date}
                      </p>

                      <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
                        بواسطة : {this.state.item.user.first_name}{" "}
                        {this.state.item.user.last_name}
                      </p>
                      <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-700">
                        في : {this.state.item.created_at}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8">
                      <div className=" grid grid-cols-3">
                        <fieldset className="flex flex-col">
                          <div className="mt-1">
                            {this.state.item.area != null ? (
                              <div className="mt-4">
                                <div className="relative flex items-start">
                                  <div className="ml-3 text-sm leading-5">
                                    <label className="font-bold text-gray-700">
                                      المنطقه
                                    </label>
                                    <p className="text-gray-700">
                                      {this.state.item.area.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {this.state.item.city != null ? (
                              <div className="mt-4">
                                <div className="relative flex items-start">
                                  <div className="ml-3 text-sm leading-5">
                                    <label className="font-bold text-gray-700">
                                      المدينة
                                    </label>
                                    <p className="text-gray-700">
                                      {this.state.item.city.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {this.state.item.movements >= 1 ? (
                              <div className="mt-4">
                                <div className="relative flex items-start">
                                  <div className="ml-3 text-sm leading-5">
                                    <label className="font-bold text-gray-700">
                                      التحركات
                                    </label>
                                    <p className="text-gray-700">
                                      {this.state.item.movements} -{" "}
                                      {this.state.item.sub_item_type.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <div className="mt-4">
                              <div className="relative flex items-start">
                                <div className="ml-3 text-sm leading-5">
                                  <label className="font-bold text-gray-700">
                                    نوع الحدث
                                  </label>
                                  <p className="text-gray-700">
                                    {this.state.item.event_type.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {this.state.item.number !== null ? (
                              <div className="mt-4">
                                <div className="relative flex items-start">
                                  <div className="ml-3 text-sm leading-5">
                                    <label className="font-bold text-gray-700">
                                      العدد
                                    </label>
                                    <p className="text-gray-700">
                                      {this.state.item.number}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <div className="mt-4">
                              <div className="relative flex items-start">
                                <div className="ml-3 text-sm leading-5">
                                  <label className="font-bold text-gray-700">
                                    تاريخ المكاتبه
                                  </label>
                                  <p className="text-gray-700">
                                    {this.state.item.event_date}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </fieldset>

                        <div className="flex flex-col">
                          <div className="mt-4">
                            <div className="ml-3 text-sm leading-5">
                              <label className="font-bold text-gray-700">
                                درجة التاكيد
                              </label>
                              <p className="text-gray-700">
                                {this.state.item.confidence}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="ml-3 text-sm leading-5">
                              <label className="font-bold text-gray-700">
                                الخطورة
                              </label>
                              <p className="text-gray-700">
                                {this.state.item.severity}
                              </p>
                            </div>
                          </div>
                          {this.state.item.event_sources.length > 0 ? (
                            <div className="mt-4">
                              <div className="relative flex items-start">
                                <div className="ml-3 text-sm leading-5">
                                  <label className="font-bold text-gray-700">
                                    مصادر الحدث
                                  </label>
                                  <p className="text-gray-700">
                                    {this.state.item.event_sources.map(
                                      (source) => {
                                        return (
                                          <span>
                                            {source.event_source_type.name} ,{" "}
                                          </span>
                                        );
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          {this.state.item.image !== null ? (
                            <div className="mt-4">
                              <div className="ml-3 text-sm leading-5">
                                <label className="font-bold text-gray-700">
                                  الصورة
                                </label>
                                <svg
                                  onClick={() => {
                                    this.setState({
                                      imageUrl: `${
                                        process.env.NODE_ENV !== "production"
                                          ? "http://localhost:8000/"
                                          : "/"
                                      }static/data/${
                                        this.state.item.image.name
                                      }`,
                                    });
                                  }}
                                  className="w-4  cursor-pointer flex flex-col"
                                  viewBox="0 0 64 64"
                                >
                                  <g>
                                    <path d="M62,63H2a1,1,0,0,1-1-1V2A1,1,0,0,1,2,1H62a1,1,0,0,1,1,1V62A1,1,0,0,1,62,63ZM3,61H61V3H3Z" />
                                    <path d="M61.25,50.66,46,33.46,32.71,46.71a1,1,0,0,1-1.49-.08L16,27.61l-13.22,17L1.21,43.39l14-18A1,1,0,0,1,16,25h0a1,1,0,0,1,.78.38L32.09,44.5l13.2-13.21A1,1,0,0,1,46,31a1,1,0,0,1,.72.33l16,18Z" />
                                    <path d="M40,29a9,9,0,1,1,9-9A9,9,0,0,1,40,29Zm0-16a7,7,0,1,0,7,7A7,7,0,0,0,40,13Z" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          ) : null}
                          {this.state.item.report !== null ? (
                            <div className="mt-4">
                              <div className="ml-3 text-sm leading-5">
                                <label className="font-bold text-gray-700">
                                  الملف
                                </label>
                                <svg
                                  onClick={() => {
                                    window.open(
                                      `${
                                        process.env.NODE_ENV !== "production"
                                          ? "http://localhost:8000/"
                                          : "/"
                                      }static/data/${
                                        this.state.item.report.name
                                      }`
                                    );
                                  }}
                                  className="w-4 cursor-pointer flex flex-col"
                                  viewBox="0 0 80 70"
                                >
                                  <g>
                                    <g>
                                      <path d="M64,20.4L45,5.1l-12.9,7.2l-6.4-6.8L5.4,5.4v59.4h69.1V20.4H64z M44.7,8.7l14.5,11.6H39.7l-5.4-5.8L44.7,8.7z M71.6,61.9    H8.4V8.4l16,0.1l14,14.8h33.1V61.9z" />
                                      <rect
                                        height="3"
                                        width="46.8"
                                        x="16.6"
                                        y="50.2"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col">
                          {this.state.item.description !== null ? (
                            <div className="mt-4">
                              <div className="ml-3 text-sm leading-5">
                                <label className="font-bold text-gray-700">
                                  الوصف
                                </label>
                                <p className="text-gray-700">
                                  {this.state.item.description}
                                </p>
                              </div>
                            </div>
                          ) : null}
                          {this.state.item.extended_description !== null ? (
                            <div className="mt-4">
                              <div className="ml-3 text-sm leading-5">
                                <label className="font-bold text-gray-700">
                                  وصف مطول
                                </label>
                                <p className="text-gray-700">
                                  {this.state.item.extended_description}
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </Fragment>
    );
  }
}
EventInfoModel.contextType = AppContext;
export default EventInfoModel;
