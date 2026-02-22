import { exec } from 'child_process';
import util from 'util'
const execPromise = util.promisify(exec)
import type { WmiCpuTempResponse, CoreTemp } from '../types/temperature.js';
import { formattedFloat } from './formatter.js';

export async function getWmiTemperature(): Promise<WmiCpuTempResponse> {
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
        const packageTemp = packageSensor ? formattedFloat(packageSensor.Value) : null
        return {coresTemp, packageTemp}

    }catch(error){
        console.log("WMI Error (LHM not detected)");
        return fallback
    }
}