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
  // Data calculations
  const coresLoadArray = rawCpuLoad.cpus.map((coreData) => {
    return formattedFloat(coreData.load);
  });
  const totalThreadsCount = coresLoadArray.length;
  const activeThreadsCount = getActiveThreadsCount(coresLoadArray);
  const threadEfficiency =
    totalThreadsCount > 0
      ? formattedFloat((activeThreadsCount / totalThreadsCount) * 100)
      : 0;
  let coreOverload: number = 0;
  const maxCoreLoad: number =
    totalThreadsCount > 0 ? Math.max(...coresLoadArray) : 0;
  if (coresLoadArray && coresLoadArray.length > 0) {
    coreOverload = formattedFloat(maxCoreLoad - rawCpuLoad.currentLoad);
  }
  const mostActiveCore = {
    coreNumber: coresLoadArray.indexOf(maxCoreLoad),
    value: maxCoreLoad,
  };
  // Declaration of Data to send
  const cpuData: CpuData = {
    load: formattedFloat(rawCpuLoad.currentLoad),
    speed: rawCpuSpeed.avg,
    coresLoad: coresLoadArray,
    coresSpeed: rawCpuSpeed.cores,
    coreOverload: coreOverload,
    mostActiveCore: mostActiveCore,
    parkedCores: getParkedCores(coresLoadArray), //
    activeThreadsCount: activeThreadsCount, //
    threadEfficiency: threadEfficiency,
  };
  return cpuData;
};
