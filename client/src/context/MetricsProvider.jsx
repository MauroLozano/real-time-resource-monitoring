import React, { useState, useEffect, useContext, createContext, useMemo } from "react";
// Sockets
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000')

const MetricsContext = createContext(null)

export const MetricsProvider = ({children})=>{
    const [history, setHistory] = useState([])
    const [processesData, setProcessesData] = useState({})
    const [tempData, setTempData] = useState(null)
    const [maxValues, setMaxValues] = useState({
        cpuLoad: null,
        cpuTemp: null,
        coreSpeed: {coreNumber: null, value: 0}
    })

    function updateMaxValues(newData){
        setMaxValues((prev) =>{
            let newMax = {...prev}
            if (newData.cpuLoad !== undefined){
                const currentLoad = parseFloat(newData.cpuLoad.toFixed(2))
                if(!newMax.cpuLoad || newMax.cpuLoad < currentLoad){
                    newMax.cpuLoad = currentLoad
                }
            }
            if(newData.coresSpeed !== undefined){
                newData.coresSpeed.forEach((coreSpeed, i) =>{
                    if(newMax.coreSpeed.coreNumber === null || coreSpeed > newMax.coreSpeed.value){
                        newMax.coreSpeed = {coreNumber: i,value: coreSpeed}
                    }
                })
            }
            if(newData.cpuTemp !== undefined){
                if(!newMax.cpuTemp || newMax.cpuTemp < newData.cpuTemp){
                    newMax.cpuTemp = newData.cpuTemp
                }
            }
            return newMax
        })
    }

    const cpuAvgLoad = useMemo(()=>{
        if(history.length === 0) return 0
        let sumCpuLoad = 0;
        history.forEach((entry) => {
            sumCpuLoad += entry.cpuLoad;
        });
        const result = parseFloat((sumCpuLoad / history.length).toFixed(2));
        return result 
    }, [history])

    const coreMaxTemp = useMemo(()=>{
        if (!tempData?.coresTemp || tempData.coresTemp.length === 0) return {coreNumber: null, value: null}
        return tempData.coresTemp.reduce((max, current, i) =>{
            return current > max.value? {coreNumber: i, value: current} : max 
        }, {coreNumber: 0, value: tempData.coresTemp[0]})
    }, [tempData])
    
    const computedStats = {
        cpuAvgLoad,
        coreMaxTemp
    }
    const currentData = useMemo(()=>( history.length > 0 ? history.at(-1) : null), [history])  
    
    useEffect(()=>{
        socket.on('dynamicData', (data)=>{
            setHistory((prevHistory)=>{
                let updatedHistory = [...prevHistory, data]
                if (updatedHistory.length > 20) {
                    updatedHistory = updatedHistory.slice(1)
                }
                return updatedHistory
            })
            updateMaxValues({cpuLoad: data.cpuLoad, coresSpeed: data.cpuSpeed.cores || []})
        })
        socket.on('tempData', (tempData) =>{
            updateMaxValues({cpuTemp: tempData.cpuTemp})
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
    return(
        <MetricsContext.Provider value={{currentData, computedStats, history, processesData, tempData, maxValues}}>
            {children}
        </MetricsContext.Provider>
    )
}

export const useMetrics = ()=>{
    const context = useContext(MetricsContext)
    if (!context){
        throw new Error('useMetrics must be used inside a MetricsProvider')
    }
    return context
}