import express from 'express';
import os from 'os'
import { createServer, validateHeaderName } from 'http'
import { Server } from 'socket.io';
import cors from 'cors'
import si from 'systeminformation';
import { error, timeStamp } from 'console';
import { exitCode, uptime } from 'process';
import { exec } from 'child_process';
import util from 'util'
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

async function getWmiTemperature() {
    const fallback = {coresTemp: [], packageTemp: 0, gpuTemp: 0}
    try{
        const cmd = `powershell "Get-CimInstance -Namespace 'root\\LibreHardwareMonitor' -ClassName Sensor -ErrorAction SilentlyContinue | Where-Object { $_.SensorType -eq 'Temperature' -and ($_.Name -like '*Core*' -or $_.Name -like 'Temperature #*' -or $_.Name -like '*GPU*') } | Select-Object Name, Value | ConvertTo-Json"`;
        const { stdout } = await execPromise(cmd)
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
        console.error("WMI Error (LHM not detected):", error.message);
        return fallback
    }
}
app.get('/staticData', async (req, res) => {
    try {
        const [rawCpuData, rawMemoryData, rawStorageData] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.diskLayout()
        ])
        const staticData = {
            cpu:{
                manufacturer: rawCpuData.manufacturer,
                brand: rawCpuData.brand,
                cores: rawCpuData.cores
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
    try {
        async function emitProcessesData(){
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
        }
        async function emitDynamicData(){
            const [wmiData, rawCpuLoad, rawCpuSpeed, rawMemoryData] = await Promise.all([
                getWmiTemperature(),
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.mem(),
            ])
            const dynamicData = {
                cpuLoad: rawCpuLoad.currentLoad,
                cpuSpeed: rawCpuSpeed,
                coresLoad: rawCpuLoad.cpus.map((coreData)=>{
                    return parseFloat(coreData.load.toFixed(2))
                }),
                memFree: parseFloat((rawMemoryData.free / (1024 ** 3)).toFixed(2)),
                memUsed: parseFloat((rawMemoryData.used / (1024 ** 3)).toFixed(2)),
                timestamp: new Date().toLocaleTimeString("it-IT"),
                uptime: os.uptime(),
                cpuTemp: wmiData.packageTemp,
                coresTemp: wmiData.coresTemp,
                gpuTemp: wmiData.gpuTemp
            }
            socket.emit('dynamicData', dynamicData)
            console.log(dynamicData)
        }   
        emitDynamicData()
        emitProcessesData()
        const intervalIdDynamicData = setInterval(()=>{emitDynamicData()}, 2000)
        const intervalIdProcessesData = setInterval(()=>{emitProcessesData()}, 5000)
        socket.on('disconnect', ()=>{
            console.log(`Client disconnected: ${socket.id}`)
            clearInterval(intervalIdDynamicData)
            clearInterval(intervalIdProcessesData)
        })
        
    } catch (error) {
        console.error(error)
    }
})

httpServer.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
