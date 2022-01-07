import { Component } from "react";
import { transform } from "ol/proj";

import AppContext from "../../../../contexts/AppContext";

class OpenlayerClickHandler extends Component {
  componentDidMount() {
    this.createInputHandlers();
  }
  createInputHandlers() {
    this.props.viewer.on("click", this.onMouseLeftClick);
    // this.props.viewer.on('rightclick', this.onMouseClick );
  }

  getPointElevation = (coord) => {
    // axios.get(`pointElevation.json`, coord).then((res) => {
    //   this.props.forms.showGetElevetionResults(
    //     `${res.data.alt} M  [ ${res.data.lat} ${res.data.lon} ]`
    //   );
    // });
  };

  getLineLength = (coord) => {
    // this.props.measureArray.push([coord.lon, coord.lat]);
    // this.props.drawArray.push(coord.lon, coord.lat);
    // if (this.props.measureArray.length >= 2) {
    //   console.log(this.props.measureArray);
    //   var line = turfLineString(this.props.measureArray);
    //   var length = turfLength(line, { units: "kilometers" });
    //   if (length < 1) {
    //     this.props.forms.showMeasureResults(
    //       parseFloat(length * 1000).toFixed(2) + " Meters"
    //     );
    //   } else {
    //     this.props.forms.showMeasureResults(
    //       parseFloat(length).toFixed(2) + " kilometers"
    //     );
    //   }
    // }
  };

  getAreaLength = (coord) => {
    // this.props.measureArray.push([coord.lon, coord.lat]);
    // this.props.drawArray.push(coord.lon, coord.lat);
    // if (this.props.measureArray.length >= 3) {
    //   let temp = this.props.measureArray.concat([this.props.measureArray[0]]);
    //   var polygon = turfPolygon([temp]);
    //   var area = turfArea(polygon);
    //   if (area > 1000) {
    //     this.props.forms.showMeasureResults(
    //       parseFloat(area / 1000).toFixed(2) + "kilometers<sup>2</sup>"
    //     );
    //   } else {
    //     this.props.forms.showMeasureResults(
    //       parseFloat(area).toFixed(2) + " Meters<sup>2</sup>"
    //     );
    //   }
    // }
  };

  onMouseLeftClick = (e) => {
    if (e.coordinate) {
      if (this.context.state.pickCoordinate === true) {
        this.context.state.pickCoordinateCallback(
          e.coordinate[1],
          e.coordinate[0]
        );
      }
    }
  };

  render() {
    return null;
  }
}
OpenlayerClickHandler.contextType = AppContext;
export default OpenlayerClickHandler;
