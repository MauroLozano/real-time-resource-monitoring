import express from 'express';
import os from 'os'
import { createServer } from 'http'
import { Server } from 'socket.io';
import cors from 'cors'
import si from 'systeminformation';
import { timeStamp } from 'console';
import { uptime } from 'process';

const app = express()
const port = 3000
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer,{
    cors: {
        origin: "*",
    }
})

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
            const [rawCpuLoad, rawCpuSpeed, rawCpuTemp, rawMemoryData] = await Promise.all([
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.cpuTemperature(),
                si.mem(),
            ])
            
            const dynamicData = {
                cpuLoad: rawCpuLoad.currentLoad,
                cpuSpeed: rawCpuSpeed,
                coresLoad: rawCpuLoad.cpus.map((coreData)=>{
                    return parseFloat(coreData.load.toFixed(2))
                }),
                cpuTemp: rawCpuTemp.main == null ? null : {
                    avg: rawCpuTemp.main,
                    max: rawCpuTemp.max
                },
                coresTemp: rawCpuTemp.cores,
                memFree: parseFloat((rawMemoryData.free / (1024 ** 3)).toFixed(2)),
                memUsed: parseFloat((rawMemoryData.used / (1024 ** 3)).toFixed(2)),
                timestamp: new Date().toLocaleTimeString("it-IT"),
                uptime: os.uptime(),
            }
            socket.emit('dynamicData', dynamicData)
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
