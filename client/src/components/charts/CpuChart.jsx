import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from "react";
import { useMetrics } from '../../context/MetricsProvider';
export default function CpuChart() {
  const {history: data} = useMetrics()
  if(!data || data.length === 0) {
    return(
      <div>
        <LoadingModal color='#6ac9bf'></LoadingModal>
      </div>
    )
  }
  return (
    <LineChart
      style={{ backgroundColor: '#ffffff', padding: '1rem 1rem 0 0', borderRadius: '1rem'}}
      responsive
      data={data}
      width={'100%'}
      height={'100%'}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
      <XAxis dataKey={'timestamp'} />
      <YAxis domain={[0, 100]} unit='%'/>
      <Tooltip />
      <Legend iconType='circle'/>
      <Line type="monotone" dataKey="cpuLoad" stroke="#e95a5aff" strokeWidth={3} activeDot={{ r: 8 }} isAnimationActive={false}/>
    </LineChart>
  );
}