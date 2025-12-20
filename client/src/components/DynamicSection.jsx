import React from "react";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')
function DynamicSection(){
    useEffect(()=>{
        socket.on('dynamicData', (data)=>{
            console.log(data)
        })
        return ()=> socket.off('dynamicData')
    },[])
    return(
        <h2>Dynamic Data</h2>
    )
}
export default DynamicSection