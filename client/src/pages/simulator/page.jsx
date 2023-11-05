import { useContext, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Mapbox from "../../components/mapbox/Mapbox";
import { Context } from "../../context/context";

export default function SimulatorPage() {
  const [input, setInput] = useState(2020);
  const [submitted, setSubmitted] = useState(false);
  const { year, setYear } = useContext(Context);

  return (
    <>
      <Sidebar collapsed={submitted}>
        <h1>Simulate ocean trash</h1>
        <div className="flex-grow">
          <p>
            Look into the future by entering a year. The map will show how much
            trash we'll have in the ocean by then.
          </p>
          <label>
            Year:
            <input
              type="number"
              className="input w-1/4"
              placeholder="2023"
              min={2020}
              max={2100}
              value={year}
              onChange={(e) => setInput(e.target.value)}
            />
          </label>
        </div>

        <button
          className="btn btn-primary mt-auto"
          onClick={() => {
            setYear(input);
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
