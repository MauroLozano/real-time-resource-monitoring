import React from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStaticData } from "../../context/StaticDataProvider";
import { useMetrics } from "../../context/MetricsProvider";
import styles from './chartsStyle.module.css'
export default function MemAvailableChart(){
    const { staticData } = useStaticData()
    const { history: data } = useMetrics()
    const totalMem = staticData?.memory?.total || 0

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                className={styles.chart}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke='#e0e0e0'/>
                <YAxis domain={[0, totalMem]} stroke='#e0e0e0' unit="GB"/>
                <Tooltip wrapperClassName={styles.tooltip} />
                <Legend height={36}/>
                <Area type="monotone" dataKey='memUsed' stackId="1" stroke="#e6194bff" fill="#e6194bff" isAnimationActive={false} />
                <Area type="monotone" dataKey='memFree' stackId="1" stroke="#2ec4b6" fill="#2ec4b6" isAnimationActive={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

