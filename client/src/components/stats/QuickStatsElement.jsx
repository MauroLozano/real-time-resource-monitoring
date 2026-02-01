import React from "react";
import styles from './QuickStatsElement.module.css'
export default function QuickStatsElement({title, data, unit, label}){
    return(
        <div className={styles.elementContainer}>
            <h1 className={styles.title}>{title}</h1>
            {label?(<p className={styles.label}>{label}</p>) : ''}
            <p className={styles.data}>  {`${data}`}<span className={styles.unit}>{`${unit && (data != 'Error') ? unit : ''}`}</span> </p>
        </div>
    )
}