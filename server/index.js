import express from 'express';
import cors from 'cors'
import si from 'systeminformation';

const app = express()
const port = 3000
app.use(cors())

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
        res.status(500).json({error: error.message, message:"Error trying to obtain system data"})
    }
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
