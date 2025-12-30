    import React from "react";
    import styles from '../css/CpuHeatMap.module.css'
    import exclamationSvg from '../assets/svg/exclamation-circle.svg'
    let coresTempAvailable = null
    const coreSquare = (temp, index)=>{
        const hue = 120 - (temp * 1.2)
        const color = `hsl(${hue}, 100%, 66%)`
        return(
            <div key={index} className={styles.square} style={{backgroundColor:`${color}`}} title={`Core ${index}: ${temp} C°`}>
                <p className={styles.squareIndex}>{index}</p>
                <p style={{textAlign: 'center'}}>{`${temp}`}</p>
            </div>
        )
    }

    export default function CpuHeatMap({data}){
        coresTempAvailable = !data || data.length == 0 ? false : true
        return(
            <div className={styles.cpuHeatMapGrid} style={{gridTemplateColumns:`repeat(${Math.ceil(Math.sqrt(data.length))},1fr)`, gridTemplateRows:`repeat(${Math.sqrt(data.length)},1fr)`}}>
                {
                    coresTempAvailable ? 
                    data.map((coreTemp, index)=>(
                        coreSquare(coreTemp, index)
                    ))
                    :
                    <div className={styles.error}>
                        <img width={'100%'} src={exclamationSvg}></img>
                    </div>
                }
            </div>
        )
    }