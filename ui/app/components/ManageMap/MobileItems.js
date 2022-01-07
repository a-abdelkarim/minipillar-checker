import React, { Component, Fragment } from "react";
import DeleteModal from "../Utilities/Modals/DeleteModal";
import ScrollArea from "react-scrollbar";
import UpdateCount from "./UpdateCount";
import AddMobileItem from "./AddMobileItem";

class MobileItems extends Component {
  state = {
    items: [],
    orderQuery: { type: "id", order: false },
    showModal: false,
    showAddModal: false,
    index: null,
  };

  // componentDidMount() {
  //   if (this.props.update) {
  //     this.setState({
  //       items: this.props.items,
  //     });
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(prevState.items) !== JSON.stringify(nextProps.items)) {
      return {
        items: nextProps.items,
      };
    }
    return null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps.items);
  //   console.log(prevState.items);
  //   if (prevProps.items.length !== prevState.items.length) {
  //     this.setState({
  //       items: prevProps.items,
  //     });
  //   }
  // }

  toggleEditModal = (count, index) => {
    this.setState({
      index,
      count: count,
      showModal: !this.state.showModal,
    });
  };
  toggleAddModal = () => {
    let newIndex = this.state.items.length;
    this.setState({
      index: newIndex,
      showAddModal: !this.state.showAddModal,
    });
  };
  toggleClose = () => {
    this.setState({
      showAddModal: !this.state.showAddModal,
    });
  };
  toggleDelete = (index) => {
    this.setState({
      index,
      showDelete: !this.state.showDelete,
    });
  };
  saveCount = (count) => {
    let temp = this.state.items;
    temp[this.state.index].count = count;
    this.setState({
      // items: temp,
    });

    this.props.getState(this.state.items);
  };
  create = (newItem) => {
    console.log(newItem[0].sub_item_type.id);
    if (
      this.state.items.filter((item, index) => {
        return item.sub_item_type.id === newItem[0].sub_item_type.id;
      }).length > 0
    ) {
      let index = this.state.items.findIndex(
        (item) => item.sub_item_type.id === newItem[0].sub_item_type.id
      );
      this.state.items[index].count += newItem[0].count;
      this.setState(
        {
          showAddModal: !this.state.showAddModal,
        },
        () => {
          this.props.getState([...this.state.items]);
        }
      );
    } else {
      this.setState(
        {
          showAddModal: !this.state.showAddModal,
        },
        () => {
          this.props.getState([...this.state.items, ...newItem]);
        }
      );
    }
    // if(item.sub_item_type.id){

    // }
  };
  delete = () => {
    let temp = this.state.items;
    temp.splice(this.state.index, 1);
    this.setState({
      showDelete: !this.state.showDelete,
      // items: temp,
    });
    this.props.getState(temp);
  };

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
      <Fragment>
        <div
          // style={{ width: 500 }}
          className=" h-full pr-20 left-0 bottom-0  pt-4 pl-4 z-20   bg-white  "
        >
          <ScrollArea
            style={{
              overflow: "hidden",
              height: " 100% ",
            }}
          >
            {this.state.items
              .filter(
                (thing, index, self) =>
                  index ===
                  self.findIndex((t) => t.item_type.id === thing.item_type.id)
              )
              .map((type, index) =>
                type.item_type.mobile ? (
                  <Fragment key={type.id}>
                    <div
                      className={`${
                        index != 0 ? "mt-12" : ""
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
                                <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                                  {this.renderOrder("title")}
                                  الاسم
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {this.state.items.map((item, index) =>
                                item.item_type.id === type.item_type.id ? (
                                  <tr
                                    className="hover:bg-gray-100 "
                                    key={item.id}
                                  >
                                    <td className="flex justify-between px-4 relative flag py-2 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                                      <img
                                        className="ml-4 flex-shrink-0 h-6 w-6 rounded-full absolute"
                                        src={`/static/icons/${
                                          item.sub_item_type
                                            ? item.sub_item_type.icon.file
                                            : item.item_type.icon.file
                                        }`}
                                      ></img>
                                      <span className="mr-8">
                                        {item.sub_item_type
                                          ? item.sub_item_type.name
                                          : item.item_type.name}
                                      </span>
                                      <span className="mr-8">
                                        العدد : {item.count}{" "}
                                      </span>
                                      <span className="mr-8">
                                        <button
                                          onClick={() => {
                                            this.toggleDelete(index);
                                          }}
                                          className="cursor-pointer text-blue-600  hover:text-blue-900"
                                        >
                                          حذف
                                        </button>
                                        <span className="px-2">|</span>
                                        <button
                                          onClick={() => {
                                            this.toggleEditModal(
                                              item.count,
                                              index
                                            );
                                          }}
                                          className="cursor-pointer text-blue-600  hover:text-blue-900"
                                        >
                                          تعديل
                                        </button>
                                      </span>
                                    </td>
                                  </tr>
                                ) : null
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : null
              )}
            <button
              onClick={() => {
                this.toggleAddModal();
              }}
              className="mt-3 top-0 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
            >
              إضافه{" "}
            </button>
          </ScrollArea>
        </div>
        {this.state.showDelete ? (
          <DeleteModal
            title="حذف الحدث الفرعى "
            hide={this.toggleDelete}
            action={this.delete}
          >
            بمجرد حذف الحدث الفرعى ، ستفقد جميع البيانات المرتبطة به.
          </DeleteModal>
        ) : null}
        {this.state.showModal ? (
          <UpdateCount
            close={this.toggleEditModal}
            count={this.state.count}
            index={this.state.id}
            save={this.saveCount}
          />
        ) : null}
        {this.state.showAddModal ? (
          <AddMobileItem
            create={this.create}
            title="إضافة عنصر فرعى"
            close={this.toggleClose}
            index={this.state.index}
            site_id={this.props.site_id}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default MobileItems;
