import React from "react";
import { Cell, Pie, PieChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import styles from '../../css/MemAvailableChart.module.css'
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
        <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

export default function MemAvailableChart({data, totalMem}){
    console.log(data)
    const pieData = [
        {name: 'Free Memory', value: data[data.length -1].memFree},
        {name: 'Used Memory', value: data[data.length -1].memUsed}
    ]
    return (
        <div className={styles.chartWrapper}>
            <AreaChart
                style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '1rem'}}
                width={800}
                height={500}
                responsive
                data={data}
                margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, totalMem]} unit="Gb"/>
                <Tooltip />
                <Area type="monotone" dataKey='memUsed'stackId="1" stroke="#e6194bff" fill="#e6194bff" />
                <Area type="monotone" dataKey='memFree'stackId="1" stroke="#3cb44b" fill="#3cb44b" />
                <RechartsDevtools />
            </AreaChart>

            <div style={{ width: '100%', height: '400px' }}> {/* Contenedor con altura fija */}
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            dataKey="value"
                            isAnimationActive={false} // Desactivar para debuguear rápido
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

