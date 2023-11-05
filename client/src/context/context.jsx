import { createContext, useState } from "react";

export const Context = createContext({
  year: 2019,
  setYear: () => {},
});

export default function ContextProvider({ children }) {
  const [year, setYear] = useState(2019);

  return (
    <Context.Provider value={{ year, setYear }}>{children}</Context.Provider>
  );
}
