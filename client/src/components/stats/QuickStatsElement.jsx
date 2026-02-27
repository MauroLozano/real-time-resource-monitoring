import React from 'react';
import styles from './QuickStatsElement.module.css';
import { useStaticData } from '../../context/StaticDataProvider';
import { ErrorIcon } from '../ui/icons/Icons';
import getErrorMsg from '../../utils/errorHandler';
export default function QuickStatsElement({
  title,
  data,
  unit,
  label,
  id,
  reason,
}) {
  const hasError = data === null || data === undefined || reason;
  const { staticData } = useStaticData();
  const platform = staticData?.os?.platform || 'unknown';
  const errorMsg = hasError ? getErrorMsg(id, platform, reason) : null;
  return (
    <div className={styles.elementContainer}>
      <h1 className={styles.title}>{title}</h1>
      {label && <p className={styles.label}>{label}</p>}
      {hasError ? (
        <ErrorIcon error={errorMsg}></ErrorIcon>
      ) : (
        <p className={styles.data}>
          {data}
          {unit && <span className={styles.unit}>{unit}</span>}
        </p>
      )}
    </div>
  );
}
