import Map from "react-map-gl";

export default function Mapbox() {
  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: 0,
        latitude: 0,
        zoom: 1,
      }}
      maxZoom={6}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/tumtarts/clokif760006001nt96303gcu"
    />
  );
}
