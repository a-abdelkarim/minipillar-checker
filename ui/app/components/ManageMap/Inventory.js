import React, { Component, Fragment } from "react";
import ScrollArea from "react-scrollbar";

class Inventory extends Component {
  state = {
    items: [],
    orderQuery: { type: "id", order: false },
    showModal: false,
  };

  componentDidMount() {
    this.setState({
      items: this.props.items,
    });
  }

  renderOrder = (type) => {
    if (type !== this.state.orderQuery.type) {
      return (
        <svg
          alt="order"
          onClick={() => this.addOrder(type)}
          className="w-3 orderLocation mr-2 cursor-pointer float-left order"
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
              className="w-3 orderLocation mr-2 cursor-pointer float-left order"
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
              className="w-3 orderLocation mr-2 cursor-pointer float-left order"
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
              className="w-3 orderLocation mr-2 cursor-pointer float-left order"
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
  render() {
    return (
      <div
        style={{ width: 500 }}
        className="absolute h-full pr-20 right-0 bottom-0  pt-4 pl-4 z-20   bg-white  "
      >
        <ScrollArea
          style={{
            overflow: "hidden",
            height: " 100% ",
          }}
        >
          {/* {this.state.items
            .filter(
              (thing, index, self) =>
                index ===
                self.findIndex((t) => t.item_type.id === thing.item_type.id)
            )
            .map((type, index) => (
              <Fragment key={type.id}>
                <div
                  className={`${index != 0 ? "mt-12" : ""
                    } w-full flex justify-between items-center flex-wrap sm:flex-no-wrap`}
                >
                  <div className="">
                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                      {type.item_type.name}
                    </h3>
                  </div>
                </div>

                <div className=" mt-2    flex flex-col">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full   overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="arabic min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-bold text-gray-700 uppercase tracking-wider">
                              {this.renderOrder("title")}
                              الاسم
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {this.state.items
                            .filter(
                              (item) => item.item_type_id === type.item_type_id
                            )
                            .map((item) => (
                              <tr className="hover:bg-gray-100 " key={item.id}>
                                <td className="flex justify-between px-4 relative flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                                  <img
                                    className="ml-4 flex-shrink-0 h-6 w-6 rounded-full absolute"
                                    src={`/static/icons/${item.sub_item_type
                                      ? item.sub_item_type.icon.file
                                      : item.item_type.icon.file
                                      }`}
                                  ></img>
                                  <span className="mr-8">
                                    {item.sub_item_type
                                      ? item.sub_item_type.name
                                      : item.item_type.name}{" "}
                                    - {item.name}
                                  </span>
                                  <span className="mr-8">
                                    العدد : {item.count}{" "}
                                  </span>

                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))} */}
        </ScrollArea>
      </div>
    );
  }
}

export default Inventory;
