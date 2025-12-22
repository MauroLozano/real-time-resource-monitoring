import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from "react";
const colors = [
    '#e6194b', '#3cb44b', '#4363d8', '#f58231', 
    '#911eb4', '#469990', '#f032e6', '#808000', 
    '#f9c74f', '#00b4d8', '#9a6324', '#ff6b6b', 
    '#574b90', '#2d6a4f', '#ff8f70', '#4682b4'
];
export default function CpuCoresChart({data, amountCores}) {
    const lines = Array.from({length: amountCores}).map((_, i) => ({
        key: i,
        dataKey: `cpuSpeed.cores[${i}]`,
        stroke: colors[i % colors.length],
        name: `Core ${i.toString().padStart(2, '0')}`
    }));

    return (
        <LineChart
            style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '1rem'}}
            width={800}
            height={500}
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
            <XAxis dataKey={'timestamp'} />
            <YAxis domain={[0, 10]} unit='GHz'/>
            <Tooltip />
            <Legend />
            {
                lines.map((line)=>(
                    <Line type={line.type} key={line.key} dataKey={line.dataKey} stroke={line.stroke} activeDot={{ r: 8 }} isAnimationActive={false} name={line.name}/>
                ))
            }
            
        </LineChart>
    );
}