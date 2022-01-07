import React, { Component, Fragment } from "react";
import axios from "axios";
import OpenlayerClickHandler from "./OpenlayerClickHandler";
import { createStringXY } from "ol/coordinate.js";
import MousePosition from "ol/control/MousePosition.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Overlay from "ol/Overlay";
import { LineString, Polygon } from "ol/geom";
import { getArea, getLength } from "ol/sphere";
import Circle from "ol/geom/Circle";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile.js";
import BingMaps from "ol/source/BingMaps.js";
import { defaults as defaultControls } from "ol/control.js";
import { Vector as VectorLayer } from "ol/layer.js";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { Vector as Vectorlayer } from "ol/source.js";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js";
import { unByKey } from "ol/Observable";
//interaction
import Select from "ol/interaction/Select.js";
import Draw from "ol/interaction/Draw.js";
import Modify from "ol/interaction/Modify.js";
import Point from "ol/geom/Point";
import { OSM, Vector as VectorSource } from "ol/source";
import AppContext from "../../../../contexts/AppContext";
import { getFeatures } from "../../../../services/features";
import Feature from "ol/Feature";

export const severity = {
  severe: "شديدة",
  high: "عالى",
  medium: "متوسط",
  normal: "طبيعى",
  low: "منخفض",
};
export const confidence = {
  certain: "اكيد",
  probable: "محتمل",
  uncertain: "غير مؤكد",
};

class OpenlayerGlobe extends Component {
  state = {
    viewerLoaded: false,
    left: 0,
    right: 0,
    pixel: [],
    show: false,
  };

  sketch;

  measureTooltipElement = null;

  measureTooltip;

  getDefaultProvider(backgronds) {
    var data = [];
    for (var index in backgronds) {
      if (backgronds.hasOwnProperty(index)) {
        data.push(
          this.getProvider(backgronds[index], backgronds[index]["selected"])
        );
      }
    }
    return data;
  }

  getProvider = (backgrond, visible) => {
    let imageryProvider;

    switch (backgrond.provider) {
      case "Google":
        imageryProvider = new TileLayer({
          visible: visible,

          type: "Background",
          name: "Background" + backgrond.id,
          source: new XYZ({
            url: backgrond.link + "x={x}&y={y}&z={z}",
            format: "image/jpeg",
          }),
        });
        break;
      case "Bing maps":
        imageryProvider = new BingMaps({
          key: backgrond.code,
          imagerySet: backgrond.link,
          format: "image/jpeg",
          visible: visible,
          type: "Background",
          name: "Background" + backgrond.id,
        });
        break;
      case "xyz":
      case "XYZ":
        imageryProvider = new TileLayer({
          type: "Background",

          name: "Background" + backgrond.id,
          visible: visible,
          source: new XYZ({
            url: backgrond.link,
            format: "image/jpeg",
          }),
        });
        break;
      default:
        break;
    }
    return imageryProvider;
  };

  // draw circle on uats coordinates

  onMoveEnd = (evt) => {
    var center = evt.map.getView().getCenter();
    center = transform(center, "EPSG:3857", "EPSG:4326");
  };

  createMeasureTooltip = (map) => {
    this.measureTooltipElement = document.createElement("div");
    this.measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    map.addOverlay(this.measureTooltip);
  };

  onMouseClick = (evt) => {
    console.log(evt);
  };

  createMap = (user, imageryProvider) => {
    let mousePositionControl = new MousePosition({
      coordinateFormat: (coordinate) => {
        return [
          this.context.state.DecimaltoDMS(coordinate[0], "lon"),
          this.context.state.DecimaltoDMS(coordinate[1], "lat"),
        ];
      },
      projection: "EPSG:4326",
      className:
        "absolute pl-3 right-0  bottom-0 mr-20 mb-2 flex text-base text-black capitalize font-semibold   custom-mouse-position",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp;",
    });

    var measureDataSource = new Vectorlayer();

    var measureVectorlayer = new VectorLayer({
      source: measureDataSource,
      name: "measureLayer",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });

    var zoneDataSource = new Vectorlayer();
    var zoneVectorlayer = new VectorLayer({
      name: "zoneLayer",
      source: zoneDataSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.0)",
        }),
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.0)",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,

          fill: new Fill({
            color: "rgba(255, 255, 255, 0.0)",
          }),
        }),
      }),
    });

    var eventDataSource = new Vectorlayer();
    var eventVectorlayer = new VectorLayer({
      name: "eventLayer",
      source: eventDataSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.0)",
        }),
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.0)",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,

          fill: new Fill({
            color: "rgba(255, 255, 255, 0.0)",
          }),
        }),
      }),
    });

    var areaDataSource = new Vectorlayer();
    var areaVectorlayer = new VectorLayer({
      name: "areaLayer",
      source: areaDataSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.0)",
        }),
        stroke: new Stroke({
          color: "#ff000c",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.0)",
          }),
        }),
      }),
    });

    var siteDataSource = new Vectorlayer();
    var siteVectorlayer = new VectorLayer({
      source: siteDataSource,
      name: "siteLayer",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.0)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",

          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.0)",
          }),
        }),
      }),
    });
    var itemDataSource = new Vectorlayer();
    var itemVectorlayer = new VectorLayer({
      source: itemDataSource,
      name: "itemLayer",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.0)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.0)",
          }),
        }),
      }),
    });

    var drawDataSource = new Vectorlayer({ wrapX: false });

    var drawVectorlayer = new VectorLayer({
      source: drawDataSource,
      name: "drawLayer",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: `/static/icons/pin.png`,
        }),
      }),
    });
    var vectorSource = new VectorSource({
      // features: [iconFeature],
    });
    this.context.state.setDataSources({
      drawDataSource: drawDataSource,
      measureDataSource: measureDataSource,
      zoneDataSource: zoneDataSource,
      siteDataSource: siteDataSource,
      itemDataSource: itemDataSource,
      areaDataSource: areaDataSource,
      eventDataSource: eventDataSource,
      vectorSource: vectorSource,
    });

    var vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    let map = new Map({
      controls: defaultControls().extend([mousePositionControl]),
      target: "map",
      layers: [
        ...imageryProvider,
        measureVectorlayer,
        zoneVectorlayer,
        areaVectorlayer,
        siteVectorlayer,
        itemVectorlayer,
        // drawVectorlayer,
        eventVectorlayer,
        vectorLayer,
      ],
      view: new View({
        projection: "EPSG:4326",
        center: [31.481232354664705, 30.251357195732478],
        zoom: 19,
      }),
    });

    var geojsonFormat = new GeoJSON();

    map.on("moveend", this.onMoveEnd);
    var select = new Select({
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        // image: new Icon({
        //   anchor: [0.5, 46],
        //   anchorXUnits: "fraction",
        //   anchorYUnits: "pixels",
        //   src: `/static/icons/5eda9fd0-7fb3-493a-bfdc-03c5f94c8fbd.png`,
        // }),
        stroke: new Stroke({
          color: "#3498db",
          width: 2,
        }),
      }),
    });
    // map.addInteraction(select);
    select.on("select", (event) => {
      if (event.selected.length == 0) {
        this.props.selectSite(0);
        this.props.selectItem(0);
        this.context.state.dataSources.itemDataSource.clear();
      } else if (event.selected[0].type === "site") {
        this.props.selectSite(event.selected[0].itemId);
        this.props.selectItem(0);
      } else if (event.selected[0].type === "item") {
        this.props.selectSite(0);
        this.props.selectItem(event.selected[0].itemId);
      } else if (event.selected[0].type === "event") {
        this.props.selectEvent(event.selected[0].itemId);
      }
    });

    var selected = null;
    map.on("pointermove", (e) => {
      if (selected !== null) {
        selected = null;
        this.setState({ show: false });
      }

      map.forEachFeatureAtPixel(e.pixel, (f) => {
        selected = f;
        if (selected.name === undefined) {
          this.setState({ show: false });
        } else {
          this.setState({
            text: selected.name,
            description: selected.description,
            type: selected.type,
            data: selected.data,

            show: true,
          });
        }

        return true;
      });

      var pixel = map.getEventPixel(e.originalEvent);
      this.setState({ pixel: pixel });
    });
    var listener;
    var measurePolygonDraw = new Draw({
      source: measureDataSource,
      type: "Polygon",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
        }),
      }),
    });

    var measureLineStringDraw = new Draw({
      source: measureDataSource,
      type: "LineString",
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
        }),
      }),
    });

    var formatArea = (polygon) => {
      var area = getArea(polygon) * 111000;
      var output;
      if (area > 10000) {
        output =
          Math.round((area / 10000) * 100) / 100 + " " + "km<sup>2</sup>";
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
      }
      return output;
    };

    var formatLength = (line) => {
      var length = getLength(line) * 111000;
      var output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        output = Math.round(length * 100) / 100 + " " + "m";
      }
      return output;
    };

    measurePolygonDraw.on("drawstart", (evt) => {
      // set this.sketch
      this.sketch = evt.feature;
      this.createMeasureTooltip(map);
      var tooltipCoord = evt.coordinate;

      listener = this.sketch.getGeometry().on("change", (evt) => {
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }

        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    });

    measureLineStringDraw.on("drawstart", (evt) => {
      // set this.sketch
      this.sketch = evt.feature;
      this.createMeasureTooltip(map);
      var tooltipCoord = evt.coordinate;

      listener = this.sketch.getGeometry().on("change", (evt) => {
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }

        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    });

    measurePolygonDraw.on("drawend", () => {
      this.measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      this.measureTooltip.setOffset([0, -7]);

      unByKey(listener);
    });

    measureLineStringDraw.on("drawend", () => {
      this.measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
      this.measureTooltip.setOffset([0, -7]);

      unByKey(listener);
    });

    //draw
    var drawPolygon = new Draw({
      source: drawDataSource,
      type: "Polygon",
    });

    this.createMeasureTooltip(map);

    //draw

    var drawPoint = new Draw({
      source: drawDataSource,
      type: "Point",
    });

    //modify
    var modify = new Modify({
      source: drawDataSource,
    });

    this.context.state.setInteraction({
      select: select,
      modify: modify,
      drawPoint: drawPoint,
      drawPolygon: drawPolygon,
      measureLineStringDraw: measureLineStringDraw,
      measurePolygonDraw: measurePolygonDraw,
    });

    map.addInteraction(select);
    window.map = map;
    return map;
  };

  componentWillUnmount = () => {
    // this.props.viewer.destroy() ;
  };

  componentDidMount() {
    axios.get(`/static/backgrounds.json`).then((res) => {
      console.log("Start get default background ");
      this.setState({ background: res.data });
      this.context.state.setBackgrounds(res.data);
      let imageryProvider = [...this.getDefaultProvider(res.data)];

      this.viewer = this.createMap(
        JSON.parse(localStorage.getItem("user")),
        imageryProvider
      );
      this.context.state.setViewer(this.viewer);
      this.setState({ viewerLoaded: true });
    });
    getFeatures()
      .then((res) => {
        let currentDate = new Date();
        for (let i = 0; i < res.features.length; i++) {
          let deviceLocationDate = new Date(
            res.features[i].properties.device.created_at
          );
          let numberOfMilliS = Math.abs(currentDate - deviceLocationDate);
          let numberOfMinutes = numberOfMilliS / 1000 / 60;
          var iconFeature = new Feature({
            geometry: new Point([
              res.features[i].geometry.coordinates[0],
              res.features[i].geometry.coordinates[1],
            ]),
            name: "Null Island",
            population: 4000,
            rainfall: 500,
          });
          var iconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              scale: 0.4,
              color: `${numberOfMinutes <= 20 ? "#3aeb34" : "#f50707"}`,
              src: `/static/icons/pin.svg`,
            }),
          });
          iconFeature.setStyle(iconStyle);
          this.context.state.dataSources.vectorSource.addFeature(iconFeature);
        }
      })
      .catch((error) => this.context.state.handelError(error));
  }

  renderContents() {
    const { viewerLoaded } = this.state;
    let contents = null;

    if (viewerLoaded) {
      const { onLeftClick } = this.props;

      contents = (
        <span>
          <OpenlayerClickHandler
            viewer={this.viewer}
            onLeftClick={onLeftClick}
          />
        </span>
      );
    }

    return contents;
  }

  render() {
    const contents = this.renderContents();
    return (
      <div style={{ direction: "ltr" }} className="w-full h-full" id="map">
        {this.state.show === true &&
        this.state.text !== "" &&
        this.state.text !== undefined ? (
          <div
            style={{
              left: this.state.pixel[0] + 10,
              top: this.state.pixel[1] + 10,
              maxWidth: "350px",
              minWidth: "100px",
            }}
            className="absolute px-4 py-1 text-sm bg-white rounded z-10"
          >
            <div className="mt-4">
              <div className="relative flex items-start">
                <div className=" text-sm leading-5">
                  <label className="font-bold text-gray-900">
                    {this.state.text}
                  </label>
                  <p className="text-gray-700 break-all">
                    {this.state.description}
                  </p>
                </div>
              </div>
            </div>

            <br></br>
            {this.state.type === "event" ? (
              <Fragment>
                <div className="relative flex items-start">
                  <div className="mts-3 text-sm leading-5">
                    <label className="font-medium text-gray-700">
                      نوع الحدث
                    </label>
                    <p className=" text-gray-700">
                      {this.state.data.event_type.name}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="relative flex items-start">
                    <div className=" text-sm leading-5">
                      <label className="font-medium text-gray-700">
                        درجة التاكيد
                      </label>
                      <p className=" text-gray-700">
                        {confidence[this.state.data.confidence]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative flex items-start">
                    <div className=" text-sm leading-5">
                      <label className="font-medium text-gray-700">
                        الخطورة
                      </label>
                      <p className=" text-gray-700">
                        {severity[this.state.data.severity]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative flex items-start">
                    <div className=" text-sm leading-5">
                      <label className="font-medium text-gray-700">
                        الوصف /المنطقه
                      </label>
                      <p className=" text-gray-700">
                        {this.state.data.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : null}
          </div>
        ) : null}
        {contents}
      </div>
    );
  }
}

OpenlayerGlobe.contextType = AppContext;
export default OpenlayerGlobe;
