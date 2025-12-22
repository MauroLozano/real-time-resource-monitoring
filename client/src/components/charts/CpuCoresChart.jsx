import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from "react";

export default function CpuCoresChart({data}) {
    return (
        <LineChart
            style={{ backgroundColor: '#f0f0f0', padding: '1rem 1rem 1rem 0', borderRadius: '1rem'}}
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
            <YAxis domain={[0, 100]} unit='%'/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpuLoad" stroke="#e95a5aff" activeDot={{ r: 8 }} isAnimationActive={false}/>
        </LineChart>
    );
}