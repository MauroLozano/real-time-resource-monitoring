import { useState, useEffect } from "react";
// Components
import StaticSection from "./components/layout/StaticSection";
import CpuChart from "./components/charts/CpuChart";
import CpuCoresChart from "./components/charts/CpuCoresChart";
import MemAreaChart from "./components/charts/MemAreaChart";
import MemPieChart from "./components/charts/MemPieChart";
import Sidebar from "./components/layout/Sidebar";
import DynamicSection from "./components/layout/DynamicSection";
import LoadingModal from "./components/layout/LoadingModal";
import QuickStatsGeneral from "./components/stats/QuickStatsGeneral";
import QuickStatsCores from "./components/stats/QuickStatsCores";
import ProcessesDisplay from "./components/modules/ProcessesDisplay";
import CpuHeatMap from "./components/modules/CpuHeatMap";
import CoresLoadBarChart from './components/charts/CoresLoadBarChart'
// Style
import styles from "./App.module.css";
// Context
import { useStaticData } from './context/StaticDataProvider'
import { useMetrics } from "./context/MetricsProvider";

function App() {
  const [activeView, setActiveView] = useState("CPUGeneralView");
  const { history, processesData} = useMetrics();
  const { loading: isStaticLoading } = useStaticData()
  const isDataAvailable = history.length > 0 
  const isProcessDataAvaiable = Object.keys(processesData).length > 0;
  const isAppReady = isDataAvailable && !isStaticLoading && isProcessDataAvaiable
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isStaticSectionCollapsed, setIsStaticSectionCollapsed] = useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  const toggleStaticSection = () => setIsStaticSectionCollapsed(!isStaticSectionCollapsed)
  let sidebarGridWidth = isSidebarCollapsed ? '0px' : '250px'
  let staticSectionGridWidth = isStaticSectionCollapsed ? '0px' : '250px'
  return (
    <>
      <div className={`${styles.fullScreenLoaderContainer} ${isAppReady? styles.fullScreenLoaderContainerHidden : ''}`}>
        <LoadingModal></LoadingModal>
      </div>
      {isAppReady && (
        <div className={`${styles.wrapper} ${!isAppReady? styles.hidden: ''}`} style={{'--sidebar-grid-width': sidebarGridWidth, '--static-section-grid-width': staticSectionGridWidth}}>
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
                <CpuChart />
              </div>
              <div className={styles.quickStatsContainer}>
                <QuickStatsGeneral />
              </div>
              <div className={styles.processesContainer}>
                <ProcessesDisplay />
              </div>
            </div>
            {/* === CPU CORES VIEW === */}
            <div
              className={`${styles.cpuCoresView} ${styles.view} ${
                activeView === "CPUCoresView" ? styles.activeView : ""
              }`}
            >
              <div className={`${styles.cpuCoresChart}`}>
                <CpuCoresChart />
              </div>
              <div className={styles.quickStatsContainer}>
                <QuickStatsCores />
              </div>
              <div className={styles.cpuHeatMapContainer}>
                <CpuHeatMap />
              </div>
              <div className={styles.coresLoadBarChartContainer}>
                <CoresLoadBarChart/>
              </div>
            </div>
            {/* === MEMORY VIEW === */}
            <div
              className={`${styles.memView} ${styles.view} ${
                activeView === "MEMAvailableView" ? styles.activeView : ""
              }`}
            >
              <div className={`${styles.memAreaChart}`}>
                <MemAreaChart />
              </div>
              <div className={`${styles.memPieChart}`}>
                <MemPieChart />
              </div>
            </div>
          </DynamicSection>
          <StaticSection onToggle={toggleStaticSection} isCollapsed={isStaticSectionCollapsed}></StaticSection>
        </div>
      )}
    </>
  );
}

export default App;
