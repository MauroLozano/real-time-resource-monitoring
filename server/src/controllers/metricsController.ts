import { Server, Socket } from 'socket.io';
import { getProcessesData } from '../services/processesService.js';
import { getCpuData } from '../services/cpuService.js';
import { getMemoryData } from '../services/memoryService.js';
import { getCpuTempData } from '../services/cpuTempService.js';
import { getOsData } from '../services/osService.js';
import type { DynamicData } from '../types/metrics.js';
import type { ProcessesData } from '../types/processes.js';
import type { CpuTempServiceResponse } from '../types/temperature.js';
let lastProcessesData: ProcessesData | null = null 
let lastDynamicData: DynamicData | null = null
let lastCpuTempData: CpuTempServiceResponse | null
export const initMetricsMonitoring = (io: Server)=>{
    async function loop5sec(){
        if(io.engine.clientsCount > 0){
            try{
                const [processesData, cpuTempData] = await Promise.all([
                    getProcessesData(),
                    getCpuTempData()
                ])
                lastProcessesData = processesData
                lastCpuTempData = cpuTempData
                io.emit('cpuTempData', cpuTempData)
                io.emit('processesData', processesData)
            }catch(error){
                console.error("Error in 5sec monitor loop:", error)
            }
        }
        setTimeout(loop5sec, 5000)
    }
    async function loop2sec(){
        if(io.engine.clientsCount > 0){
            try{
                const [cpuData, memoryData, osData] = await Promise.all([
                    getCpuData(),
                    getMemoryData(),
                    getOsData()
                ])
                const dynamicData: DynamicData = {
                    cpu: cpuData,
                    memory: memoryData,
                    os: osData,
                    timestamp: new Date().toLocaleTimeString("it-IT"),
                }
                lastDynamicData = dynamicData 
                io.emit('dynamicData', dynamicData)
            }catch(error){
                console.error("Error in sending DyanmicData:", error)
            }
        }
        setTimeout(loop2sec, 2000)
    }   
    loop2sec()
    loop5sec()

    io.on('conection', (socket: Socket) =>{
        console.log(`Client connected: ${socket.id} | Total: ${io.engine.clientsCount}`)
        if(lastCpuTempData) socket.emit('cpuTempData', lastCpuTempData)
        if(lastProcessesData) socket.emit('processesData', lastProcessesData)
        if(lastDynamicData) socket.emit('dynamicData', lastDynamicData)
        socket.on('disconnect', ()=>{
            console.log(`Client disconnected. Remaining: ${io.engine.clientsCount}`)
        })
    })
}