import React from 'react';
import styles from './ProcessEntry.module.css';

export default function ProcessEntry({ processData, index }) {
  if (!processData && !index) {
    return (
      <div className={`${styles.processEntry} ${styles.emptyProcess}`}></div>
    );
  }
  return (
    <div className={styles.processEntry}>
      <p className={styles.processInfo}>{index + 1}</p>
      <p className={styles.processInfo}>{`${processData.cpu.toFixed(2)}%`}</p>
      <p className={styles.processInfo}>{processData.pid}</p>
      <p className={styles.processInfo}>{processData.parentPid}</p>
      <p className={styles.processInfo}>{processData.name}</p>
      <p className={styles.processInfo}>{`${processData.mem.toFixed(2)}%`}</p>
      <p className={styles.processInfo}>{processData.started}</p>
    </div>
  );
}
