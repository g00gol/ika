import { useState } from "react";

export default function Sidebar({ collapsed, children }) {
  return (
    <div
      className={
        "sidebar z-10 flex flex-col space-y-8 p-8 " +
        (collapsed ? "hidden" : "w-1/4")
      }
    >
      {children}
    </div>
  );
}
