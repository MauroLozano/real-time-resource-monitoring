import React from "react";
import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMetrics } from "../../context/MetricsProvider";
import LoadingModal from '../layout/LoadingModal'
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
export default function MemPieChart(){
    const { history: data } = useMetrics()
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
    );
};

