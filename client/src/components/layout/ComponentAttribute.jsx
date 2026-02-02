import React from "react";
import styles from './ComponentAttribute.module.css'
export default function ComponentAttribute({label, value}){
    return(
        <>
            <div className={styles.attributeContainer}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>
            </div>
        </>
    )
}