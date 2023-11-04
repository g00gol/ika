import Map from "react-map-gl";

const API_KEY = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Mapbox() {
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
      />
    </div>
  );
}
