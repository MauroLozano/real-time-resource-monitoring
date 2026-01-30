import React from "react";
import { useState, useEffect } from "react";

const serverUrl = 'http://localhost:3000'
// Sockets
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000')


export default function useSystemData(){
    const [history, setHistory] = useState([])
    const [processesData, setProcessesData] = useState({})
    const [staticData, setStaticData] = useState(null)
    const [tempData, setTempData] = useState(null)
    const [maxValues, setMaxValues] = useState({
        cpuLoad: null,
        coreTemp: null,
        coreSpeed: null
    })

    function updateMaxValues(cpuLoad, coresTemp, coresSpeed, cpuTemp){
        const formattedLoad = parseFloat(cpuLoad.toFixed(2))
        setMaxValues((prevValues)=>{
            let newMaxValues = {...prevValues}
            if(!newMaxValues.cpuLoad || newMaxValues.cpuLoad < formattedLoad) newMaxValues.cpuLoad = formattedLoad
            coresTemp.forEach((entry)=>{
                if(!newMaxValues.coreTemp || newMaxValues.coreTemp[1] < entry.value) newMaxValues.coreTemp = [entry.coreNumber, entry.value]
            })
            coresSpeed.forEach((speed, index)=>{
                if(!newMaxValues.coreSpeed || newMaxValues.coreSpeed[1] < speed) newMaxValues.coreSpeed = [index, speed]
            })
            if(!newMaxValues.cpuTemp || newMaxValues.cpuTemp < cpuTemp) newMaxValues.cpuTemp = cpuTemp
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
            updateMaxValues(data.cpuLoad, data.coresTemp || [], data.cpuSpeed.cores || [], data.cpuTemp || 0)
        })
        socket.on('tempData', (tempData) =>{
            setTempData(tempData)
        })
        socket.on('processesData',(processesData)=>{
            setProcessesData(processesData)
        })
        return ()=>{
            socket.off('dynamicData')
            socket.off('processesData')
            socket.off('tempData')
        } 
    },[])
    return {history, staticData, maxValues, processesData, tempData}
}