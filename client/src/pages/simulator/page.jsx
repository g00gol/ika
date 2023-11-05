import { useContext, useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import Mapbox from "../../components/mapbox/Mapbox";
import { Context } from "../../context/context";

export default function SimulatorPage() {
  const [input, setInput] = useState(2020);
  const [submitted, setSubmitted] = useState(false);
  const { year, setYear } = useContext(Context);

  return (
    <>
      <Sidebar>
        <h1>Simulate ocean trash</h1>

        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">World Population</div>
            <div className="stat-value">8071020K ppl</div>
            <div className="stat-desc">Currently alive</div>
          </div>

          <div className="stat">
            <div className="stat-title">Total Plastic Waste 2019</div>
            <div className="stat-value">888549K kgs</div>
          </div>
        </div>

        <div className="flex-grow">
          <p className="mb-8">
            It is now more apparent than ever before that the Earth's oceans are
            dirty with plastics and mismanaged trash. To help raise awareness
            for this global phenomena, we're giving you a close look into the
            future. Use the slider below to see how much trash will be in the
            ocean in the year you select.
          </p>
          <label>
            Year: {input}
            <input
              type="range"
              className="range range-sm range-primary mt-2 w-full"
              placeholder="2023"
              min={2020}
              max={2100}
              value={input}
              onChange={(e) => setInput(Number(e.target.value))}
            />
          </label>
        </div>

        <button
          className="btn btn-primary mt-auto"
          onClick={() => {
            setYear(Number(input));
            setSubmitted(true);
          }}
        >
          Simulate
        </button>
      </Sidebar>
      <Mapbox />
    </>
  );
}
