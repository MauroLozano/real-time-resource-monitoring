import React from 'react';
import styles from './CpuHeatMap.module.css';
import { ErrorIcon } from '../ui/icons/Icons';
import { useMetrics } from '../../context/MetricsProvider';
import { useStaticData } from '../../context/StaticDataProvider';
import getErrorMsg from '../../utils/errorHandler';
import { metricsIds } from '../../constants/metricsIds';
const coreSquare = (coreTemp, isOnlySingleSensor) => {
  if(isOnlySingleSensor){
    const hue = 120 - coreTemp * 1.2;
    const color = `hsl(${hue}, 100%, 66%)`;
    return(
      <div
        className={`${styles.square} ${styles.singleSensor}`}
        style={{ backgroundColor: `${color}` }}
        title={`CPU Temperature`}
      >
        <p className={`${styles.squareLabel} `}>CPU</p>
        <p className={styles.squareUnitSingleSensor}>C°</p>
        <p style={{ textAlign: 'center' }}>{`${coreTemp}`}</p>
      </div>
    )
  }else{
    const hue = 120 - coreTemp.value * 1.2;
    const color = `hsl(${hue}, 100%, 66%)`;
    <div
      key={coreTemp.coreNumber}
      className={`${styles.square} ${isOnlySingleSensor ? styles.singleSensor : styles.multipleSensors}`}
      style={{ backgroundColor: `${color}` }}
      title={`Core ${coreTemp.coreNumber}: ${coreTemp.value} C°`}
    >
      <p className={`${styles.squareIndex} `}>{coreTemp.coreNumber}</p>
      <p className={styles.squareUnit}>C°</p>
      <p style={{ textAlign: 'center' }}>{`${coreTemp.value}`}</p>
    </div>
  }
};

export default function CpuHeatMap() {
  const { staticData } = useStaticData();
  const { cpuTempData, sensorsHealth} = useMetrics();
  const hasCoresData = cpuTempData.coresTemp && cpuTempData.coresTemp.length > 1;
  const isOnlySingleSensor = sensorsHealth.cpu.temp.hasTemp && !sensorsHealth.cpu.temp.hasCoresTemp
  const coreCount = hasCoresData
    ? coresTemp.length
    : isOnlySingleSensor
      ? 1
      : staticData?.cpu
        ? staticData.cpu.physicalCores
        : 0;

  const safeTotal = Math.max(1, coreCount);
  const columns = Math.ceil(Math.sqrt(safeTotal));
  const rows = Math.ceil(safeTotal / columns);

  return (
    <div className={styles.cpuHeatMapContent}>
      {hasCoresData ? (
        <h2 className={styles.title}>Cores Temperature</h2>
      ) : isOnlySingleSensor ? (
        <h2 className={styles.title}>CPU Temperature</h2>
      ) : (
        <div className={styles.error}>
          <h2 className={styles.title}>No sensors detected</h2>
        </div>
      )}
      <div
        className={styles.cpuHeatMapGrid}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {hasCoresData ? (
          cpuTempData.coresTemp.map((entry) =>
            coreSquare(entry, isOnlySingleSensor)
          )
        ) : isOnlySingleSensor ? (
          coreSquare(cpuTempData.cpuTemp, isOnlySingleSensor)
        ) : (
          <>
            <div className={styles.blurErrorIcon}>
              <ErrorIcon
                error={getErrorMsg(
                  metricsIds.CORES_TEMP,
                  staticData.os.platform
                )}
              ></ErrorIcon>
            </div>
            {Array.from({ length: staticData.cpu.physicalCores }).map(
              (_, index) => (
                <div
                  key={index}
                  className={`${styles.square} ${styles.squareInactive}`}
                ></div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
