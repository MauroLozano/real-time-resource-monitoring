import si from 'systeminformation';
import type { MemoryData } from '../types/metrics.js';
import { byteToGb, formattedFloat } from '../utils/formatter.js';

export const getMemoryData = async (): Promise<MemoryData> => {
  const [rawMemoryData] = await Promise.all([si.mem()]);
  const memoryData = {
    free: formattedFloat(byteToGb(rawMemoryData.free)),
    used: formattedFloat(byteToGb(rawMemoryData.used)),
  };
  return memoryData;
};
