import React from 'react';
import QuickStatsElement from './QuickStatsElement';
import { useStaticData } from '../../context/StaticDataProvider';
import { useMetrics } from '../../context/MetricsProvider';
import styles from './QuickStats.module.css';
import { metricsIds } from '../../constants/metricsIds';
export default function QuickStatsCores() {
  const { currentData, tempData, computedStats, maxValues, sensorsHealth } =
    useMetrics();
  const {
    cpuSpeed: { avg: coreSpeedAvg },
    coreOverload,
    mostActiveCore,
    parkedCores,
    threadEfficiency,
    activeThreadsCount,
  } = currentData;
  const { thermalHeadroom } = tempData || {};
  const { coreSpeed: coreMaxSpeed } = maxValues;
  const { coreMaxTemp } = computedStats;
  const { staticData } = useStaticData();
  const totalThreads = staticData?.cpu?.logicalThreads || 0;
  return (
    <aside className={styles.quickStats}>
      <QuickStatsElement
        title="Core Max. Temp"
        label={`Core ${coreMaxTemp.index ?? '-'}`}
        data={coreMaxTemp.value}
        id={metricsIds.CORE_MAX_TEMP}
        reason={sensorsHealth?.cpu?.temp?.reason}
        unit="°C"
      />
      <QuickStatsElement
        title="Thermal Headroom"
        data={thermalHeadroom}
        id={metricsIds.THERMAL_HEADROOM}
        unit="°C"
      />
      <QuickStatsElement
        title="Core Avg. Speed"
        data={coreSpeedAvg}
        id={metricsIds.CORE_AVG_SPEED}
        unit="GHz"
      />
      <QuickStatsElement
        title="Core Max. Speed"
        label={`Core ${coreMaxSpeed.coreNumber ?? '-'}`}
        data={coreMaxSpeed.value}
        id={metricsIds.CORE_MAX_SPEED}
        unit="GHz"
      />
      <QuickStatsElement
        title="Core Overload"
        data={coreOverload}
        id={metricsIds.CORE_OVERLOAD}
        unit="%"
      />
      <QuickStatsElement
        title="Most Active Core"
        label={`Core ${mostActiveCore.coreNumber ?? '-'}`}
        data={mostActiveCore.value}
        id={metricsIds.MOST_ACTIVE_CORE}
        unit="%"
      />
      <QuickStatsElement
        title="Parked Cores"
        data={`${parkedCores}/${totalThreads}`}
        id={metricsIds.PARKED_CORES}
      />
      <QuickStatsElement
        title="Thread Efficiency"
        label={`${threadEfficiency ? `${activeThreadsCount}/${totalThreads}` : '-'}`}
        data={threadEfficiency}
        id={metricsIds.THREAD_EFFICIENCY}
        unit="%"
      />
    </aside>
  );
}
