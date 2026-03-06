import si from 'systeminformation';
import type { CpuData } from '../types/metrics.js';
import {
  getParkedCores,
  getActiveThreadsCount,
} from '../utils/cpuServiceUtils.js';
import { formattedFloat } from '../utils/formatter.js';

export const getCpuData = async (): Promise<CpuData> => {
  // Getting raw data from SystemInformation library
  const [rawCpuLoad, rawCpuSpeed] = await Promise.all([
    si.currentLoad(),
    si.cpuCurrentSpeed(),
  ]);

  const cpuData: CpuData = {
    load: null,
    speed: null,
    coresLoad: null,
    coresSpeed: null,
    coreOverload: null,
    mostActiveCore: null,
    parkedCores: null,
    activeThreadsCount: null,
    threadEfficiency: null,
  };

  const hasLoadData =
    rawCpuLoad && rawCpuLoad.cpus && rawCpuLoad.cpus.length > 0;

  if (hasLoadData) {
    cpuData.load = rawCpuLoad.currentLoad;

    cpuData.coresLoad = rawCpuLoad.cpus.map((coreData) => {
      return formattedFloat(coreData.load);
    });

    cpuData.activeThreadsCount = getActiveThreadsCount(cpuData.coresLoad);

    cpuData.threadEfficiency =
      cpuData.activeThreadsCount > 0
        ? formattedFloat(
            (cpuData.activeThreadsCount / cpuData.coresLoad.length) * 100
          )
        : 100;

    const maxCoreLoad: number = Math.max(...cpuData.coresLoad);

    cpuData.coreOverload = formattedFloat(maxCoreLoad - rawCpuLoad.currentLoad);

    cpuData.parkedCores = getParkedCores(cpuData.coresLoad);

    cpuData.mostActiveCore = {
      coreNumber: cpuData.coresLoad.indexOf(maxCoreLoad),
      value: maxCoreLoad,
    };
  }

  const hasSpeedData = rawCpuSpeed && rawCpuSpeed.avg > 0;

  if (hasSpeedData) {
    cpuData.speed = rawCpuSpeed.avg;
    const firstCoreSpeed = rawCpuSpeed.cores[0];
    cpuData.coresSpeed =
      rawCpuSpeed.cores.length > 0 && firstCoreSpeed && firstCoreSpeed > 0
        ? rawCpuSpeed.cores
        : null;
  }

  return cpuData;
};
