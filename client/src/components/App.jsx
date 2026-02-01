import { useState, useEffect } from "react";
// Components
import StaticSection from "./layout/StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
import MemAreaChart from "./charts/MemAreaChart";
import MemPieChart from "./charts/MemPieChart";
import Sidebar from "./layout/Sidebar";
import DynamicSection from "./layout/DynamicSection";
import LoadingModal from "./layout/LoadingModal";
import QuickStatsGeneral from "./stats/QuickStatsGeneral";
import QuickStatsCores from "./stats/QuickStatsCores";
import ProcessesDisplay from "./ui/ProcessesDisplay";
import CpuHeatMap from "./ui/CpuHeatMap";
import CoresLoadBarChart from './charts/CoresLoadBarChart'
// Style
import styles from "./App.module.css";
// Context
import { useStaticData } from '../context/StaticDataProvider'
import { useMetrics } from "../context/MetricsProvider";

function App() {
  const [activeView, setActiveView] = useState("CPUGeneralView");
  const { history, processesData} = useMetrics();
  const { loading: isStaticLoading } = useStaticData()
  const isDataAvailable = history.length > 0 && !isStaticLoading;
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
              <CpuChart />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.quickStatsContainer}>
            {isDataAvailable && isProcessDataAvaiable ? (
              <QuickStatsGeneral />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.processesContainer}>
            {isProcessDataAvaiable ? (
              <ProcessesDisplay />
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
              <CpuCoresChart />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.quickStatsContainer}>
            {isDataAvailable ? (
              <QuickStatsCores />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.cpuHeatMapContainer}>
            {isDataAvailable ? (
              <CpuHeatMap />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={styles.coresLoadBarChartContainer}>
            {isDataAvailable ? (
              <CoresLoadBarChart/>
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
              <MemAreaChart />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
          <div className={`${styles.memPieChart}`}>
            {isDataAvailable ? (
              <MemPieChart />
            ) : (
              <LoadingModal color="#6ac9bf" />
            )}
          </div>
        </div>
      </DynamicSection>
      <StaticSection onToggle={toggleStaticSection} isCollapsed={isStaticSectionCollapsed}></StaticSection>
    </div>
  );
}

export default App;
