import { Routes, Route } from "react-router-dom";

import "mapbox-gl/dist/mapbox-gl.css";

import Home from "./pages/page";
import SimulatorPage from "./pages/simulator/page";
import Mapbox from "./components/mapbox/Mapbox";
import ErrorPage from "./pages/error";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" Component={Mapbox} />
        <Route path="*" Component={ErrorPage} />
      </Routes>
    </div>
  );
}

export default App;
