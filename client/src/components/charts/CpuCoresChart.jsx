import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useMemo } from "react";
import { useStaticData } from '../../context/StaticDataProvider';
import { useMetrics } from '../../context/MetricsProvider';
import styles from './chartsStyle.module.css'
const colors = [
    '#e6194bff', '#3cb44b', '#4363d8', '#f58231', 
    '#911eb4', '#469990', '#f032e6', '#808000', 
    '#f9c74f', '#00b4d8', '#9a6324', '#ff6b6b', 
    '#574b90', '#2d6a4f', '#ff8f70', '#4682b4'
];
export default function CpuCoresChart(){
    const {history: data} = useMetrics()
    const { staticData } = useStaticData()
    const amountCores = staticData?.cpu?.logicalThreads || 0
    const lines = useMemo(()=>{
        if (amountCores.length === 0) return []
        return Array.from({length: amountCores}).map((_, i) => ({
            key: i,
            dataKey: `cpuSpeed.cores[${i}]`,
            stroke: colors[i % colors.length],
            name: `Core ${i.toString().padStart(2, '0')}`
        }))
    }, [amountCores]);

    return (
        <LineChart
            className={styles.chart}
            width={'100%'}
            height={'100%'}
            responsive
            data={data}
            margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={'timestamp'} stroke='#e0e0e0'/>
            <YAxis domain={[0, 10]} unit='GHz' stroke='#e0e0e0'/>
            <Tooltip wrapperClassName={styles.tooltip}/>
            <Legend iconType="circle" /> 
            {
                lines.map((line)=>(
                    <Line strokeWidth={'3px'} type='linear' key={line.key} dataKey={line.dataKey} stroke={line.stroke} dot={false} activeDot={false} isAnimationActive={false} name={line.name}/>
                ))
            }
            
        </LineChart>
    );
}
