import Map, { Source, Layer } from "react-map-gl";
import { useEffect, useState } from "react";

import format from "../../utils/geoJsonProcessor";

const API_KEY = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Mapbox() {
  const [geoJson, setGeoJson] = useState(null);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await format(2023);
      const max = Math.max(
        ...data.features.map((country) => country.properties["2023"]),
      );
      setMaxValue(max);
      setGeoJson(data);
    })();
  }, []);

  const parkLayer = {
    id: "keepyourselfsafe",
    type: "fill",
    source: "2023",
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "2023"],
        0,
        "#F2F12D",
        maxValue / 4,
        "#E6B71E",
        maxValue / 2,
        "#8B4225",
        maxValue,
        "#723122",
      ],
      "fill-opacity": 0.75,
    },
  };

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
        <Source id="my-data" type="geojson" data={geoJson}>
          <Layer {...parkLayer} />
        </Source>
      </Map>
    </div>
  );
}
