import type { CoreTemp, CpuTempServiceResponse } from '../types/temperature.js';
import { formattedFloat } from '../utils/formatter.js';
import { getWmiTemperature } from '../utils/cpuTempService.js';
import { cpu } from 'systeminformation';

export const getCpuTempData = async (): Promise<CpuTempServiceResponse> => {
  let wmiData = await getWmiTemperature();
  const coresTemp: CoreTemp[] | null = wmiData.coresTemp;
  let thermalHeadroom: number | null = 0;
  if (coresTemp && coresTemp?.length > 0) {
    const coresTempValues: number[] = coresTemp.map((entry) => {
      return entry.value;
    });
    thermalHeadroom = formattedFloat(100 - Math.max(...coresTempValues));
  } else if (wmiData.packageTemp != null) {
    thermalHeadroom = formattedFloat(100 - wmiData.packageTemp);
  }

  const cpuTempData: CpuTempServiceResponse = {
    cpuTemp: wmiData.packageTemp,
    coresTemp: coresTemp && coresTemp?.length > 0 ? coresTemp : null,
    thermalHeadroom: thermalHeadroom,
  };
  return cpuTempData;
};
