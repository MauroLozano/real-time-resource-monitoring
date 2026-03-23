import type { CoreTemp, CpuTempServiceResponse } from '../types/temperature.js';
import { formattedFloat } from '../utils/formatter.js';
import { getWmiTemperature } from '../utils/cpuTempService.js';
import si from "systeminformation";
import { platform } from 'node:os';

export const getCpuTempData = async (): Promise<CpuTempServiceResponse> => {
  let cpuTempData: CpuTempServiceResponse = { coresTemp: null, cpuTemp: null, thermalHeadroom: null };
  if (platform() == "linux") {
    let rawSiData = await si.cpuTemperature();

    let cpuTemp: number | null = rawSiData.main > 0 ? rawSiData.main : null;

    let coresTemp: CoreTemp[] | null = rawSiData.cores.length > 0 ? rawSiData.cores.map((entry, i) => {
      const coreNumber = i;
      return {
        coreNumber: coreNumber,
        value: entry,
      }
    }) : null;

    cpuTempData = {
      cpuTemp: cpuTemp,
      coresTemp: coresTemp,
      thermalHeadroom: getThermalHeadroom(coresTemp, cpuTemp),
    };

  } else if (platform() == "win32") {
    let wmiData = await getWmiTemperature();
    const coresTemp: CoreTemp[] | null = wmiData.coresTemp;
    let cpuTemp: number | null = wmiData.packageTemp ? wmiData.packageTemp : null;
    const thermalHeadroom = getThermalHeadroom(coresTemp, cpuTemp);

    cpuTempData = {
      cpuTemp: cpuTemp,
      coresTemp: coresTemp && coresTemp?.length > 0 ? coresTemp : null,
      thermalHeadroom: thermalHeadroom,
    };
  }
  return cpuTempData;
};

function getThermalHeadroom(coresTemp: CoreTemp[] | null, cpuTemp: number | null): number | null {
  let thermalHeadroom: number | null = null;
  if (coresTemp && coresTemp?.length > 0) {
    const coresTempValues: number[] = coresTemp.map((entry) => {
      return entry.value;
    });
    thermalHeadroom = formattedFloat(100 - Math.max(...coresTempValues));
  } else if (cpuTemp != null) {
    thermalHeadroom = formattedFloat(100 - cpuTemp);
  }
  return thermalHeadroom
}
