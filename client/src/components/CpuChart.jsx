import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from "react";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')

export default function cpuChart() {
  const [history, setHistory] = useState([])
  useEffect(()=>{
      socket.on('dynamicData', (data)=>{
        setHistory((prevHistory)=>{
          let updatedHistory = [...prevHistory, data]
          if (updatedHistory.length > 25) {
            updatedHistory = updatedHistory.slice(1)
          }
          return updatedHistory
        })
      })
    return ()=> socket.off('dynamicData')
  },[])
  return (
    <LineChart
      width={800}
      height={500}
      responsive
      data={history}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={'timestamp'} />
      <YAxis domain={[0, 100]} unit='%'/>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="cpuLoad" stroke="#e95a5aff" activeDot={{ r: 8 }} isAnimationActive={false}/>
    </LineChart>
  );
}