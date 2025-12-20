import { useState, useEffect } from "react";
import StaticSection from "./components/StaticSection";
import DynamicSection from "./components/DynamicSection";

function App() {
  return (
    <>
      <h1>Real Time Resource Monitoring</h1>
      <StaticSection></StaticSection>
      <DynamicSection></DynamicSection>
    </>
  )
}

export default App
