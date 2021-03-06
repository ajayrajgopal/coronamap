import React from "react";
import MapGL from "react-map-gl";
import { DeckGL, HexagonLayer, ArcLayer } from "deck.gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";

export default function Map({
  width,
  height,
  viewState,
  patients,
  onViewStateChange,
  type,
  elevationEnabled,
  toggleElevation,
  range,
}) {
  var [tooltipData, setTooltipData] = React.useState({
    text: "",
    display: "none",
    x: 0,
    y: 0,
  });
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0,
  });

  const pointLight1 = new PointLight({
    color: [255, 255, 255],
    intensity: 1.0,
    position: [0, 0, 8000],
  });

  const pointLight2 = new PointLight({
    color: [255, 255, 255],
    intensity: 1.0,
    position: [0, 0, 8000],
  });

  const lightingEffect = new LightingEffect({
    ambientLight,
    pointLight1,
    pointLight2,
  });

  const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51],
  };

  function tooltip() {
    return (
      <div
        style={{
          position: "absolute",
          top: tooltipData.y,
          left: tooltipData.x,
          color: "white",
          display: tooltipData.display,
          backgroundColor: "black",
          fontSize: "12px",
          padding: 5,
          borderRadius: 5,
          opacity: 0.8,
        }}
      >
        District: {tooltipData.district}
        <br />
        Cases: {tooltipData.cases}
      </div>
    );
  }
  var layers = [];
  if (type == "heatmap") {
    layers = [
      new HexagonLayer({
        id: "hexagon-layer",
        data: patients,
        extruded: true,
        pickable: true,
        elevationScale: elevationEnabled ? 2000 : 0,
        elevationRange: [0, 500],
        autoHighlight: true,
        radius: 6000,
        transitions: {
          elevationScale: 3000,
        },
        getPosition: (d) => {
          return d.position;
        },
        getColorValue: (points) => {
          return points[0].cases;
        },
        onHover: (info) => {
          if (info.object !== null) {
            setTooltipData({
              district: info.object.points[0].district,
              cases: info.object.points[0].cases,
              x: info.x,
              y: info.y,
              display: "block",
            });
          } else {
            setTooltipData({ display: "none" });
          }
        },
        getElevationWeight: (d) => {
          return d.cases;
        },
        coverage: 3,
        elevationLowerPercentile: range[0],
        elevationUpperPercentile: range[1],
        lowerPercentile: range[0],
        upperPercentile: range[1],
        material: material,
        colorRange: [
          [1, 152, 189],
          [73, 227, 206],
          [216, 254, 181],
          [254, 237, 177],
          [254, 173, 84],
          [209, 55, 78],
        ],
      }),
    ];
  }

  if (type == "arc") {
    layers = [
      new ArcLayer({
        id: "arc-layer",
        data: patients,
        getSourcePosition: (d) => d.position,
        getTargetPosition: (d) => d.fromPos,
        getSourceColor: [125, 0, 238],
        getTargetColor: [53, 0, 100],
        getWidth: 1.5,
      }),
    ];
  }
  return (
    <MapGL
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      onLoad={toggleElevation}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxApiAccessToken="pk.eyJ1IjoiYWpheXJhamdvcGFsIiwiYSI6ImNrMGphZzlkdjA1cDAzb3JheThvOHdqYTIifQ.kbO-Ok19Tu-0qg2FIVBt6Q"
    >
      <DeckGL viewState={viewState} effects={[lightingEffect]} layers={layers}>
        {tooltip}
      </DeckGL>
    </MapGL>
  );
}
