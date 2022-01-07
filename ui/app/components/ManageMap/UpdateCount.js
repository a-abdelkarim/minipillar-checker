import React, { Component } from 'react'

class UpdateCount extends Component {
    state = {
        item: {},
        errors: {},
        areas: [],
        minimized: false,
    };


    componentDidMount() {
        this.setState({
            item: { count: this.props.count }
        })
    }

    save = () => {
        this.props.save(this.state.item.count)
        this.props.close()
    }

    handelchange = (e) => {
        // throw new Error("s")
        let temp = this.state.item;
        temp[e.target.name] = e.target.value;

        let error = this.state.errors;
        error[e.target.name] = null;

        this.setState({ item: temp, errors: error });
    };
    render() {
        return (
            <div className="model-dark-z bg-opacity-25 bg-input fixed inset-0 flex items-center justify-center layer-4">
                <div className="arabic bg-white max-w-3xl mx-auto w-2/6 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-bold text-gray-900">
                            تحديث العدد
                        </h3>
                        <div className="mt-2 max-w-xl text-sm leading-5 text-gray-700">
                            <div className="  sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    العدد
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
                                        <input
                                            autocomplete="off"
                                            type="text"
                                            id="count"
                                            name="count"
                                            onChange={this.handelchange}
                                            className="form-input border px-2 py-2 block w-full rounded-md sm:text-sm sm:leading-5"
                                            value={this.state.item.count}
                                        />
                                    </div>
                                    {this.state.errors.count ? (
                                        <Error message={this.state.errors.count} />
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
                                حفظ
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
        )
    }
}

export default UpdateCount
