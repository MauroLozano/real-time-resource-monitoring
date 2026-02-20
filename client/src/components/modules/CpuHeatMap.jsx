import React from "react";
import styles from './CpuHeatMap.module.css'
import { ErrorIcon } from "../ui/icons/Icons";
import { useMetrics } from "../../context/MetricsProvider";
import { useStaticData } from "../../context/StaticDataProvider";
import getErrorMsg from "../../utils/errorHandler";
import { metricsIds } from "../../constants/metricsIds";
const coreSquare = (temp, index, isOnlySingleSensor)=>{
    const hue = 120 - (temp * 1.2)
    const color = `hsl(${hue}, 100%, 66%)`
    return(
        <div key={index} className={`${styles.square} ${isOnlySingleSensor? styles.singleSensor : styles.multipleSensors}`} style={{backgroundColor:`${color}`}} title={`Core ${index}: ${temp} C°`}>
            {
                isOnlySingleSensor? 
                <>
                    <p className={`${styles.squareLabel} `}>CPU</p>
                    <p className={styles.squareUnitSingleSensor}>C°</p>
                </>
                :
                <>
                    <p className={`${styles.squareIndex} `}>{index}</p>
                    <p className={styles.squareUnit}>C°</p>
                </>
            }
            <p style={{textAlign: 'center'}}>{`${temp}`}</p>
        </div>
    )
}

export default function CpuHeatMap(){
    const { staticData } = useStaticData()
    const { tempData } = useMetrics()
    const { coresTemp, cpuTemp } = tempData

    const hasCoresData = coresTemp && coresTemp.length > 0
    const isOnlySingleSensor = !coresTemp && (cpuTemp > 0)
    const coreCount = hasCoresData ? coresTemp.length :isOnlySingleSensor? 1 : staticData?.cpu ? staticData.cpu.physicalCores : 0

    const safeTotal = Math.max(1, coreCount)
    const columns = Math.ceil(Math.sqrt(safeTotal))
    const rows = Math.ceil(safeTotal / columns)
    return(
        <div className={styles.cpuHeatMapContent}>
            {
                hasCoresData ?
                <h2 className={styles.title}>Cores Temperature</h2>
                : isOnlySingleSensor?
                <h2 className={styles.title}>CPU Temperature</h2>
                :
                <div className={styles.error}>
                    <h2 className={styles.title}>No sensors detected</h2>
                </div>
            }
            <div className={styles.cpuHeatMapGrid} 
                style={{ 
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
            >
                {
                    hasCoresData ?
                    coresTemp.map((entry, index)=>(
                        coreSquare(entry, index, isOnlySingleSensor)
                    ))
                    : isOnlySingleSensor?
                    Array.of(cpuTemp).map((coreTemp, index)=>(
                        coreSquare(coreTemp, index, isOnlySingleSensor)
                    ))
                    :
                    <>
                        <div className={styles.blurErrorIcon}>
                            <ErrorIcon error={getErrorMsg(metricsIds.CORES_TEMP,staticData.os.platform )}></ErrorIcon>
                        </div>
                        {
                            Array.from({length: staticData.cpu.physicalCores}).map((_, index)=>(
                                <div key={index} className={`${styles.square} ${styles.squareInactive}`}></div>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    )
}