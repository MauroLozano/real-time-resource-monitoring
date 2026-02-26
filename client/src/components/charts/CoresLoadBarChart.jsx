import React, { use } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import styles from './chartsStyle.module.css'
import { useMetrics } from '../../context/MetricsProvider';
const colors = [
    '#e6194bff', '#3cb44b', '#4363d8', '#f58231', 
    '#911eb4', '#469990', '#f032e6', '#808000', 
    '#f9c74f', '#00b4d8', '#9a6324', '#ff6b6b', 
    '#574b90', '#2d6a4f', '#ff8f70', '#4682b4'
];
export default function SimpleBarChart(){
    const { currentData } = useMetrics()
    const data = currentData.coresLoad
    const chartData = data.map((load, index)=>({
        name: `Core ${index}`,
        load: load,
    }))
    return (
        <BarChart
        className={styles.chart}
        responsive
        data={chartData}
        style={{backgroundColor: '#292929', color: '#e0e0e0'}}
        margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
        }}
        >
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="name" stroke='#e0e0e0'/>
        <YAxis width="load" domain={[0, 100]} unit='%' stroke='#e0e0e0'/>
        <Tooltip wrapperClassName={styles.tooltip}/>
        <Bar dataKey="load" radius={[2, 2, 0, 0]}>
            {
                chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))
            }
        </Bar>
        <RechartsDevtools />
        </BarChart>
    );
};
