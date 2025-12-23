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
          if (updatedHistory.length > 25) {
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
      <DynamicSection className={styles.dynamicSection}>
        {activeView === 'CPUGeneralView' && <CpuChart data={history}></CpuChart>}
        {activeView === 'CPUCoresView' && staticData && <CpuCoresChart data={history} amountCores={staticData.cpu.cores}></CpuCoresChart>}
        {activeView === 'MEMAvailableView' && staticData && <MemAvailableChart data={history} totalMem={staticData.memory.total}></MemAvailableChart>}
      </DynamicSection>
      <StaticSection staticData={staticData}></StaticSection>
    </div>
  )
}

export default App
