import React from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LoadingModal from '../LoadingModal'

export default function MemAvailableChart({data, totalMem}){
    if(!data || data.length === 0) {
        return(
            <div>
                <LoadingModal color='#6ac9bf'></LoadingModal>
            </div>
        )
    }  
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                style={{ backgroundColor: '#f0f0f0', borderRadius: '1rem', padding: '1rem'}}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, totalMem]} unit="GB"/>
                <Tooltip />
                <Legend height={36}/>
                <Area type="monotone" dataKey='memUsed' stackId="1" stroke="#e6194bff" fill="#e6194bff" isAnimationActive={false} />
                <Area type="monotone" dataKey='memFree' stackId="1" stroke="#3cb44b" fill="#3cb44b" isAnimationActive={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

