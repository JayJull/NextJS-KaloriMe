
"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function App({ children, title, subtitle }) {
  const [activeMenu, setActiveMenu] = useState();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default App