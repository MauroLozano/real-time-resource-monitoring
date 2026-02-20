import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from "react";
import { useMetrics } from '../../context/MetricsProvider';
import styles from './ChartsStyle.module.css'
export default function CpuChart() {
  const {history: data} = useMetrics()
  return (
    <LineChart
      className={styles.chart}
      responsive
      data={data}
      width={'100%'}
      height={'100%'}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false}/>
      <XAxis dataKey={'timestamp'} stroke='#e0e0e0'/>
      <YAxis domain={[0, 100]} unit='%' stroke='#e0e0e0'/>
      <Tooltip wrapperClassName={styles.tooltip} />
      <Legend iconType='circle'/>
      <Line type="monotone" dataKey="cpuLoad" stroke="#e71d36" strokeWidth={3} activeDot={{ r: 8 }} isAnimationActive={false}/>
    </LineChart>
  );
}