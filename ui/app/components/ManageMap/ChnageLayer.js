import React from "react";

import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile.js";
import AppContext from "../../contexts/AppContext";

class ChnageLayer extends React.Component {
  state = {
    showMenu: false,
    backgrounds: [],
  };

  toggleMenu = () => {
    this.setState({ backgrounds: this.context.state.backgrounds });
    this.setState({ showMenu: !this.state.showMenu });
  };
  getProvider = (backgrond) => {
    let imageryProvider;

    switch (backgrond.provider) {
      case "google":
        imageryProvider = new TileLayer({
          source: new XYZ({
            url: backgrond.url,
            format: "image/jpeg",
            type: "Background",
            name: "Background" + backgrond.id,
          }),
        });
        break;
      case "bing maps":
        imageryProvider = new BingMaps({
          key: backgrond.key,
          imagerySet: backgrond.url,
          format: "image/jpeg",
          type: "Background",
          name: "Background" + backgrond.id,
        });
        break;
      case "xyz":
      case "XYZ":
        imageryProvider = new TileLayer({
          source: new XYZ({
            url: backgrond.url,
            format: "image/jpeg",
            type: "Background",
            name: "Background" + backgrond.id,
          }),
        });
        break;
      default:
        break;
    }
    return imageryProvider;
  };

  changeBackground = () => {
    var temp = this.state.backgrounds;

    temp.map((background) => {
      if (background.selected === true) {
        background.selected = false;

        this.context.state.viewer.getLayers().forEach((layer) => {
          if (
            layer.values_.type === "Background" &&
            layer.values_.name === "Background" + background.id
          ) {
            layer.setVisible(false);
          } else if (layer.values_.type === "Background") {
            layer.setVisible(true);
          }
        });
      } else {
        background.selected = true;
      }

      return background;
    });
    this.context.state.viewer.render();
    this.context.state.viewer.updateSize();
    this.context.state.viewer.renderSync();
    this.setState({ backgrounds: temp });
  };

  render() {
    return (
      <div className=" z-10 rounded  absolute left-0 p-1 ml-20 mt-20 top-0 border-gray-100   ">
        {this.state.showMenu === false ? (
          <svg
            className="fill-current cursor-pointer text-white inline-block h-10 w-10"
            viewBox="0 0 20 20"
            onClick={this.toggleMenu}
          >
            <g id="layer1">
              <path d="M 9.9921875 2 A 0.50005 0.50005 0 0 0 9.7675781 2.0566406 L 0.26757812 7.0566406 A 0.50005 0.50005 0 0 0 0.26757812 7.9433594 L 9.7675781 12.943359 A 0.50005 0.50005 0 0 0 10.232422 12.943359 L 19.732422 7.9433594 A 0.50005 0.50005 0 0 0 19.732422 7.0566406 L 10.232422 2.0566406 A 0.50005 0.50005 0 0 0 9.9921875 2 z M 10 3.0664062 L 18.425781 7.5 L 10 11.935547 L 1.5742188 7.5 L 10 3.0664062 z M 0.4921875 9.9960938 A 0.50005 0.50005 0 0 0 0.26757812 10.943359 L 9.7675781 15.943359 A 0.50005 0.50005 0 0 0 10.232422 15.943359 L 19.732422 10.943359 A 0.50058684 0.50058684 0 1 0 19.267578 10.056641 L 10 14.935547 L 0.73242188 10.056641 A 0.50005 0.50005 0 0 0 0.4921875 9.9960938 z M 0.4921875 12.996094 A 0.50005 0.50005 0 0 0 0.26757812 13.943359 L 9.7675781 18.943359 A 0.50005 0.50005 0 0 0 10.232422 18.943359 L 19.732422 13.943359 A 0.50058684 0.50058684 0 1 0 19.267578 13.056641 L 10 17.935547 L 0.73242188 13.056641 A 0.50005 0.50005 0 0 0 0.4921875 12.996094 z " />
            </g>
          </svg>
        ) : (
          <div className="bg-white text-right arabic px-4 py-2 w-64  rounded ">
            <div className="-ml-2 relative -mt-2s flex justify-between border-b border-gray-200 pb-2 items-center flex-wrap sm:flex-no-wrap">
              <div className="ml-2 mt-2">
                <h3 className="text-sm  font-medium text-gray-900">الطبقات</h3>
              </div>

              <button
                onClick={this.toggleMenu}
                type="button"
                className=" absolute p-2 z-30  mr-10  left-0 border   rounded-full text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
              >
                <svg
                  id="Outlined"
                  style={{ width: 12, height: 12 }}
                  viewBox="0 0 32 32"
                >
                  <title />
                  <g id="Fill">
                    <polygon points="28.71 4.71 27.29 3.29 16 14.59 4.71 3.29 3.29 4.71 14.59 16 3.29 27.29 4.71 28.71 16 17.41 27.29 28.71 28.71 27.29 17.41 16 28.71 4.71" />
                  </g>
                </svg>
              </button>
            </div>
            {this.state.backgrounds.map((background) => {
              if (
                background.selected === "false" ||
                background.selected === false
              ) {
                return (
                  <div
                    key={background.id}
                    className="mt-2 w-auto flex grid-cols-4   pb-2 "
                  >
                    <img
                      className="w-10 h-10 ml-4 col-span-1 cursor-pointer  rounded border-gray-100"
                      src={`/static/background/${background.image}.png`}
                      onClick={() => {
                        this.changeBackground(background.id);
                      }}
                    ></img>
                    <div className="col-span-3">
                      <h3 className="text-sm   font-medium text-gray-900">
                        تغيير الى : {background.name}
                      </h3>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    );
  }
}

ChnageLayer.contextType = AppContext;
export default ChnageLayer;
