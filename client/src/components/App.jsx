import { useState, useEffect } from "react";
// Components
import useSystemData from "../hooks/useSystemData";
import StaticSection from "./StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
import MemAreaChart from './charts/MemAreaChart'
import MemPieChart from './charts/MemPieChart'
import Sidebar from "./Sidebar";
import DynamicSection from './DynamicSection'
import LoadingModal from './LoadingModal'
import QuickStatsGeneral from "./QuickStatsGeneral";
import QuickStatsCores from "./QuickStatsCores";
import ProcessesDisplay from "./ProcessesDisplay";
import CpuHeatMap from "./cpuHeatMap";
// Style
import styles from '../css/App.module.css'

function getAvgLoad(history){
    if(!history) return
    let sum = 0
    history.forEach(entry => {
        sum += entry.cpuLoad
    });
    return (sum / history.length).toFixed(2);
}

function App() {
  const [activeView, setActiveView] = useState('CPUGeneralView')
  const {history, staticData, maxValues} = useSystemData()

  const currentData = history.length > 0 ? history.at(-1) : null;
  const isDataAvailable = staticData && history.length > 0

  return (
    <div className={styles.wrapper}>

      <Sidebar setView={setActiveView} activeView={activeView}></Sidebar>

      <DynamicSection className={`${styles.dynamicSection} ${styles.viewContainer}`}>
        {/* === CPU GENERAL VIEW === */}
        <div className={`${styles.cpuGeneralView} ${styles.view} ${activeView === 'CPUGeneralView' ? styles.activeView : ''}`}>
          <div className={`${styles.cpuGeneralChart}`}>
            {isDataAvailable ? (<CpuChart data={history} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>  
          <div className={styles.quickStatsContainer}>{
            isDataAvailable ?
            <QuickStatsGeneral 
              cpuSpeedAvg={currentData.cpuSpeed.avg} 
              cpuMaxSpeed={currentData.cpuSpeed.max}
              cpuTempAvg = {currentData.cpuTemp ? currentData.cpuTemp.avg : null}
              cpuTempMax = {currentData.cpuTemp ? currentData.cpuTemp.max : null}
              cpuAvgLoad = {getAvgLoad(history)}
              cpuMaxLoad= {maxValues.cpuLoad}
              uptime = {currentData.uptime}
              numberProcesses = {currentData.numberProcess}/>
            : (<LoadingModal color='#6ac9bf' />)
          }</div>
          <div className={styles.processesContainer}>{
            history.length > 0 ? (<ProcessesDisplay processesList={currentData.topProcesses} />) : (<LoadingModal color='#6ac9bf' />)
          }</div>
        </div>
        {/* === CPU CORES VIEW === */}
        <div className={`${styles.cpuCoresView} ${styles.view} ${activeView === 'CPUCoresView' ? styles.activeView : ''}`}>
          <div className={`${styles.cpuCoresChart}`}>
            {isDataAvailable ? (<CpuCoresChart data={history} amountCores={staticData.cpu.cores} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
          <div className={styles.quickStatsContainer}>{
            isDataAvailable ?
            <QuickStatsCores
              coreTempMax={maxValues.coreTemp ? maxValues.coreTemp : null}
              coreSpeedMax={maxValues.coreSpeed ? maxValues.coreSpeed : null}
            />
            : (<LoadingModal color='#6ac9bf' />)
          }</div>
          <div className={styles.cpuHeatMapContainer}>
            {isDataAvailable ? (<CpuHeatMap data={currentData.coresLoad}  coresTemp={currentData.coresTemp}/>) : (<LoadingModal color='#6ac9bf' />)}
          </div>
        </div>
        {/* === MEMORY VIEW === */}
        <div className={`${styles.memView} ${styles.view} ${activeView === 'MEMAvailableView' ? styles.activeView : ''}`}>
          <div className={`${styles.memAreaChart}`}>
            {isDataAvailable ? (<MemAreaChart data={history} totalMem={staticData.memory.total} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
          <div className={`${styles.memPieChart}`}>
            {isDataAvailable ? (<MemPieChart data={history} totalMem={staticData.memory.total} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
        </div>
      </DynamicSection>

      <StaticSection staticData={staticData}></StaticSection>

    </div>
  )
}

export default App
