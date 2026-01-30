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
import CpuHeatMap from "./CpuHeatMap";
import CoresLoadBarChart from './charts/CoresLoadBarChart'
// Style
import styles from "../css/App.module.css";

function getAvgLoad(history) {
  if (!history) return;
  let sum = 0;
  history.forEach((entry) => {
    sum += entry.cpuLoad;
  }); return (sum / history.length).toFixed(2);
}

function App() {
  const [activeView, setActiveView] = useState("CPUGeneralView");
  const { history, staticData, maxValues, processesData, tempData} = useSystemData();
  const currentData = history.length > 0 ? history.at(-1) : null;
  const isDataAvailable = history.length > 0 && staticData;
  const isProcessDataAvaiable = Object.keys(processesData).length > 0;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isStaticSectionCollapsed, setIsStaticSectionCollapsed] = useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  const toggleStaticSection = () => setIsStaticSectionCollapsed(!isStaticSectionCollapsed)
  let sidebarGridWidth = isSidebarCollapsed ? '0px' : '250px'
  let staticSectionGridWidth = isStaticSectionCollapsed ? '0px' : '250px'
  return (
    <div className={styles.wrapper} style={{'--sidebar-grid-width': sidebarGridWidth, '--static-section-grid-width': staticSectionGridWidth}}>
      <Sidebar setView={setActiveView} activeView={activeView} onToggle={toggleSidebar} isCollapsed={isSidebarCollapsed}></Sidebar>
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
                cpuAvgTemp={tempData.cpuTemp}
                cpuMaxTemp={maxValues.cpuTemp}
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
                amountCores={staticData.cpu.logicalThreads}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.quickStatsContainer}>
            {isDataAvailable ? (
              <QuickStatsCores
                coreTempMax={maxValues.coreTemp ? maxValues.coreTemp : null}  
                thermalHeadroom={tempData.thermalHeadroom}
                coreSpeedAvg={currentData.cpuSpeed.avg}
                coreSpeedMax={maxValues.coreSpeed ? maxValues.coreSpeed : null}
                coreOverload={currentData.coreOverload}
                mostActiveCore={currentData.mostActiveCore}
                parkedCores={currentData.parkedCores}
                threadEfficiency={currentData.threadEfficiency}
                activeThreadsCount={currentData.activeThreadsCount}
                totalThreads={staticData.cpu.logicalThreads}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.cpuHeatMapContainer}>
            {isDataAvailable ? (
              <CpuHeatMap
                coresTemp={tempData.coresTemp}
                cpuTemp={tempData.cpuTemp}
              />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.coresLoadBarChartContainer}>
            {isDataAvailable ? (
              <CoresLoadBarChart
                data={currentData.coresLoad}
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
      <StaticSection staticData={staticData} onToggle={toggleStaticSection} isCollapsed={isStaticSectionCollapsed}></StaticSection>
    </div>
  );
}

export default App;
