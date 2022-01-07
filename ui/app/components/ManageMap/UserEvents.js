import React, { Component, Fragment } from "react";
import AppContext from "../../contexts/AppContext";
import ScrollArea from "react-scrollbar";
import DeleteModal from "../Utilities/Modals/DeleteModal";
import { eventDelete, userEvents } from "../../services/events";
import EventsModal from "./EventsModal";
import { confidenceText, severityText } from "./EventsModal";
import EventsAreaModal from "./EventsAreaModal";

class UserEvents extends Component {
  state = {
    selectedId: 0,
    searchQuery: [],
    filterQuery: [],
    orderQuery: { type: "id", order: false },
    page: 1,
    pages: 1,
    item: {},
    items: [],
    imageUrl: null,
    showModel: false,
    showInfo: false,
    showOtherEventModal: false,
    user: JSON.parse(localStorage.getItem("user")),
    pickCoordinate: false,
  };
  componentDidMount() {
    this.refresh();
  }

  delete = () => {
    //back-end // delete transit //
    eventDelete(this.state.selectedId)
      .then((res) => {
        this.refresh();
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    //hide window
    this.toggleDelete();
  };

  toggleDelete = (id) => {
    this.setState({
      selectedId: id,
      showDelete: !this.state.showDelete,
    });
  };
  refresh = () => {
    userEvents()
      .then((res) => {
        this.setState({
          items: res.items,
        });
      })
      .catch((error) => this.context.state.handelError(error));
  };

  toggleModal = (selectedId) => {
    this.setState({
      selectedId: selectedId,
      showModel: !this.state.showModel,
    });
  };

  toggleOtherEvent = (selected) => {
    this.setState({
      id: selected,
      showOtherEventModal: !this.state.showOtherEventModal,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.id !== nextProps.id) {
      return {
        id: nextProps.id,
        site: nextProps.site,
      };
    }
    return null;
  }

  // create  pagination UI
  renderPages = () => {
    let elements = [];
    let from = this.state.page - 3 > 1 ? this.state.page - 3 : 1;
    let to =
      this.state.page + 3 < this.state.pages
        ? this.state.page + 3
        : this.state.pages;

    if (this.state.page > 3) {
      elements.push(
        <span
          key={0}
          className="-mt-px pb-3 border-t-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    for (let index = from; index <= to; index++) {
      if (index === this.state.page) {
        elements.push(
          <a
            key={index}
            className="-mt-px border-b-2 pb-3 border-blue-500 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700 transition ease-in-out duration-150"
          >
            {index}
          </a>
        );
      } else {
        elements.push(
          <a
            key={index}
            onClick={() => this.changepage(index)}
            className="cursor-pointer pb-3 -mt-px border-b-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-700 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150"
          >
            {index}
          </a>
        );
      }
    }

    if (this.state.page - 3 < this.state.pages && this.state.pages > 3) {
      elements.push(
        <span
          key={this.state.pages + 1}
          className="-mt-px pb-3 border-t-2 border-transparent pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    return elements;
  };

  hideModal = (result) => {
    this.setState({
      pickCoordinate: result,
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

        <div
          className={
            this.state.pickCoordinate
              ? "hidden"
              : `arabic fixed h-full w-full  pr-20 right-0 bottom-0 z-30 bg-black bg-opacity-50`
          }
        >
          <div className="bg-white m-20 h-auto w-auto p-5 rounded-md">
            <div className=" relative w-full flex justify-between items-center flex-wrap sm:flex-no-wrap">
              <div className="w-full">
                <h3 className="text-lg leading-6 font-bold text-gray-900">
                  الاحداث
                </h3>
                {this.state.user.type != "viewer" ? (
                  <p className="mt-1 text-sm leading-5 text-gray-700">
                    عرض كل الاحدات المتعلقة بالمستخدم{" "}
                  </p>
                ) : null}
              </div>

              <button
                onClick={() => {
                  this.props.close(null, 0);
                }}
                type="button"
                className=" absolute p-2 z-30 left-0 border border-gray-300 rounded-full text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
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
            </div>

            <ScrollArea
              style={{
                overflow: "hidden",
                height: "400px",
              }}
            >
              <div className=" mt-5    flex flex-col">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="align-middle inline-block min-w-full   overflow-hidden sm:rounded-lg border-b border-gray-200">
                    <table className="arabic min-w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            العنوان
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            النوع
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            الثقة
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            التارخ
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            المستخدم
                          </th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider"></th>
                          <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-900 uppercase tracking-wider">
                            الوظائف
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {this.state.items.map((item, index) => (
                          <tr
                            className="hover:bg-gray-100 "
                            flag={item.flag}
                            key={item.id}
                          >
                            <td className="px-4 py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              <div className="absolute flex -mt-3 items-center h-5">
                                {item.id}
                              </div>
                            </td>
                            <td className="px-4 relative flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              <img
                                className="flex-shrink-0 h-6 w-6 rounded-full absolute"
                                src={`/static/icons/${item.event_type.icon.file}`}
                              ></img>
                              <span className="mr-8">{item.title}</span>
                            </td>

                            <td className="px-4  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {item.event_type.name}
                            </td>
                            <td className="px-4  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {confidenceText[item.confidence]}
                            </td>
                            <td className="px-4  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {item.date}
                            </td>
                            <td className="px-4  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              {item.user.first_name}
                            </td>
                            <td className="px-4  flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                              <div className=" grid grid-cols-3 ">
                                <svg
                                  onClick={() => {
                                    this.props.selectEvent(item.id);
                                  }}
                                  className="w-4  cursor-pointer flex flex-col"
                                  enableBackground="new 0 0 48 48"
                                  version="1.1"
                                  viewBox="0 0 48 48"
                                >
                                  <g id="Expanded">
                                    <g>
                                      <g>
                                        <path d="M23,48.049c-0.147,0-0.294-0.032-0.43-0.097l-21-10C1.222,37.786,1,37.435,1,37.049v-31c0-0.343,0.176-0.662,0.466-0.846     C1.755,5.02,2.12,4.999,2.43,5.146L23,14.941l20.57-9.796c0.31-0.146,0.673-0.126,0.963,0.058C44.824,5.387,45,5.706,45,6.049v31     c0,0.386-0.222,0.737-0.57,0.903l-21,10C23.294,48.017,23.147,48.049,23,48.049z M3,36.417l20,9.524l20-9.524V7.633l-19.57,9.319     c-0.271,0.129-0.588,0.129-0.859,0L3,7.633V36.417z" />
                                      </g>
                                      <g>
                                        <path d="M23,12.204L5.567,3.903C5.068,3.665,4.857,3.068,5.094,2.57c0.238-0.499,0.834-0.708,1.333-0.474L23,9.989l16.573-7.893     c0.5-0.234,1.095-0.025,1.333,0.474c0.237,0.498,0.026,1.095-0.473,1.333L23,12.204z" />
                                      </g>
                                      <g>
                                        <rect
                                          height="31"
                                          width="2"
                                          x="22"
                                          y="16.049"
                                        />
                                      </g>
                                    </g>
                                  </g>
                                </svg>

                                {item.report !== null ? (
                                  <svg
                                    onClick={() => {
                                      window.open(
                                        `${
                                          process.env.NODE_ENV !== "production"
                                            ? "http://localhost:8000/"
                                            : "/"
                                        }static/data/${item.report.name}`
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
                                ) : null}
                                {item.image !== null ? (
                                  <svg
                                    onClick={() => {
                                      this.setState({
                                        imageUrl: `${
                                          process.env.NODE_ENV !== "production"
                                            ? "http://localhost:8000/"
                                            : "/"
                                        }static/data/${item.image.name}`,
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
                                ) : null}
                              </div>
                            </td>

                            <td className="px-4 py-2 whitespace-no-wrap text-right border-b border-gray-200 text-xs leading-5 font-medium">
                              {this.context.state.delete &&
                              item.event_type_id != 1 ? (
                                <button
                                  onClick={() => {
                                    this.toggleDelete(item.id);
                                  }}
                                  className="cursor-pointer text-blue-600  hover:text-blue-900"
                                >
                                  حذف
                                </button>
                              ) : null}
                              {this.context.state.delete &&
                              item.event_type_id != 1 ? (
                                <span className="px-2">|</span>
                              ) : null}

                              {this.context.state.update &&
                              item.event_type_id != 1 ? (
                                <button
                                  onClick={() => {
                                    this.toggleModal(item.id);
                                  }}
                                  className="cursor-pointer text-blue-600  hover:text-blue-900"
                                >
                                  تعديل
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <nav className="mt-5 bottom-0 px-4 flex items-center justify-between ">
              <div className="hidden md:flex">{this.renderPages()} </div>

              <div className="w-0 flex-1 flex justify-end">
                <div className="hidden sm:block">
                  <p className="text-sm  leading-5 text-gray-700">
                    يعرض
                    <span className="font-medium ml-1 mr-1">
                      {(this.state.page - 1) * 30 + 1}
                    </span>
                    الى
                    <span className="font-medium ml-1 mr-1">
                      {(this.state.page - 1) * 30 + 30 > this.state.total
                        ? this.state.total
                        : (this.state.page - 1) * 30 + 30}
                    </span>
                    من
                    <span className="font-medium ml-1 mr-1">
                      {this.state.total}
                    </span>
                    اجمالى
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {this.state.showModel ? (
          <EventsAreaModal
            title={
              this.state.selectedId !== 0
                ? this.state.showInfo
                  ? "Event Information"
                  : "تعديل الحدث"
                : "إضافة حدث"
            }
            id={this.state.selectedId}
            close={this.toggleModal}
            refresh={this.refresh}
            update={this.state.selectedId !== 0}
            eventId={this.props.eventId}
            eventType={this.props.eventType}
            toggleInfo={this.toggleInfo}
            hideParentModal={this.hideModal}
          />
        ) : null}

        {this.state.showDelete ? (
          <DeleteModal
            title="حذف الحدث"
            hide={this.toggleDelete}
            action={this.delete}
          >
            بمجرد حذف الحدث ، ستفقد جميع البيانات المرتبطة به.
          </DeleteModal>
        ) : null}
      </Fragment>
    );
  }
}
UserEvents.contextType = AppContext;
export default UserEvents;
