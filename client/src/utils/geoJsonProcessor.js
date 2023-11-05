import countries from "../../data/countries.json" assert { type: "json" };

const format = async (endYear) => {
  const res = await fetch("http://127.0.0.1:3001/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      year: endYear,
    }),
  });
  const { columns: data } = await res.json();
  const changeRate = data.find((col) => col.name === "Change Per Year").values;
  const countryCodes = data.find((col) => col.name === "Code").values;

  // For each year till the endYear, look for that value in the data
  const allYears = {};
  for (let year = 2019; year <= endYear; year++) {
    const found = data.find((col) => col.name === year.toString()).values;
    allYears[year] = found;
  }

  // Find the intersection between countryCodes and countries.features.properties.ISO_A3
  // Returns the actual country codes
  const toUpdate = countries.features
    .map((country) => {
      if (countryCodes.includes(country.properties.ISO_A3)) {
        return country.properties.ISO_A3;
      }
    })
    .filter((code) => code !== undefined);

  // country.properties.averageChangeRate = changeRate[index];
  const updated = countryCodes.map((code, index) => {
    if (toUpdate.includes(code)) {
      return {
        ...countries.features.find(
          (country) => country.properties.ISO_A3 === code,
        ),
        properties: {
          ...countries.features.find(
            (country) => country.properties.ISO_A3 === code,
          ).properties,
          averageChangeRate: changeRate[index],
          // spread out all the years but the value is at an index
          ...Object.fromEntries(
            Object.entries(allYears).map(([key, value]) => [key, value[index]]),
          ),
        },
      };
    }
  });

  return {
    type: "FeatureCollection",
    features: updated,
  };
};

export default format;
