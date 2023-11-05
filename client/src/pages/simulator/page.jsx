import Sidebar from "../../components/Sidebar";
import Mapbox from "../../components/mapbox/Mapbox";

export default function SimulatorPage() {
  return (
    <>
      <Sidebar>
        <h1>Simulate ocean trash</h1>
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
          />
        </label>
      </Sidebar>
      <Mapbox />
    </>
  );
}