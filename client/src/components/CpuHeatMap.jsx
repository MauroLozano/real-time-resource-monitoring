import React from "react";
import styles from '../css/CpuHeatMap.module.css'


const coreSquare = (load, index)=>{
    const hue = 120 - (load * 1.2)
    const color = `hsl(${hue}, 100%, 66%)`
    return(
        <div className={styles.square} style={{backgroundColor:`${color}`}} title={`Core ${index}: ${load} %`}>
            <p className={styles.squareIndex}>{index}</p>
            <p style={{textAlign: 'center'}}>{`${load}`}</p>
        </div>
    )
}

export default function CpuHeatMap({data}){
    return(
        <div className={styles.cpuHeatMapGrid} style={{gridTemplateColumns:`repeat(${Math.ceil(Math.sqrt(data.length))},1fr)`, gridTemplateRows:`repeat(${Math.sqrt(data.length)},1fr)`}}>
            {
                data.map((coreLoad, index)=>(
                    coreSquare(coreLoad,index)
                ))
            }
        </div>
    )
}