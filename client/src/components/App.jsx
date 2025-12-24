import { useState, useEffect } from "react";
const serverUrl = 'http://localhost:3000'
// Components
import StaticSection from "./StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
import MemAvailableChart from './charts/MemAvailableChart'
import Sidebar from "./Sidebar";
import DynamicSection from './DynamicSection'
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
        <div className={`${styles.view} ${styles.cpuGeneralView} ${activeView === 'CPUGeneralView' ? styles.activeView : ''}`}>
          <CpuChart data={history} />
        </div>
        <div className={`${styles.view} ${styles.cpuCoresView} ${activeView === 'CPUCoresView' ? styles.activeView : ''}`}>
          {staticData && <CpuCoresChart data={history} amountCores={staticData.cpu.cores} />}
        </div>
        <div className={`${styles.view} ${styles.memView} ${activeView === 'MEMAvailableView' ? styles.activeView : ''}`}>
          { staticData && <MemAvailableChart data={history} totalMem={staticData.memory.total} />}
        </div>
      </DynamicSection>
      <StaticSection staticData={staticData}></StaticSection>
    </div>
  )
}

export default App
