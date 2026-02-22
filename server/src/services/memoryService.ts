import si from 'systeminformation';
import type { MemoryData } from '../types/metrics.js';

export const getMemoryData = async (): Promise<MemoryData> =>{
    const [rawMemoryData] = await Promise.all([
        si.mem()
    ])
    const memoryData = {
        free: parseFloat((rawMemoryData.free / (1024 ** 3)).toFixed(2)),
        used: parseFloat((rawMemoryData.used / (1024 ** 3)).toFixed(2)),
    }
    return memoryData
}