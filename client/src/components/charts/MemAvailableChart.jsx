import React from "react";
import { Cell, Pie, PieChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LoadingModal from '../LoadingModal'
const colors = ['#3cb44b', '#e6194bff'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};
export default function MemAvailableChart({data, totalMem}){
    if(!data || data.length === 0) {
        return(
            <div>
                <LoadingModal color='#6ac9bf'></LoadingModal>
            </div>
        )
    }
    const pieData = [
        {name: 'Free Memory', value: data[data.length -1].memFree},
        {name: 'Used Memory', value: data[data.length -1].memUsed}
    ]   
    return (
        <>
            <div style={{ width: '100%', maxWidth: '1000px', height: '500px', marginBottom: '2rem', margin:'2rem auto'}}>
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
            </div>
            <div style={{ width: '420px', height: '420px', margin:'0 auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            dataKey="value"
                            isAnimationActive={false}
                            cx="50%"
                            cy="50%"
                            outerRadius={'90%'}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

