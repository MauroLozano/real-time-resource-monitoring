import React from "react";
import styles from '../css/QuickStats.module.css'
import QuickStatsElement from "./QuickStatsElement";
export default function QuickStats({cpuSpeedAvg}) {
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='CPU Avg. Speed' data={cpuSpeedAvg ? cpuSpeedAvg : 'Error'}/>
            <QuickStatsElement title ='CPU Max. Speed' />
            <QuickStatsElement title ='CPU Temp.' />
            <QuickStatsElement title ='CPU Max. Temp.' />
            <QuickStatsElement title ='CPU Load' />
            <QuickStatsElement title ='CPU Max. Load' />
            <QuickStatsElement title ='Uptime' />
            <QuickStatsElement title ='Number of Processes' />
        </aside>
    )
}