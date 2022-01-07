import React, { Component, Fragment } from "react";
import GeoJSON from "ol/format/GeoJSON.js";

import Openlayer from "./Map/Openlayer";

import { siteZone, siteRecord, siteDelete } from "../../services/sites";
import { itemRecord, itemSite, itemDelete } from "../../services/items";
import { Icon, Style } from "ol/style";

import AppContext from "../../contexts/AppContext";
import ToolBar from "./ToolBar";
import UserBar from "./UserBar";
import SearchBar from "./SearchBar";
import SiteModel from "./SiteModel";
import ItemModel from "./ItemModel";
import DeleteModal from "../Utilities/Modals/DeleteModal";
import SelectSiteEventModel from "./SelectSiteEventModel";
import SelectItemEventModel from "./SelectItemEventModel";
import Events from "./Events";
import UserSettingModel from "../Utilities/Modals/UserSettingModel";
import ImagesModel from "./ImagesModel";
import Inventory from "./Inventory";
import Location from "../Utilities/Modals/Location";
import EventLocation from "../Utilities/Modals/EventLocation";
import EventInfoModel from "./EventInfoModel";
import Analyze from "./Analyze";
import SearchItem from "./SearchItem";
import MobileItems from "./MobileItems";
import EventsAreaModal from "./EventsAreaModal";
import ViewerAnalyze from "./ViewerAnalyze";

import UserEvents from "./UserEvents";

import ManageGroups from "../ManageGroups";
import ManageAreas from "../ManageAreas";
import ManageDevices from "../ManageDevices";
class ManageMap extends Component {
  constructor() {
    super();
    this.state = {
      selectedSiteId: 0,
      selectedItemId: 0,
      selectedEventId: 0,
      showSite: false,
      showItem: false,
      showSiteInfo: false,
      showItemInfo: false,
      showEvents: false,
      showInventory: false,
      showSearchItem: false,
      eventType: null,
      eventId: 0,
      imageId: 0,
      site: {},
      sites: {},
      item: {},
      items: {},
      searchItems: {},
      showUserSetting: false,
      showImages: false,
      showLocationModal: false,
      showEventLocation: false,
      showAnalyzeForm: false,
      showMobileItems: false,
      showAddEventArea: false,
      showViewerAnalyzeForm: false,
      showReporting: false,
      showUserEvents: false,
      showGroups: false,
      showAreas: false,
      showDevices: false,
    };
  }

  // when close the component
  componentWillUnmount() {
    //remove interval
  }

  selectSite = (id) => {
    console.log(id);
    if (id === 0) {
      this.setState({
        selectedSiteId: id,
        showSiteInfo: false,
        showInventory: 0,
        site: {},
      });

      return false;
    }
    siteRecord(id)
      .then((res) => {
        this.setState({
          selectedSiteId: id,
          showSiteInfo: true,
          site: res.items,
        });
        this.fetchItems(id);
      })
      .catch((error) => {
        console.log(error);
        this.context.state.handelError(error);
      });
  };

  selectItem = (id) => {
    console.log(id);
    if (id === 0) {
      this.setState({
        selectedItemId: id,
        showItemInfo: false,
        item: {},
      });
      return false;
    }
    itemRecord(id)
      .then((res) => {
        this.setState({
          selectedItemId: id,
          showItemInfo: true,
          item: res.items,
        });
      })
      .catch((error) => {
        console.log(error);
        this.context.state.handelError(error);
      });
  };

  refresh = () => {
    this.context.state.dataSources.drawDataSource.clear();
    this.fetchSites();
  };

  clearMap = () => {
    this.context.state.dataSources.measureDataSource.clear();
    [...this.context.state.viewer.getOverlays().getArray()].forEach(
      (overlay) => {
        this.context.state.viewer.removeOverlay(overlay);
      }
    );
    this.context.state.dataSources.drawDataSource.clear();
    this.context.state.dataSources.itemDataSource.clear();
    this.context.state.dataSources.eventDataSource.clear();
    this.setState({
      showSearchItem: false,
    });
  };

  fetchSites = (id) => {
    siteZone(id)
      .then((res) => {
        this.setState({
          items: res.items,
        });

        var geojsonFormat = new GeoJSON();
        if (!id) {
          this.context.state.dataSources.siteDataSource.clear();
        }

        res.items.forEach((site) => {
          // reads and converts GeoJSon to Feature Object
          var features = geojsonFormat.readFeatures(site.geo);
          for (let index = 0; index < features.length; index++) {
            features[index].itemId = site.id;
            features[index].type = "site";
            features[index].name = site.name;
            features[index].description = site.description;
          }
          this.context.state.dataSources.siteDataSource.addFeatures(features);
        });
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
  };

  fetchItems = (id) => {
    itemSite(id ? id : this.state.selectedSiteId)
      .then((res) => {
        this.setState({
          sites: res.items,
        });
        this.context.state.dataSources.itemDataSource.clear(0);
        res.items.forEach((item) => {
          // reads and converts GeoJSon to Feature Object

          if (Object.keys(item.geo).length >= 1) {
            let features = new GeoJSON().readFeatures(item.geo);

            let iconStyle = new Style({
              image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: `/static/icons/${
                  item.sub_item_type != null
                    ? item.sub_item_type.icon.file
                    : item.item_type.icon.file
                }`,
              }),
            });

            for (let index = 0; index < features.length; index++) {
              features[index].itemId = item.id;
              features[index].type = "item";
              features[index].name = item.name;
              features[index].description = item.description;
              features[index].setStyle(iconStyle);
            }

            this.context.state.dataSources.itemDataSource.addFeatures(features);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        this.context.state.handelError(error);
      });
  };

  componentDidMount() {
    // var user = JSON.parse(localStorage.getItem("user"));
    // if (user.type === "viewer") {
    //   setTimeout(() => {
    //     user.user_zones.forEach((zone) => {
    //       this.fetchArea(zone.zone_id);
    //       this.fetchSites(zone.zone_id);
    //     });
    //   }, 5000);
    // } else {
    //   setTimeout(() => {
    //     this.fetchArea();
    //     this.fetchSites();
    //   }, 5000);
    // }
  }

  fetchArea = (id) => {
    // areaZone(id)
    //   .then((res) => {
    //     this.setState({
    //       areas: res.items,
    //     });
    //     var geojsonFormat = new GeoJSON();
    //     res.items.forEach((area) => {
    //       try {
    //         // reads and converts GeoJSon to Feature Object
    //         var features = geojsonFormat.readFeatures(area.geo);
    //         features[0].id = area.id;
    //         features[0].type = "area";
    //         this.context.state.dataSources.areaDataSource.addFeatures(features);
    //       } catch (error) {
    //         console.log(error);
    //         console.log(area.name);
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     this.context.state.handelError(error);
    //   });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.tab !== prevState.tab) {
      return {
        tab: nextProps.match.params.tab,
      };
    }
    return null;
  }
  toggleGroups = () => {
    this.setState({
      showGroups: !this.state.showGroups,
    });
  };
  toggleAreas = () => {
    this.setState({
      showAreas: !this.state.showAreas,
    });
  };
  toggleDevices = () => {
    this.setState({
      showDevices: !this.state.showDevices,
    });
  };
  toggleSite = (id) => {
    this.context.state.dataSources.drawDataSource.clear();

    this.setState({
      selectedSiteId: id,
      showSiteInfo: false,
      showSite: !this.state.showSite,
    });
  };
  toggleUserSetting = (id) => {
    this.setState({
      showUserSetting: !this.state.showUserSetting,
    });
  };

  toggleItem = (id) => {
    this.context.state.dataSources.drawDataSource.clear();
    this.setState({
      selectedItemId: id,
      showItemInfo: false,
      showSiteInfo: false,
      showItem: !this.state.showItem,
    });
  };

  toggleEvents = (type, id) => {
    this.setState({
      eventType: type,
      eventId: id,
      showEvents: type == null ? false : !this.state.showItem,
    });
  };

  toggleInventory = (id) => {
    this.setState({
      showInventory: id === null ? false : !this.state.showInventory,
    });
  };
  toggleMobileItems = (id) => {
    this.setState({
      showMobileItems: id === null ? false : !this.state.showMobileItems,
    });
  };

  toggleImages = (id) => {
    this.setState({
      imageId: id,
      showImages: id == 0 ? false : true,
    });
  };

  toggleDeleteSite = () => {
    this.setState({
      deleteSite: !this.state.deleteSite,
    });
  };

  deleteSite = () => {
    //back-end // delete transit //
    siteDelete(this.state.selectedSiteId)
      .then((res) => {
        this.context.state.dataSources.siteDataSource.forEachFeature(
          (feature) => {
            if (feature.itemId === this.state.selectedSiteId) {
              this.context.state.dataSources.siteDataSource.removeFeature(
                feature
              );
            }
          }
        );
        this.setState({
          showSiteInfo: false,
          sites: this.state.sites.filter((site) => {
            site.id !== this.state.selectedId;
          }),
        });
        this.toggleDeleteSite();
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    //hide window
  };

  toggleDeleteItem = () => {
    this.setState({
      deleteItem: !this.state.deleteItem,
    });
  };

  deleteItem = () => {
    //back-end // delete transit //
    itemDelete(this.state.selectedItemId)
      .then((res) => {
        this.context.state.dataSources.itemDataSource.forEachFeature(
          (feature) => {
            if (feature.itemId === this.state.selectedItemId) {
              this.context.state.dataSources.itemDataSource.removeFeature(
                feature
              );
            }
          }
        );
        this.setState({
          showItemInfo: false,
          items: this.state.items.filter((item) => {
            item.id !== this.state.selectedId;
          }),
        });
        this.toggleDeleteItem();
      })
      .catch((error) => {
        this.context.state.handelError(error);
      });
    //hide window
    this.toggleDelete();
  };

  toggleLocation = () => {
    this.setState({
      showLocationModal: !this.state.showLocationModal,
    });
  };
  toggleEventLocation = (searchItems) => {
    console.log(searchItems);
    if (searchItems === undefined) {
      this.setState({
        showEventLocation: !this.state.showEventLocation,
        showSearchItem: false,
      });
    } else {
      this.setState({
        showEventLocation: false,
        showSearchItem: true,
        searchItems: searchItems,
      });
    }
  };

  toggleShowSearchItem = (searchItems) => {
    console.log(searchItems);
    if (searchItems === undefined) {
      this.setState({
        showAnalyzeForm: false,
        showViewerAnalyzeForm: false,
        showSearchItem: false,
      });
    } else {
      this.setState({
        showSearchItem: true,
        showAnalyzeForm: false,
        showViewerAnalyzeForm: false,
        searchItems: searchItems,
      });
    }
  };

  toggleAnalyze = () => {
    this.setState({
      showAnalyzeForm: !this.state.showAnalyzeForm,
    });
  };
  toggleViewerAnalyze = () => {
    this.setState({
      showViewerAnalyzeForm: !this.state.showViewerAnalyzeForm,
    });
  };
  toggleAddEventArea = () => {
    this.setState({
      showAddEventArea: !this.state.showAddEventArea,
    });
  };
  toggleViewReporting = () => {
    this.setState({
      showReporting: !this.state.showReporting,
    });
  };

  selectEvent = (selectedEventId) => {
    this.setState({
      selectedEventId: selectedEventId,
      showEventInfo: !this.state.showEventInfo,
    });
  };

  showUserEventsHandler = () => {
    this.setState({
      showUserEvents: !this.state.showUserEvents,
    });
  };

  renderReport = () => {
    console.log(this.context.state.reportName);
    switch (this.context.state.reportName) {
      case "report:EventsByMonth":
        return <EventsByMonthReport></EventsByMonthReport>;
        break;
      case "model:EventsByMonth":
        return (
          <EventsByMonthModel
            close={this.context.state.hideReportModel}
          ></EventsByMonthModel>
        );
        break;

      case "model:EventsByDate":
        return (
          <EventsByDateModel
            close={this.context.state.hideReportModel}
          ></EventsByDateModel>
        );
        break;
      case "report:EventsByDate":
        return <EventsByDateReport></EventsByDateReport>;
        break;

      case "model:EventsByDateLocation":
        return (
          <EventsByDateLocationModel
            close={this.context.state.hideReportModel}
          ></EventsByDateLocationModel>
        );
        break;
      case "report:EventsByDateLocation":
        return <EventsByDateLocationReport></EventsByDateLocationReport>;
        break;

      case "model:SiteByDate":
        return (
          <SiteByDateModel
            close={this.context.state.hideReportModel}
          ></SiteByDateModel>
        );
        break;
      case "report:SiteByDate":
        return <SiteByDateReport></SiteByDateReport>;
      default:
        break;
    }
  };

  // render  component
  render() {
    return (
      <div className="p-0 w-full h-full absolute inset-0 flex items-center justify-center layer-3">
        {this.renderReport()}
        <div id="loadinBar" className="w-full fixed header-bar widthTransition">
          <span></span>
        </div>
        <div className="relative flex flex-row  w-full h-full ">
          <div
            className={`bg-secondary border-gray-400 border-r w-full h-full `}
          >
            {this.state.showGroups ? (
              <ManageGroups close={this.toggleGroups} />
            ) : null}
            {this.state.showAreas ? (
              <ManageAreas close={this.toggleAreas} />
            ) : null}

            {this.state.showDevices ? (
              <ManageDevices close={this.toggleDevices} />
            ) : null}
            {this.state.showEventInfo ? (
              <EventInfoModel
                id={this.state.selectedEventId}
                hide={this.selectEvent}
              />
            ) : null}
            {this.state.showEventLocation ? (
              <EventLocation close={this.toggleEventLocation} />
            ) : null}
            {this.state.showEvents ? (
              <Events
                hide={this.toggleEvents}
                selectEvent={this.selectEvent}
                eventType={this.state.eventType}
                eventId={this.state.eventId}
                items={this.state.sites}
              ></Events>
            ) : null}
            {this.state.showInventory ? (
              <Inventory
                id={this.state.selectedSiteId}
                items={this.state.sites}
              />
            ) : null}
            {this.state.showMobileItems ? (
              <MobileItems
                items={this.state.sites}
                id={this.state.selectedSiteId}
              />
            ) : null}
            {this.state.showSearchItem ? (
              <SearchItem searchItem={this.state.searchItems} />
            ) : null}
            {this.state.showImages ? (
              <ImagesModel
                toggleImages={this.toggleImages}
                id={this.state.imageId}
              ></ImagesModel>
            ) : null}
            {this.state.deleteItem ? (
              <DeleteModal
                title="حذف العنصر"
                hide={this.toggleDeleteItem}
                action={this.deleteItem}
              >
                بمجرد حذف هذا العنصر ، ستفقد جميع البيانات المرتبطة به.
              </DeleteModal>
            ) : null}
            {this.state.showUserSetting ? (
              <UserSettingModel
                hide={this.toggleUserSetting}
              ></UserSettingModel>
            ) : null}
            {this.state.deleteSite ? (
              <DeleteModal
                title="حذف الموقع"
                hide={this.toggleDeleteSite}
                action={this.deleteSite}
              >
                بمجرد حذف هذا الموقع ، ستفقد جميع البيانات المرتبطة به.
              </DeleteModal>
            ) : null}
            {this.state.showSite === true ? (
              <SiteModel
                title={
                  this.state.selectedSiteId !== 0
                    ? "تحديث الموقع"
                    : "إنشاء موقع"
                }
                refresh={this.refresh}
                id={this.state.selectedSiteId}
                update={this.state.selectedSiteId !== 0}
                close={this.toggleSite}
                selectedSiteId={this.state.selectedSiteId}
              ></SiteModel>
            ) : null}
            {this.state.showItem === true ? (
              <ItemModel
                site={this.state.selectedSiteId}
                title={
                  this.state.selectedItemId !== 0
                    ? "تحديث العنصر"
                    : "إنشاء عنصر"
                }
                refresh={this.fetchItems}
                id={this.state.selectedItemId}
                update={this.state.selectedItemId !== 0}
                close={this.toggleItem}
                selectedItemId={this.state.selectedItemId}
              ></ItemModel>
            ) : null}
            <ToolBar
              refresh={this.refresh}
              clearMap={this.clearMap}
              toggleGroups={this.toggleGroups}
              groupState={this.state.showGroups}
              toggleAreas={this.toggleAreas}
              areaState={this.state.showAreas}
              toggleDevices={this.toggleDevices}
              deviceState={this.state.showDevices}
            ></ToolBar>
            {this.state.showSiteInfo === true ? (
              <SelectSiteEventModel
                toggleEvents={this.toggleEvents}
                toggleInventory={this.toggleInventory}
                toggleMobileItems={this.toggleMobileItems}
                toggleItem={this.toggleItem}
                toggleDeleteSite={this.toggleDeleteSite}
                toggleSite={this.toggleSite}
                selectSite={this.selectSite}
                id={this.state.selectedSiteId}
                site={this.state.site}
              ></SelectSiteEventModel>
            ) : null}
            {this.state.showItemInfo === true ? (
              <SelectItemEventModel
                toggleImages={this.toggleImages}
                toggleEvents={this.toggleEvents}
                toggleItem={this.toggleItem}
                toggleDeleteItem={this.toggleDeleteItem}
                id={this.state.selectedItemId}
                item={this.state.item}
              ></SelectItemEventModel>
            ) : null}
            {this.state.showLocationModal ? (
              <Location close={this.toggleLocation} />
            ) : null}
            {this.state.showAnalyzeForm ? (
              <Analyze
                clearMap={this.clearMap}
                close={this.toggleShowSearchItem}
              />
            ) : null}
            {this.state.showViewerAnalyzeForm ? (
              <ViewerAnalyze
                clearMap={this.clearMap}
                close={this.toggleShowSearchItem}
              />
            ) : null}
            <SearchBar fetchItems={this.fetchItems}></SearchBar>
            <UserBar toggleUserSetting={this.toggleUserSetting}></UserBar>
            {this.state.showAddEventArea ? (
              <EventsAreaModal
                close={this.toggleAddEventArea}
              ></EventsAreaModal>
            ) : null}
            {this.state.showReporting ? (
              <ReportsMenu toggleViewReporting={this.toggleViewReporting} />
            ) : null}
            {this.state.showUserEvents ? (
              <UserEvents
                close={this.showUserEventsHandler}
                selectEvent={this.selectEvent}
              />
            ) : null}
            <Openlayer
              selectEvent={this.selectEvent}
              selectItem={this.selectItem}
              selectSite={this.selectSite}
            ></Openlayer>
          </div>
        </div>
      </div>
    );
  }
}
ManageMap.contextType = AppContext;
export default ManageMap;
