import { useState, useEffect } from "react";
import StaticSection from "./components/StaticSection";
import CpuChart from "./components/CpuChart";

function App() {
  return (
    <>
      <h1>Real Time Resource Monitoring</h1>
      <StaticSection></StaticSection>
      <CpuChart></CpuChart>
    </>
  )
}

export default App
