import { useState } from "react";

export default function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={
        "sidebar z-10 flex flex-col space-y-8 p-8 " +
        (collapsed ? "w-1/12" : "w-1/4")
      }
    >
      {children}
    </div>
  );
}
