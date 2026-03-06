import React from 'react';
import styles from './QuickStats.module.css';
import QuickStatsElement from './QuickStatsElement';
import { useMetrics } from '../../context/MetricsProvider';

import { metricsIds } from '../../constants/metricsIds';
export default function QuickStatsGeneral() {
  const { currentData, cpuTempData, maxValues, processesData, computedStats } =
    useMetrics();
  const {
    cpu,
    os,
  } = currentData || {};
  const { total: numberProcesses } = processesData || {};
  const {
    cpuLoad: cpuMaxLoad,
    coreSpeed: cpuMaxSpeed,
  } = maxValues || {};
  return (
    <aside className={styles.quickStats}>
      <QuickStatsElement
        title="CPU Avg. Speed"
        data={cpu.speed}
        id={metricsIds.CPU_AVG_SPEED}
        unit="GHz"
      />
      <QuickStatsElement
        title="CPU Max. Speed"
        data={cpuMaxSpeed.value}
        id={metricsIds.CPU_MAX_SPEED}
        unit="GHz"
      />
      <QuickStatsElement
        title="CPU Avg. Temp."
        data={cpuTempData.cpuTemp}
        id={metricsIds.CPU_AVG_TEMP}
        unit="°C"
      />
      <QuickStatsElement
        title="CPU Max. Temp."
        data={maxValues.cpuTemp}
        id={metricsIds.CPU_MAX_TEMP}
        unit="°C"
      />
      <QuickStatsElement
        title="CPU Avg. Load"
        data={cpu.load}
        id={metricsIds.CPU_AVG_LOAD}
        unit="%"
      />
      <QuickStatsElement
        title="CPU Max. Load"
        data={cpuMaxLoad}
        id={metricsIds.CPU_MAX_LOAD}
        unit="%"
      />
      <QuickStatsElement
        title="Uptime"
        data={(os.uptime / 3600).toFixed(2)}
        id={metricsIds.UPTIME}
        unit="h"
      />
      <QuickStatsElement
        title="Number of Processes"
        data={numberProcesses}
        id={metricsIds.NUMBER_PROCESSES}
      />
    </aside>
  );
}
