import si from "systeminformation"
import os from "os" 
import type { StaticData } from "../types/staticData.js"
export const getStaticData = async (): Promise<StaticData>  => {
    const [rawCpuData, rawMemoryData, rawMemoryLayoutData, rawStorageData] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.memLayout(),
        si.diskLayout()
    ])
    const staticData: StaticData = {
        os: {
            platform: os.platform(),
            hostname: os.hostname(),
            architecture: os.arch(),
            release: os.release(),
            type: os.type()
        },
        cpu:{
            manufacturer: rawCpuData.manufacturer ?? null,
            brand: rawCpuData.brand ?? null,
            physicalCores: rawCpuData.physicalCores ?? null,
            logicalThreads: rawCpuData.cores ?? null,

        },
        memory: {
            total: rawMemoryData.total ? parseFloat((rawMemoryData.total / (1024 ** 3)).toFixed(2)) : null,
            memorySlots: rawMemoryLayoutData.map((slot) => ({
                size: slot.size ?? null,
                manufacturer: slot.manufacturer ?? null,
                type: slot.type ?? null,
                clockSpeed: slot.clockSpeed ?? null,
            })),
        }, 
        storage: rawStorageData.map(disk=>({
            name: disk.name ?? null,
            type: disk.type ?? null,
            size: disk.size? parseFloat((disk.size / (1024 ** 3)).toFixed(2)) : null
        }))
    }
    return staticData
}