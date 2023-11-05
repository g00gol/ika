export default async function getPopulation(query) {
  const API_KEY = import.meta.env.VITE_API_NINJAS_API_KEY;

  const res = await fetch(
    "https://api.api-ninjas.com/v1/country?name=" + query,
    {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY,
      },
    },
  );

  const data = await res.json();
  return data;
}
