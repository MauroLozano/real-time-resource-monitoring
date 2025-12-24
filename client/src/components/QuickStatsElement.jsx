import React from "react";
import styles from '../css/QuickStatsElement.module.css'
export default function QuickStatsElement({title, data}){
    return(
        <div className={styles.elementContainer}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.data}>{data}</p>
        </div>
    )
}