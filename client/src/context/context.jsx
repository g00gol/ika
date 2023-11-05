import { createContext, useState } from "react";

export const Context = createContext({
  year: 2020,
  setYear: () => {},
});

export default function ContextProvider({ children }) {
  const [year, setYear] = useState(2020);

  return (
    <Context.Provider value={{ year, setYear }}>{children}</Context.Provider>
  );
}
