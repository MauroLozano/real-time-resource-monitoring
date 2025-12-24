import { useState, useEffect } from "react";
const serverUrl = 'http://localhost:3000'
// Components
import StaticSection from "./StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
import MemAreaChart from './charts/MemAreaChart'
import MemPieChart from './charts/MemPieChart'
import Sidebar from "./Sidebar";
import DynamicSection from './DynamicSection'
import LoadingModal from './LoadingModal'
// Style
import styles from '../css/App.module.css'
// sockets
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000')


function App() {
  const [activeView, setActiveView] = useState('CPUGeneralView')
  const [history, setHistory] = useState([])
  const [staticData, setStaticData] = useState(null) 
  useEffect(()=>{
    fetch(`${serverUrl}/staticData`)
      .then((res)=>{
        if(!res.ok) console.error('Server error') 
        return res.json()
      })
      .then(data =>{ 
        setStaticData(data)
      })
      .catch(error => console.error(error))
      socket.on('dynamicData', (data)=>{
        setHistory((prevHistory)=>{
          let updatedHistory = [...prevHistory, data]
          if (updatedHistory.length > 20) {
            updatedHistory = updatedHistory.slice(1)
          }
          return updatedHistory
        })
      })
    return ()=> socket.off('dynamicData')
  },[])
  return (
    <div className={styles.wrapper}>
      <Sidebar setView={setActiveView} activeView={activeView}></Sidebar>
      <DynamicSection className={`${styles.dynamicSection} ${styles.viewContainer}`}>
        {/* CPU */}
        <div className={`${styles.cpuGeneralView} ${styles.view} ${activeView === 'CPUGeneralView' ? styles.activeView : ''}`}>
          <div className={`${styles.cpuGeneralChart}`}>
            {staticData && history.length > 0 ? (<CpuChart data={history} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
        </div>
        {/* CPU Cores */}
        <div className={`${styles.cpuCoresView} ${styles.view} ${activeView === 'CPUCoresView' ? styles.activeView : ''}`}>
          <div className={`${styles.cpuCoresChart}`}>
            {staticData && history.length > 0 ? (<CpuCoresChart data={history} amountCores={staticData.cpu.cores} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
        </div>
        {/* Memory */}
        <div className={`${styles.memView} ${styles.view} ${activeView === 'MEMAvailableView' ? styles.activeView : ''}`}>
          <div className={`${styles.memAreaChart}`}>
            {staticData && history.length > 0 ? (<MemAreaChart data={history} totalMem={staticData.memory.total} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
          <div className={`${styles.memPieChart}`}>
            {staticData && history.length > 0 ? (<MemPieChart data={history} totalMem={staticData.memory.total} />) : (<LoadingModal color='#6ac9bf' />)}
          </div>
        </div>
      </DynamicSection>
      <StaticSection staticData={staticData}></StaticSection>
    </div>
  )
}

export default App
