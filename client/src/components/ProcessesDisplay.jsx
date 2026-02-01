import React from "react";
import styles from '../css/ProcessesDisplay.module.css'
import ProcessEntry from "./ProcessEntry";
import { useMetrics } from "../context/MetricsProvider";
export default function ProcessesDisplay(){
    const {processesData: {topProcesses: processesList}} = useMetrics()
    return(
        <div className={styles.processesDisplay}>
            <div className={styles.header}>
                <p className={styles.headerTitle}>#</p>
                <p className={styles.headerTitle}>CPU</p>
                <p className={styles.headerTitle}>PID</p>
                <p className={styles.headerTitle}>Parent PID</p>
                <p className={styles.headerTitle}>Name</p>
                <p className={styles.headerTitle}>Memory</p>
                <p className={styles.headerTitle}>Started</p>
            </div>
            {
                processesList.map((process, index)=>(
                    <ProcessEntry key={index} processData={process} index={index}/>
                ))
            }
        </div>
    )
}