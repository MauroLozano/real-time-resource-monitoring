import express, { raw } from 'express';
import os, { platform } from 'os'
import { createServer, validateHeaderName } from 'http'
import { Server } from 'socket.io';
import cors from 'cors'
import si from 'systeminformation';
import { exec } from 'child_process';
import util from 'util'
import { clearTimeout } from 'timers';
const execPromise = util.promisify(exec)
const app = express()
const port = 3000
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors: {
        origin: "*",
    }
})

function getParkedCores(coresLoad){
    if (!coresLoad) return
    let counter = 0
    coresLoad.forEach(load => {
        if (load == 0) counter ++
    });
    return counter
}
async function getWmiTemperature() {
    const fallback = {coresTemp: [], packageTemp: 0, gpuTemp: 0}
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
        const coresTemp = data.filter(entry =>{
            return entry.Name.includes('Core') &&
                !entry.Name.includes('Tctl') &&
                !entry.Name.includes('GPU')
        }).map(entry =>{
            const match = entry.Name.match(/\d+/)
            const coreNumber = match ? parseInt(match[0]) : 0
            return {
                coreNumber: coreNumber,
                value: entry.Value
            }
        }).sort((a, b) => a.coreNumber - b.coreNumber)
        const packageSensor = data.find(entry => entry.Name.includes('Tctl') || entry.Name.includes('Package'));
        const packageTemp = packageSensor ? parseFloat(packageSensor.Value.toFixed(1)) : 0
        const gpuSensor = data.find(entry => entry.Name.includes('GPU'));
        const gpuTemp = gpuSensor ? parseFloat(gpuSensor.Value.toFixed(1)) : 0
        return {coresTemp, packageTemp, gpuTemp}
    }catch(error){
        console.log("WMI Error (LHM not detected)");
        return fallback
    }
}
function getActiveThreadsCount(coresLoad){
    if (!coresLoad) return
    let counter = 0
    coresLoad.forEach(load => {
        if (load > 5) counter ++
    });
    return counter
}
app.get('/staticData', async (req, res) => {
    try {
        const [rawCpuData, rawMemoryData, rawStorageData] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.diskLayout()
        ])
        const staticData = {
            os: {
                platform: os.platform(),
                hostname: os.hostname(),
                architecture: os.arch(),
                release: os.release(),
                type: os.type()
            },
            cpu:{
                manufacturer: rawCpuData.manufacturer,
                brand: rawCpuData.brand,
                physicalCores: rawCpuData.physicalCores,
                logicalThreads: rawCpuData.cores
            },
            memory:{
                total: parseFloat((rawMemoryData.total / (1024 ** 3)).toFixed(2))
            },
            storage: rawStorageData.map(disk=>({
                name: disk.name,
                type: disk.type,
                size: parseFloat((disk.size / (1024 ** 3)).toFixed(2))
            }))
        }
        res.status(200).json(staticData)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error.message, message:"Error trying to obtain static system data"})
    }
})


io.on('connection', (socket)=>{
    console.log(`Client connected: ${socket.id}`)
    let isClientActive = true
    let dynamicTimeoutId;
    let processesTimeoutId;
    let tempTimoutId;
    async function loopProcessesData(){
        if (!isClientActive) return
        try{
            const rawProcessesData = await si.processes()
            let topProcesses = rawProcessesData.list
                .filter((p) => p.name !== 'System Idle Process' && p.name !== 'Idle' && p.cpu > 0)
                .sort((a,b)=>{
                    return (b.cpu - a.cpu)
                }).slice(0, 10)
            const processesData ={
                topProcesses: topProcesses,
                total: rawProcessesData.list.length
            }
            socket.emit('processesData', processesData)
        }catch(error){
            console.error("Error in loopProcessesData:", error)
        }finally{
            if(isClientActive){
                processesTimeoutId = setTimeout(loopProcessesData, 5000)
            }
        }
    }
    async function loopDynamicData(){
        if (!isClientActive) return
        try{
            // Getting raw data from SystemInformation library
            const [rawCpuLoad, rawCpuSpeed, rawMemoryData] = await Promise.all([
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.mem(),
            ])
            // Data calculations
            const coresLoadArray = rawCpuLoad.cpus.map((coreData)=>{
                return parseFloat(coreData.load.toFixed(2))
            })
            const totalThreadsCount = coresLoadArray.length
            const activeThreadsCount = getActiveThreadsCount(coresLoadArray)
            const threadEfficiency = totalThreadsCount > 0 ? ((activeThreadsCount/totalThreadsCount) * 100).toFixed(2) : 0
            let coreOverload = 0
            if (coresLoadArray && coresLoadArray.length > 0) {
                const maxCoreLoad = Math.max(...coresLoadArray)
                coreOverload = (maxCoreLoad - rawCpuLoad.currentLoad).toFixed(2)
            }
            const mostActiveCore = {
                coreNumber: coresLoadArray.indexOf(Math.max(...coresLoadArray)),
                value: Math.max(...coresLoadArray)
            }
            // Declaration of Data to send
            const dynamicData = {
                cpuLoad: rawCpuLoad.currentLoad,
                cpuSpeed: rawCpuSpeed,
                coresLoad: coresLoadArray,
                coreOverload: coreOverload,
                mostActiveCore: mostActiveCore,
                parkedCores: getParkedCores(coresLoadArray),
                activeThreadsCount: activeThreadsCount,
                threadEfficiency: threadEfficiency,
                memFree: parseFloat((rawMemoryData.free / (1024 ** 3)).toFixed(2)),
                memUsed: parseFloat((rawMemoryData.used / (1024 ** 3)).toFixed(2)),
                timestamp: new Date().toLocaleTimeString("it-IT"),
                uptime: os.uptime(),
            }
            socket.emit('dynamicData', dynamicData)
        }catch(error){
            console.error("Error in loopDynamicData:", error)
        }finally{
            if(isClientActive){
                dynamicTimeoutId = setTimeout(loopDynamicData, 2000)
            }
        }
    }   
    async function loopTempData() {
        if (!isClientActive) return
        try{
            const [wmiData] = await Promise.all([
                getWmiTemperature()
            ])
            const coresTemp = wmiData.coresTemp
            let thermalHeadroom = 0
            if(coresTemp.length > 0){
                const coresTempValues = coresTemp.map(entry =>{
                    return entry.value
                })
                thermalHeadroom = parseFloat((100 - Math.max(...coresTempValues)).toFixed(2))
            }else {thermalHeadroom = null}

            const tempData ={
                cpuTemp: wmiData.packageTemp || null,
                coresTemp: coresTemp?.length > 0 ? coresTemp : null,
                thermalHeadroom: thermalHeadroom,
                gpuTemp: wmiData.gpuTemp || null 
            }
            socket.emit('tempData',tempData)            
        }catch(error){
            console.error("Error in loopTempData:", error)
        }finally{
            if(isClientActive){
                tempTimoutId = setTimeout(loopTempData, 5000)
            }
        }
    }
    loopDynamicData()
    loopProcessesData()
    loopTempData()
    socket.on('disconnect', ()=>{
        console.log(`Client disconnected: ${socket.id}`)
        isClientActive = false
        clearTimeout(processesTimeoutId)
        clearTimeout(dynamicTimeoutId)
        clearTimeout(tempTimoutId)
    })
})

httpServer.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
