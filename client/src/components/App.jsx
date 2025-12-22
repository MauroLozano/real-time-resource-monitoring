import { useState, useEffect } from "react";
// Components
import StaticSection from "./StaticSection";
import CpuChart from "./charts/CpuChart";
import CpuCoresChart from "./charts/CpuCoresChart";
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
  useEffect(()=>{
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
        {activeView === 'CPUCoresView' && <CpuCoresChart data={history}></CpuCoresChart>}
      </DynamicSection>
      <StaticSection></StaticSection>
    </div>
  )
}

export default App
