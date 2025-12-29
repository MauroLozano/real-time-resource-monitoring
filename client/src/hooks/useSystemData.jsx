import React from "react";
import { useState, useEffect } from "react";

const serverUrl = 'http://localhost:3000'
// Sockets
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000')

export default function useSystemData(){
    const [history, setHistory] = useState([])
    const [processesData, setProcessesData] = useState({})
    const [coreOverload, setCoreOverload] = useState(null)
    const [staticData, setStaticData] = useState(null)
    const [maxValues, setMaxValues] = useState({
        cpuLoad: null,
        coreTemp: null,
        coreSpeed: null
    })
    function updateMaxValues(cpuLoad, coresTemp, coresSpeed){
        const formattedLoad = parseFloat(cpuLoad.toFixed(2))
        setMaxValues((prevValues)=>{
            let newMaxValues = {...prevValues}
            if(!newMaxValues.cpuLoad || newMaxValues.cpuLoad < formattedLoad) newMaxValues.cpuLoad = formattedLoad
            coresTemp.forEach((temp, index)=>{
                if(!newMaxValues.coreTemp || newMaxValues.coreTemp[1] < temp) newMaxValues.coreTemp = [index, temp]
            })
            coresSpeed.forEach((speed, index)=>{
                if(!newMaxValues.coreSpeed || newMaxValues.coreSpeed[1] < speed) newMaxValues.coreSpeed = [index, speed]
            })
            return newMaxValues
        })
    }

    useEffect(()=>{
        fetch(`${serverUrl}/staticData`)
        .then((res)=>{
        if(!res.ok) console.error('Server error') 
        return res.json()
        })
        .then(data =>{ 
        setStaticData(data)
        })
        .catch(error => console.error(error))
        socket.on('dynamicData', (data)=>{
            setHistory((prevHistory)=>{
                let updatedHistory = [...prevHistory, data]
                if (updatedHistory.length > 20) {
                updatedHistory = updatedHistory.slice(1)
                }
                return updatedHistory
            })
            updateMaxValues(data.cpuLoad, data.coresTemp || [],data.cpuSpeed.cores || [])
            let overload = 0
            if (data.coresLoad && data.coresLoad.length > 0) {
                const maxCoreLoad = Math.max(...data.coresLoad)
                overload = (maxCoreLoad - data.cpuLoad).toFixed(2)
            }
            setCoreOverload(overload)
        })
        socket.on('processesData',(processesData)=>{
            setProcessesData(processesData)
        })
        return ()=>{
            socket.off('dynamicData')
            socket.off('processesData')
        } 
    },[])
    return {history, staticData, maxValues, coreOverload, processesData}
}