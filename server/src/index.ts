import express from 'express';
import cors from 'cors'
import { createServer } from 'http'
import { Server } from "socket.io"; 
import { initMetricsMonitoring } from './controllers/metricsController.js';
import { getStaticData } from './services/staticDataService.js';

const port = 3000
const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer,{
    cors: {
        origin: "*",
    }
})
initMetricsMonitoring(io)

app.get('/api/staticData', async (req, res) => {
    try {
        const staticData = await getStaticData()
        res.status(200).json(staticData)
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({
                error: error.message,
                message: "Error trying to obtain static system data"
            })
        }
        return res.status(500).json({
            message: "An unknown error ocurred"
        })
    }
})

httpServer.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

const serverShutdown = ()=> {
    console.log('Stopping Server')
    httpServer.close(() =>{
        console.log('HTTP Server Closed')
        process.exit(0)
    })
}
process.on('SIGINT', serverShutdown)
process.on('SIGTERM', serverShutdown)