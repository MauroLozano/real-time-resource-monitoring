import React from "react";
import QuickStatsElement from "./QuickStatsElement";
import styles from '../css/QuickStats.module.css'
export default function QuickStatsCores({coreTempMax, coreSpeedMax, coreOverload}){
    return (
        <aside className={styles.quickStats}>
            <QuickStatsElement title ='Core Max. Temp' label={`${coreTempMax ? `Core ${coreTempMax[0]}` : 'Core -'}: `} data={coreTempMax ? coreTempMax[1] : 'Error'} unit='°C'/>
            <QuickStatsElement title ='Core Max. Speed' label={`${coreSpeedMax ? `Core ${coreSpeedMax[0]}` : 'Core -'}: `} data={coreSpeedMax ? coreSpeedMax[1] : 'Error'} unit='GHz'/>
            <QuickStatsElement title ='Core Overload' data={coreOverload ? coreOverload : 'Error'} unit='%'/>
        </aside>
    )
}
