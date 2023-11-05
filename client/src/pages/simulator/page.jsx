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
        <div className="flex-grow">
          <p>
            Look into the future by entering a year. The map will show how much
            trash we'll have in the ocean by then.
          </p>
          <label>
            Year: {input}
            <input
              type="range"
              className="input w-full"
              placeholder="2023"
              min={2020}
              max={2100}
              step={10}
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
