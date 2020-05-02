import React from "react";
import styles from "./App.module.css";
import Map from "./components/Map";
import { FlyToInterpolator } from "react-map-gl";
import { csv } from "d3";
import GL from "@luma.gl/constants";

function App() {
  const [viewState, setViewState] = React.useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4.3,
    pitch: 50,
    bearing: 10,
  });

  const heatMapData = csv("hexsample.csv", (d, id) => ({
    id,
    district: d["district"],
    cases: d["cases"],
    position: [+d["longitude"], +d["latitude"]],
  })).then((patients) =>
    patients.filter((d) => d.position[0] != null && d.position[1] != null)
  );
  const arcData = csv("arcsample.csv", (d, id) => ({
    id,
    patientId: d["p_id"],
    position: [+d["longitude"], +d["latitude"]],
    fromPos: [+d["fromLong"], +d["fromLat"]],
  })).then((patients) =>
    patients.filter((d) => d.position[0] != null && d.position[1] != null)
  );
  const handleChangeViewState = ({ viewState }) => setViewState(viewState);
  const [patients, setPatients] = React.useState(heatMapData);
  const [parameters, setParameters] = React.useState({});
  const [type, setType] = React.useState("heatmap");

  const switchTo3DHeatmap = () => {
    if (type != "heatmap") {
      const destination = {
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 4.3,
        pitch: 50,
        bearing: 10,
      };
      setPatients(heatMapData);
      setParameters({});
      setType("heatmap");
      setViewState({
        ...viewState,
        ...destination,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  };
  const switchToArcs = () => {
    if (type != "arc") {
      const destination = {
        latitude: 20.5937,
        longitude: 75.9064,
        zoom: 4.3,
        pitch: 60,
        bearing: -30,
      };
      setPatients(arcData);
      setType("arc");
      setViewState({
        ...viewState,
        ...destination,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const changeBearing = () => {
    console.log("called");
    var vb = 0.1;
    var vp = 0.01;
    if (Math.abs(viewState.bearing) > 89) {
      vb *= -1;
    }
    setViewState({
      ...viewState,
      ...{ bearing: viewState.bearing + vb },
    });
    console.log(viewState.bearing);
    window.requestAnimationFrame(changeBearing);
  };

  return (
    <div className="App">
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        patients={patients}
        parameters={parameters}
        type={type}
      />
      <div className={styles.controls}>
        <button onClick={switchTo3DHeatmap}>3D District Map</button>
        <button onClick={switchToArcs}>Transmission Arcs</button>
      </div>
    </div>
  );
}

export default App;
