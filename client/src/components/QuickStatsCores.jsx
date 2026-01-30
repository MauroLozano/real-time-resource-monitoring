import React from "react";
import QuickStatsElement from "./QuickStatsElement";
import styles from '../css/QuickStats.module.css'
export default function QuickStatsCores({coreTempMax, thermalHeadroom,coreSpeedAvg, coreSpeedMax, coreOverload, mostActiveCore, parkedCores, threadEfficiency, activeThreadsCount, totalThreads}){
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='Core Max. Temp' label={`${coreTempMax ? `Core ${coreTempMax[0]}` : 'Core -'}`} data={coreTempMax ? coreTempMax[1] : 'Error'} unit='°C'/>
            <QuickStatsElement title ='Thermal Headroom' data={thermalHeadroom ?? 'Error'} unit='°C'/>
            <QuickStatsElement title ='Core Avg. Speed' data={coreSpeedAvg ?? 'Error'} unit='GHz'/>
            <QuickStatsElement title ='Core Max. Speed' label={`${coreSpeedMax ? `Core ${coreSpeedMax[0]}` : 'Core -'}`} data={coreSpeedMax ? coreSpeedMax[1] : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='Core Overload' data={coreOverload ?? 'Error'} unit='%'/>
            <QuickStatsElement title ='Most Active Core' label={`${mostActiveCore?.index ? `Core ${mostActiveCore.index}` : 'Core -'}`} data={mostActiveCore?.value ?? 'Error'} unit='%'/>
            <QuickStatsElement title ='Parked Cores' data={parkedCores ? `${parkedCores.parked}/${parkedCores.total}` : 'Error'}/>
            <QuickStatsElement title ='Thread Efficiency' label={`${threadEfficiency ? `${activeThreadsCount}/${totalThreads}` : '-'}`} data={threadEfficiency ? `${threadEfficiency}` : 'Error'} unit='%'/>
        </aside>
    )
}
