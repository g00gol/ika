import countries from "../../data/countries.json" assert { type: "json" };

const res = await fetch("http://127.0.0.1:3001/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    year: 2023,
  }),
});

const format = async () => {
  const { columns: data } = await res.json();
  const countryCodes = data[4].values;

  const map = new Map();
  const updated = countryCodes.map((code) => {
    const { features } = countries;

    features.map((feature) => {
      if (feature?.properties?.ISO_A3 === code) {
        return;
      }
    });
  });
};

format();
