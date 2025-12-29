import { useState, useEffect } from "react";
// Components
import useSystemData from "../hooks/useSystemData";
import StaticSection from "./StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
import MemAreaChart from "./charts/MemAreaChart";
import MemPieChart from "./charts/MemPieChart";
import Sidebar from "./Sidebar";
import DynamicSection from "./DynamicSection";
import LoadingModal from "./LoadingModal";
import QuickStatsGeneral from "./QuickStatsGeneral";
import QuickStatsCores from "./QuickStatsCores";
import ProcessesDisplay from "./ProcessesDisplay";
import CpuHeatMap from "./cpuHeatMap";
// Style
import styles from "../css/App.module.css";

function getAvgLoad(history) {
  if (!history) return;
  let sum = 0;
  history.forEach((entry) => {
    sum += entry.cpuLoad;
  });
  return (sum / history.length).toFixed(2);
}
function getParkedCores(coresLoad){
  if (!coresLoad) return
  let counter = 0
  coresLoad.forEach(load => {
    if (load == 0) counter ++
  });
  return counter
}

function App() {
  const [activeView, setActiveView] = useState("CPUGeneralView");
  const { history, staticData, maxValues, coreOverload, processesData, threadStats} = useSystemData();
  const currentData = history.length > 0 ? history.at(-1) : null;
  const isDataAvailable = history.length > 0 && staticData && threadStats;
  const isProcessDataAvaiable = Object.keys(processesData).length > 0;
  return (
    <div className={styles.wrapper}>
      <Sidebar setView={setActiveView} activeView={activeView}></Sidebar>

      <DynamicSection
        className={`${styles.dynamicSection} ${styles.viewContainer}`}
      >
        {/* === CPU GENERAL VIEW === */}
        <div
          className={`${styles.cpuGeneralView} ${styles.view} ${
            activeView === "CPUGeneralView" ? styles.activeView : ""
          }`}
        >
          <div className={`${styles.cpuGeneralChart}`}>
            {isDataAvailable ? (
              <CpuChart data={history} />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.quickStatsContainer}>
            {isDataAvailable && isProcessDataAvaiable ? (
              <QuickStatsGeneral
                cpuSpeedAvg={currentData.cpuSpeed.avg}
                cpuMaxSpeed={currentData.cpuSpeed.max}
                cpuTempAvg={
                  currentData.cpuTemp ? currentData.cpuTemp.avg : null
                }
                cpuTempMax={
                  currentData.cpuTemp ? currentData.cpuTemp.max : null
                }
                cpuAvgLoad={getAvgLoad(history)}
                cpuMaxLoad={maxValues.cpuLoad}
                uptime={currentData.uptime}
                numberProcesses={processesData.total}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.processesContainer}>
            {isProcessDataAvaiable ? (
              <ProcessesDisplay processesList={processesData.topProcesses} />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
        </div>
        {/* === CPU CORES VIEW === */}
        <div
          className={`${styles.cpuCoresView} ${styles.view} ${
            activeView === "CPUCoresView" ? styles.activeView : ""
          }`}
        >
          <div className={`${styles.cpuCoresChart}`}>
            {isDataAvailable ? (
              <CpuCoresChart
                data={history}
                amountCores={staticData.cpu.cores}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.quickStatsContainer}>
            {isDataAvailable ? (
              <QuickStatsCores
                coreTempMax={maxValues.coreTemp ? maxValues.coreTemp : null}  
                thermalHeadroom={maxValues.coreTemp ? 100 - maxValues.coreTemp[1] : null}
                coreSpeedAvg={currentData.cpuSpeed.avg}
                coreSpeedMax={maxValues.coreSpeed ? maxValues.coreSpeed : null}
                coreOverload={coreOverload}
                mostActiveCore={[currentData.coresLoad.indexOf(Math.max(...currentData.coresLoad)), Math.max(...currentData.coresLoad)]}
                parkedCores={[getParkedCores(currentData.coresLoad), staticData.cpu.cores]}
                threadStats={threadStats}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.cpuHeatMapContainer}>
            {isDataAvailable ? (
              <CpuHeatMap
                data={currentData.coresLoad}
                coresTemp={currentData.coresTemp}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
        </div>
        {/* === MEMORY VIEW === */}
        <div
          className={`${styles.memView} ${styles.view} ${
            activeView === "MEMAvailableView" ? styles.activeView : ""
          }`}
        >
          <div className={`${styles.memAreaChart}`}>
            {isDataAvailable ? (
              <MemAreaChart data={history} totalMem={staticData.memory.total} />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={`${styles.memPieChart}`}>
            {isDataAvailable ? (
              <MemPieChart data={history} totalMem={staticData.memory.total} />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
        </div>
      </DynamicSection>

      <StaticSection staticData={staticData}></StaticSection>
    </div>
  );
}

export default App;
