import React from "react";
import QuickStatsElement from "./QuickStatsElement";
import styles from '../css/QuickStats.module.css'
export default function QuickStatsCores({coreMaxSpeed, coreMaxTemp}){
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='Core Max. Temp' label={`${coreMaxTemp ? `Core ${coreMaxTemp[0]}` : 'Core -'}: `} data={coreMaxTemp ? coreMaxTemp[1] : 'Error'} unit='°C'/>
            <QuickStatsElement title ='Core Max. Speed' label={`${coreMaxSpeed ? `Core ${coreMaxSpeed[0]}` : 'Core -'}: `} data={coreMaxSpeed ? coreMaxSpeed[1] : 'Error'} unit='GHz'/>
        </aside>
    )
}
