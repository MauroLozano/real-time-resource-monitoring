import React, { use } from 'react';
import styles from './ProcessesDisplay.module.css';
import ProcessEntry from './ProcessEntry';
import { useMetrics } from '../../context/MetricsProvider';
import { ErrorIcon } from '../ui/icons/Icons';
import getErrorMsg from '../../utils/errorHandler';
import { metricsIds } from '../../constants/metricsIds';
import { useStaticData } from '../../context/StaticDataProvider';
export default function ProcessesDisplay() {
  const { staticData } = useStaticData();
  const { processesData = {} } = useMetrics();
  const topProcesses = processesData.topProcesses;
  const isDataValid = Array.isArray(topProcesses);
  return (
    <div className={styles.processesDisplay}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>#</p>
        <p className={styles.headerTitle}>CPU</p>
        <p className={styles.headerTitle}>PID</p>
        <p className={styles.headerTitle}>Parent PID</p>
        <p className={styles.headerTitle}>Name</p>
        <p className={styles.headerTitle}>Memory</p>
        <p className={styles.headerTitle}>Started</p>
      </div>
      <div className={styles.processesContainer}>
        {isDataValid ? (
          topProcesses.map((process, index) => (
            <ProcessEntry
              key={process.pid}
              processData={process}
              index={index}
            />
          ))
        ) : (
          <>
            <div className={styles.blurErrorIcon}>
              <ErrorIcon
                error={getErrorMsg(
                  metricsIds.PROCESSES_DISPLAY,
                  staticData.os.platform
                )}
              ></ErrorIcon>
            </div>
            {Array.from({ length: 10 }).map((_, index) => (
              <ProcessEntry key={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
