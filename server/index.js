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
        const intervalId = setInterval(async ()=>{
            const [rawCpuLoad, rawCpuSpeed, rawCpuTemp, rawMemoryData, rawProcessesData] = await Promise.all([
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.cpuTemperature(),
                si.mem(),
                si.processes()
            ])
            const dynamicData = {
                cpuLoad: rawCpuLoad.currentLoad,
                cpuSpeed: rawCpuSpeed,
                cpuTemp: rawCpuTemp.main == null ? null : {
                    avg: rawCpuTemp.main,
                    max: rawCpuTemp.max
                },
                memFree: parseFloat((rawMemoryData.free / (1024 ** 3)).toFixed(2)),
                memUsed: parseFloat((rawMemoryData.used / (1024 ** 3)).toFixed(2)),
                timestamp: new Date().toLocaleTimeString("it-IT"),
                numberProcess: rawProcessesData.list.length,
                uptime: os.uptime()
            }
            socket.emit('dynamicData', dynamicData)
        },2000)
        socket.on('disconnect', ()=>{
            console.log(`Client disconnected: ${socket.id}`)
            clearInterval(intervalId)
        })
    } catch (error) {
        console.error(error)
    }
})

httpServer.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
