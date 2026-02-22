import { exec } from 'child_process';
import util from 'util'
const execPromise = util.promisify(exec)
import type { WmiCpuTempResponse, CoreTemp, CpuTempServiceResponse} from '../types/temperature.js';

async function getWmiTemperature(): Promise<WmiCpuTempResponse> {
    const fallback: WmiCpuTempResponse = {coresTemp: null, packageTemp: null}
    try{
        const cmd = `powershell "Get-CimInstance -Namespace 'root\\LibreHardwareMonitor' -ClassName Sensor -ErrorAction SilentlyContinue | Where-Object { $_.SensorType -eq 'Temperature' -and ($_.Name -like '*Core*' -or $_.Name -like 'Temperature #*' -or $_.Name -like '*GPU*') } | Select-Object Name, Value | ConvertTo-Json"`;
        const { stdout } = await execPromise(cmd, {timeout: 4000})
        if (!stdout) return fallback
        let data
        try{
            data = JSON.parse(stdout)
        }catch(error){
            return fallback
        }
        if(!Array.isArray(data)){
            data = [data]
        }
        const filteredCores: CoreTemp[] = data.filter(entry =>(
            entry?.Name?.includes('Core') && !entry?.Name?.includes('Tctl')
        )).map(entry =>{
            const value = typeof entry.Value === 'number' ? entry.Value : 0
            const match = entry.Name.match(/\d+/)
            const coreNumber = match ? parseInt(match[0]) : 0
            return {
                coreNumber: coreNumber,
                value: value
            }
        }).sort((a, b) => a.coreNumber - b.coreNumber)
        const coresTemp = filteredCores.length > 0 ? filteredCores : null
        const packageSensor = data.find(entry => entry.Name.includes('Tctl') || entry.Name.includes('Package'));
        const packageTemp = packageSensor ? parseFloat(packageSensor.Value.toFixed(1)) : null
        return {coresTemp, packageTemp}

    }catch(error){
        console.log("WMI Error (LHM not detected)");
        return fallback
    }
}

export const getCpuTempData = async (): Promise<CpuTempServiceResponse> =>{
    let wmiData = await getWmiTemperature()
    const coresTemp: CoreTemp[] | null= wmiData.coresTemp
    let thermalHeadroom: number | null = 0
    if( coresTemp && coresTemp?.length > 0){
        const coresTempValues: number[] = coresTemp.map(entry =>{
            return entry.value
        })
        thermalHeadroom = parseFloat((100 - Math.max(...coresTempValues)).toFixed(2))
    }else if(wmiData.packageTemp != null){
        thermalHeadroom = parseFloat((100 - wmiData.packageTemp).toFixed(2))
    }

    const cpuTempData: CpuTempServiceResponse ={
        cpuTemp: wmiData.packageTemp,
        coresTemp: coresTemp && coresTemp?.length > 0 ? coresTemp : null,
        thermalHeadroom: thermalHeadroom,
    }
    return cpuTempData
}