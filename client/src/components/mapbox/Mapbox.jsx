import Map, { Source, Layer } from "react-map-gl";
import { useEffect, useState, useContext } from "react";
import format from "../../utils/geoJsonProcessor";
import { Context } from "../../context/context";
import Sidebar from "../Sidebar";
import roundToNearestK from "../../utils/roundToNearestK";
import getPopulation from "../../utils/getPopulation";

const API_KEY = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Mapbox() {
  const [geoJson, setGeoJson] = useState(null);
  const [maxValue, setMaxValue] = useState(0);
  const { year, setYear } = useContext(Context);
  const [population, setPopulation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    (async () => {
      console.log(year);
      const data = await format(year);
      const max = Math.max(
        ...data.features.map((country) => country.properties["2019"]),
      );
      setMaxValue(max);
      console.log(data);
      setGeoJson(data);
    })();
  }, [year]);

  const geoLayer = {
    id: "geo-layer",
    type: "fill",
    source: year,
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", `${year}`],
        year * 1000,
        "#2CBA00",
        maxValue / 8,
        "#A3FF00",
        maxValue / 4,
        "#FFF400",
        maxValue / 2,
        "#FFA700",
        maxValue,
        "#FF0000",
      ],
      "fill-opacity": 0.75,
    },
  };

  const onClick = async (event) => {
    setPopulation(null);
    const feature = event.features && event.features[0];
    setSelectedCountry(feature);

    const res = await getPopulation(feature.properties.ADMIN);
    setPopulation(res[0].population);
  };

  useEffect(() => {
    (async () => {})();
  }, [selectedCountry]);

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
        onClick={onClick}
        interactiveLayerIds={[geoLayer.id]}
      >
        <Source id="my-data" type="geojson" data={geoJson}>
          <Layer {...geoLayer} />
        </Source>
        {selectedCountry && (
          <Sidebar>
            <h1>{selectedCountry.properties.ADMIN}</h1>
            <h2>Statistics</h2>
            <div className="stats stats-vertical shadow-text/30 shadow">
              <div className="stat">
                <div className="stat-title">Population</div>
                <div className="stat-value">
                  {population ? `${population}K` : "Getting..."}
                </div>
                <div className="stat-desc">As of 2023</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Plastic Waste 2019</div>
                <div className="stat-value">
                  {roundToNearestK(selectedCountry.properties["2019"])} kgs
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Plastic Waste {year}</div>
                <div className="stat-value">
                  {roundToNearestK(selectedCountry.properties[year])} kgs
                </div>
                <div className="stat-desc">
                  ↗︎
                  {(
                    (selectedCountry.properties[year] /
                      selectedCountry.properties["2019"]) *
                      100 -
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>
            </div>
          </Sidebar>
        )}
      </Map>
    </div>
  );
}
