import React from "react";
import styles from "./App.module.css";
import Map from "./components/Map";
import { FlyToInterpolator } from "react-map-gl";
import { csv } from "d3";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    color: "rgba(1, 152, 189, 1)",
  },
});

function App() {
  const [viewState, setViewState] = React.useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4.3,
    pitch: 50,
    bearing: 10,
  });
  const classes = useStyles();

  var [elevationEnabled, setElevationEnabled] = React.useState(false);
  const [range, setRange] = React.useState([0, 100]);

  const handleChange = (event, newValue) => {
    setRange(newValue);
  };
  const heatMapData = csv("hexsample.csv", (d, id) => ({
    id,
    district: d["district"],
    cases: +d["cases"],
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
  const [type, setType] = React.useState("heatmap");

  const switchTo3DHeatmap = () => {
    const destination = {
      latitude: 20.5937,
      longitude: 78.9629,
      zoom: 4.3,
      pitch: 50,
      bearing: 10,
    };
    if (type != "heatmap") {
      setPatients(heatMapData);
      setType("heatmap");
    }
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  const switchToArcs = () => {
    const destination = {
      latitude: 20.5937,
      longitude: 75.9064,
      zoom: 4.3,
      pitch: 60,
      bearing: -30,
    };
    if (type != "arc") {
      setPatients(arcData);
      setType("arc");
    }
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: "2000",
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  const turnLeft = () => {
    const destination = {
      bearing: viewState.bearing + 10,
    };
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 700,
    });
  };
  const turnRight = () => {
    const destination = {
      bearing: viewState.bearing - 10,
    };
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 700,
    });
  };
  const turnDown = () => {
    const destination = {
      pitch: viewState.pitch + 10,
    };
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 700,
    });
  };
  const turnUp = () => {
    const destination = {
      pitch: viewState.pitch - 10,
    };
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 700,
    });
  };
  const toggleElevation = () => {
    setElevationEnabled(!elevationEnabled);
  };

  return (
    <div className="App">
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        patients={patients}
        type={type}
        elevationEnabled={elevationEnabled}
        toggleElevation={toggleElevation}
        range={range}
      />
      <div
        className={styles.logo}
        align="center"
        style={{
          visibility: elevationEnabled ? "hidden" : "visible",
        }}
      >
        <lottie-player
          src="https://assets6.lottiefiles.com/packages/lf20_0r0csU.json"
          background="transparent"
          speed="1.5"
          style={{
            zIndex: 10000,
            width: "200px",
            height: "200px",
            position: "absolute" /*it can be fixed too*/,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
          }}
          hover
          loop
          autoplay
        ></lottie-player>
      </div>
      <div
        className={styles.controls}
        style={{ visibility: elevationEnabled ? "visible" : "hidden" }}
      >
        <button onClick={switchTo3DHeatmap}>3D District Map</button>
        <button onClick={switchToArcs}>Transmission Arcs</button>
        <div
          className={styles.filter}
          style={{
            visibility:
              type == "heatmap" && elevationEnabled ? "visible" : "hidden",
          }}
        >
          Percentile Filter
          <Slider
            value={range}
            min={0}
            max={100}
            width={80}
            style={{ width: "80%" }}
            onChange={handleChange}
            classes={{
              root: classes.root,
            }}
            className={styles.slider}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </div>
      </div>
      <div></div>
      <div
        className={styles.navigation}
        style={{ visibility: elevationEnabled ? "visible" : "hidden" }}
      >
        <p>Rotation: Right Click + Drag </p>
        <button onClick={turnUp}>&#8679;</button>
        <br></br>
        <button onClick={turnLeft}>&#8678;</button>
        <button onClick={turnDown}>&#8681;</button>
        <button onClick={turnRight}>&#8680;</button>
      </div>
      <p
        className={styles.dataNote}
        style={{ visibility: elevationEnabled ? "visible" : "hidden" }}
      >
        * Data as on 30th April 2020
      </p>
    </div>
  );
}

export default App;
