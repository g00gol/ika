import Map, { Source, Layer } from "react-map-gl";
import format from "../../utils/geoJsonProcessor";

const API_KEY = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Mapbox() {
  const geoJson = format();

  return (
    <div className="h-screen w-screen">
      <Map
        mapboxAccessToken={API_KEY}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1,
        }}
        maxZoom={6}
        style={{ position: "relative", width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/tumtarts/clokif760006001nt96303gcu"
      >
        <Source id="my-data" type="geojson" data={geoJson}></Source>
      </Map>
    </div>
  );
}
