import React from "react";
import ChnageLayer from "../ChnageLayer";

// import "openlayers/css/ol.css";
import OpenlayerGlobe from "./openlayer/OpenlayerGlobe";

class Openlayer extends React.Component {
  handleLeftClick = (coords) => {
    console.log("Left mouse clicked at: ", coords);
  };

  render() {
    return (
      <div style={{ direction: "ltr" }} className="w-full h-full">
        <ChnageLayer></ChnageLayer>
        <OpenlayerGlobe
          selectItem={this.props.selectItem}
          selectSite={this.props.selectSite}
          selectEvent={this.props.selectEvent}
          onLeftClick={this.handleLeftClick}
        />
      </div>
    );
  }
}

export default Openlayer;
