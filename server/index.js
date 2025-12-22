import express from 'express';
import { createServer } from 'http'
import { Server } from 'socket.io';
import cors from 'cors'
import si from 'systeminformation';
import { timeStamp } from 'console';

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
                total: rawMemoryData.total
            },
            storage: rawStorageData.map(disk=>({
                name: disk.name,
                type: disk.type,
                size: disk.size
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
            const [rawCpuLoad, rawCpuSpeed, rawCpuTemp, rawMemoryData] = await Promise.all([
                si.currentLoad(),
                si.cpuCurrentSpeed(),
                si.cpuTemperature(),
                si.mem()
            ])
            const dynamicData = {
                cpuLoad: rawCpuLoad.currentLoad,
                cpuSpeed: rawCpuSpeed,
                cpuTemp: rawCpuTemp.main == null ? null : {
                    avg: rawCpuTemp.main,
                    max: rawCpuTemp.max
                },
                memFree: rawMemoryData.free,
                memUsed: rawMemoryData.used,
                timestamp: Date.now()
            }
            console.log('Emit')
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
