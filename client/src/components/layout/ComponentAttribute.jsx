import React from "react";
import styles from './ComponentAttribute.module.css'
export default function ComponentAttribute({label, value}){
    const hasError = value === null || value === undefined ||value === ''
    return(
        <div className={styles.attributeContainer}>
            <span className={styles.label}>{label}</span>
            <span className={`${styles.value} ${hasError ? styles.unknown : ''}`}>{hasError? 'Unknown':value}</span>
        </div>
    )
}