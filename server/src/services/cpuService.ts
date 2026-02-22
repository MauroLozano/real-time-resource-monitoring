import si from 'systeminformation';
import type { CpuData } from '../types/metrics.js';

function getParkedCores(coresLoad: number[]){
    let counter = 0
    coresLoad.forEach(load => {
        if (load == 0) counter ++
    });
    return counter
}
function getActiveThreadsCount(coresLoad: number[]){
    let counter = 0
    coresLoad.forEach(load => {
        if (load > 5) counter ++
    });
    return counter
}
export const getCpuData = async (): Promise<CpuData> => {
    // Getting raw data from SystemInformation library
    const [rawCpuLoad, rawCpuSpeed] = await Promise.all([
        si.currentLoad(),
        si.cpuCurrentSpeed(),
    ])
    // Data calculations
    const coresLoadArray = rawCpuLoad.cpus.map((coreData)=>{
        return parseFloat(coreData.load.toFixed(2))
    })
    const totalThreadsCount = coresLoadArray.length
    const activeThreadsCount = getActiveThreadsCount(coresLoadArray)
    const threadEfficiency = totalThreadsCount > 0 ? parseFloat(((activeThreadsCount/totalThreadsCount) * 100).toFixed(2)) : 0
    let coreOverload:number = 0
    const maxCoreLoad:number = totalThreadsCount > 0 ? Math.max(...coresLoadArray) : 0
    if (coresLoadArray && coresLoadArray.length > 0) {
        coreOverload = parseFloat((maxCoreLoad - rawCpuLoad.currentLoad).toFixed(2))
    }
    const mostActiveCore = {
        coreNumber: coresLoadArray.indexOf(maxCoreLoad),
        value: maxCoreLoad 
    }
    // Declaration of Data to send
    const cpuData: CpuData = {
        load: rawCpuLoad.currentLoad,
        speed: rawCpuSpeed.avg,
        coresLoad: coresLoadArray,
        coresSpeed: rawCpuSpeed.cores,
        coreOverload: coreOverload,
        mostActiveCore: mostActiveCore,
        parkedCores: getParkedCores(coresLoadArray), //
        activeThreadsCount: activeThreadsCount, //
        threadEfficiency: threadEfficiency,
    }
    return cpuData 
}