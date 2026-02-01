import React from "react";
import QuickStatsElement from "./QuickStatsElement";
import { useStaticData } from '../../context/StaticDataProvider';
import { useMetrics } from "../../context/MetricsProvider";
import styles from './QuickStats.module.css'
export default function QuickStatsCores(){
    const {currentData, tempData, computedStats, maxValues } = useMetrics()
    const {cpuSpeed: {avg: coreSpeedAvg}, coreOverload, mostActiveCore, parkedCores, threadEfficiency, activeThreadsCount} = currentData
    const { thermalHeadroom } = tempData || {}
    const { coreSpeed: coreMaxSpeed } = maxValues
    const { coreMaxTemp } = computedStats
    const { staticData } = useStaticData()
    const totalThreads = staticData?.cpu?.logicalThreads || 0
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='Core Max. Temp' label={`Core ${coreMaxTemp.coreNumber?? '-'}`} data={coreMaxTemp ? coreMaxTemp.value : 'Error'} unit='°C'/>
            <QuickStatsElement title ='Thermal Headroom' data={thermalHeadroom ?? 'Error'} unit='°C'/>
            <QuickStatsElement title ='Core Avg. Speed' data={coreSpeedAvg ?? 'Error'} unit='GHz'/>
            <QuickStatsElement title ='Core Max. Speed' label={`Core ${coreMaxSpeed.coreNumber?? '-'}`} data={coreMaxSpeed ? coreMaxSpeed.value : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='Core Overload' data={coreOverload ?? 'Error'} unit='%'/>
            <QuickStatsElement title ='Most Active Core' label={`Core ${mostActiveCore.coreNumber?? '-'}`} data={mostActiveCore?.value ?? 'Error'} unit='%'/>
            <QuickStatsElement title ='Parked Cores' data={typeof parkedCores !== 'undefined' ? `${parkedCores}/${totalThreads}` : 'Error'}/>
            <QuickStatsElement title ='Thread Efficiency' label={`${threadEfficiency ? `${activeThreadsCount}/${totalThreads}` : '-'}`} data={threadEfficiency ? `${threadEfficiency}` : 'Error'} unit='%'/>
        </aside>
    )
}