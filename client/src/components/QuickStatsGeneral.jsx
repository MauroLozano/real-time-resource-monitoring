import React from "react";
import styles from '../css/QuickStats.module.css'
import QuickStatsElement from "./QuickStatsElement";
import { useMetrics } from "../context/MetricsProvider";
export default function QuickStatsGeneral() {
    const { currentData, tempData, maxValues, processesData, computedStats} = useMetrics()
    const {cpuSpeed: {avg:cpuSpeedAvg}, uptime} = currentData || {}
    const {total: numberProcesses} = processesData || {}
    const {cpuLoad: cpuMaxLoad, coreSpeed: cpuMaxSpeed, cpuTemp: cpuMaxTemp} = maxValues ||  {}
    const {cpuTemp: cpuAvgTemp} = tempData || {}
    const {cpuAvgLoad} = computedStats
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='CPU Avg. Speed' data={cpuSpeedAvg ? cpuSpeedAvg : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='CPU Max. Speed'  data={cpuMaxSpeed ? cpuMaxSpeed.value : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='CPU Avg. Temp.' data={cpuAvgTemp ? cpuAvgTemp : 'Error'} unit='°C'/>
            <QuickStatsElement title ='CPU Max. Temp.' data={cpuMaxTemp ? cpuMaxTemp : 'Error'} unit='°C'/>
            <QuickStatsElement title ='CPU Avg. Load' data={cpuAvgLoad ? cpuAvgLoad : 'Error'} unit='%'/>
            <QuickStatsElement title ='CPU Max. Load' data={cpuMaxLoad ? cpuMaxLoad : 'Error'} unit='%'/>
            <QuickStatsElement title ='Uptime' data={uptime ? ((uptime)/3600).toFixed(2) : 'Error'} unit='h'/>
            <QuickStatsElement title ='Number of Processes' data={numberProcesses ? numberProcesses : 'Error'}/>
        </aside>
    )
}