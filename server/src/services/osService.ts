
import os from 'os'
import type { OsData } from '../types/metrics.js'

export const getOsData = async (): Promise<OsData>=>{
    const osData = {
        uptime: os.uptime(),
    }
    return osData
}