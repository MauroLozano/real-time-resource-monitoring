import React from "react";
import styles from '../css/QuickStatsElement.module.css'
export default function QuickStatsElement({title, data, unit, label}){
    return(
        <div className={styles.elementContainer}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.data}> {label?(<span>{label}</span>) : ''} {`${data}`}<span className={styles.unit}>{`${unit && (data != 'Error') ? unit : ''}`}</span> </p>
        </div>
    )
}