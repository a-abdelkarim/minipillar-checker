import React, { Component } from "react";

import AppContext from "../../contexts/AppContext";
// import { zoneSearch } from "../../services/zones";

class SearchBar extends Component {
  state = {
    item: {},
    items: {
      sites: [],
      items: [],
    },
    showResults: false,
    errors: {},
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (
        this.state.item.search.indexOf(",") >= 0 &&
        this.state.item.search.indexOf(".") >= 0
      ) {
        var center = this.state.item.search.split(",");
        this.context.state.viewer.getView().setCenter(center);
        this.context.state.viewer.getView().setZoom(14);
      } else {
        zoneSearch({
          search: this.state.item.search, // send search value
        })
          .then((res) => {
            //update state and save the data
            this.setState({
              showResults: true,
              items: res.items,
            });

            if (res.items.sites.length == 0 && res.items.items.length == 0) {
              this.autoCloseSearch();
            }
          })
          .catch((error) => {
            this.context.state.handelError(error);
          });
      }
    }
  };

  handelchange = (e) => {
    let temp = this.state.item;
    temp[e.target.name] = e.target.value;

    let error = this.state.errors;
    error[e.target.name] = null;

    this.setState({ item: temp, errors: error });
  };
  autoCloseSearch = () => {
    setTimeout(() => {
      this.setState({
        showResults: false,
      });
    }, 3000);
  };
  openSearch = (type, value) => {
    this.setState({
      showResults: false,
    });
    if (type === "site") {
      this.context.state.dataSources.siteDataSource.forEachFeature(
        (feature) => {
          if (feature.itemId === value.id) {
            let extent = feature.getGeometry().getExtent();
            this.context.state.viewer.getView().fit(extent);
            this.props.fetchItems(value.id);
          }
        }
      );
    }

    if (type === "item") {
      this.context.state.dataSources.siteDataSource.forEachFeature(
        (feature) => {
          if (feature.itemId === value.site_id) {
            let extent = feature.getGeometry().getExtent();
            this.context.state.viewer.getView().fit(extent);
            this.props.fetchItems(value.site_id);
          }
        }
      );
    }
  };

  render() {
    return (
      <div className=" pt-2 fixed w-1/4 z-10  ml-20 mt-2 mx-auto text-gray-600">
        <input
          autoComplete="off"
          aria-autocomplete="none"
          onKeyDown={this.handleKeyDown}
          onChange={this.handelchange}
          className="border-2 w-full  border-gray-300 bg-white h-10 px-5 pr-16 rounded text-sm focus:outline-none"
          type="search"
          name="search"
          placeholder="Search"
        />
        <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
          <svg
            className="text-gray-600 h-4 w-4 fill-current"
            viewBox="0 0 56.966 56.966"
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
        {this.state.showResults === true ? (
          <div className="border bg-white mt-2 border-gray-200 rounded  shadow-sm divide-y divide-gray-200">
            <div className="pt-6 pb-6 px-6">
              <ul className="  space-y-4">
                {this.state.items.sites.map((site) => {
                  return (
                    <li
                      key={site.id}
                      onClick={() => {
                        this.openSearch("site", site);
                      }}
                      className="flex space-x-3"
                    >
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                        x-description="Heroicon name: check"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className=" cursor-pointer text-sm leading-5  text-gray-700">
                        {site.name}
                      </span>
                    </li>
                  );
                })}

                {this.state.items.items.map((item) => {
                  return (
                    <li
                      key={item.id}
                      onClick={() => {
                        this.openSearch("item", item);
                      }}
                      className="flex space-x-3"
                    >
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                        x-description="Heroicon name: check"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className=" cursor-pointer text-sm leading-5  text-gray-700">
                        {item.site.name} - {item.name}
                      </span>
                    </li>
                  );
                })}

                {this.state.items.sites.length == 0 &&
                this.state.items.items.length == 0 ? (
                  <li className="flex space-x-3">
                    <span className=" cursor-pointer text-sm leading-5  text-gray-700">
                      لا يوجد نتائج للبحث
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
SearchBar.contextType = AppContext;
export default SearchBar;
