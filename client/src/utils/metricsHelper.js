export const getMaxValues = (prevValues, newValues)=>{
    let newMax = {...prevValues}
    if (newValues.cpuLoad !== undefined){
        const currentLoad = parseFloat(newValues.cpuLoad.toFixed(2))
        if(!newMax.cpuLoad || newMax.cpuLoad < currentLoad){
            newMax.cpuLoad = currentLoad
        }
    }
    if(newValues.coresSpeed !== undefined){
        newValues.coresSpeed.forEach((coreSpeed, i) =>{
            if(newMax.coreSpeed.coreNumber === null || coreSpeed > newMax.coreSpeed.value){
                newMax.coreSpeed = {coreNumber: i,value: coreSpeed}
            }
        })
    }
    if(newValues.cpuTemp !== undefined){
        if(!newMax.cpuTemp || newMax.cpuTemp < newValues.cpuTemp){
            newMax.cpuTemp = newValues.cpuTemp
        }
    }
    return newMax
}
