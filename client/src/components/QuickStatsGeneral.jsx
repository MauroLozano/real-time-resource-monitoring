import React from "react";
import styles from '../css/QuickStats.module.css'
import QuickStatsElement from "./QuickStatsElement";
export default function QuickStatsGeneral({cpuSpeedAvg, cpuMaxSpeed, cpuTempAvg, cpuTempMax, cpuAvgLoad, cpuMaxLoad, uptime, numberProcesses}) {
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='CPU Avg. Speed' data={cpuSpeedAvg ? cpuSpeedAvg : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='CPU Max. Speed'  data={cpuMaxSpeed ? cpuMaxSpeed : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='CPU Avg. Temp.' data={cpuTempAvg ? cpuTempAvg : 'Error'} unit='°C'/>
            <QuickStatsElement title ='CPU Max. Temp.' data={cpuTempMax ? cpuTempMax : 'Error'} unit='°C'/>
            <QuickStatsElement title ='CPU Avg. Load' data={cpuAvgLoad ? cpuAvgLoad : 'Error'} unit='%'/>
            <QuickStatsElement title ='CPU Max. Load' data={cpuMaxLoad ? cpuMaxLoad : 'Error'} unit='%'/>
            <QuickStatsElement title ='Uptime' data={uptime ? ((uptime)/3600).toFixed(2) : 'Error'} unit='h'/>
            <QuickStatsElement title ='Number of Processes' data={numberProcesses ? numberProcesses : 'Error'}/>
        </aside>
    )
}