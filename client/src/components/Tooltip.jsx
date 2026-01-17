import React from "react";
import styles from '../css/Tooltip.module.css'
export function Tooltip({text, showTooltip}){
    return(
        <div className={`${showTooltip ? styles.visible : ''} ${styles.tooltip}`}>
            <p style={{textAlign:"center"}}>{text}</p>
        </div>
    )
}