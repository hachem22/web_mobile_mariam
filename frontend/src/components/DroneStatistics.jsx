import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Activity, Battery, Signal, Zap } from 'lucide-react';

const DroneStatistics = () => {
    // Fake Data States
    const [batteryData, setBatteryData] = useState([
        { time: '10:00', level: 95 },
        { time: '10:05', level: 92 },
        { time: '10:10', level: 88 },
        { time: '10:15', level: 85 },
        { time: '10:20', level: 82 }
    ]);
    const [signalData, setSignalData] = useState([
        { time: '10:00', strength: 80 },
        { time: '10:05', strength: 85 },
        { time: '10:10', strength: 75 },
        { time: '10:15', strength: 90 },
        { time: '10:20', strength: 88 }
    ]);
    const [fleetStatus, setFleetStatus] = useState([
        { name: 'Active', value: 4, color: '#06b6d4' }, // sea-cyan
        { name: 'Maintenance', value: 1, color: '#f59e0b' }, // amber
        { name: 'Charging', value: 2, color: '#10b981' }, // emerald
    ]);

    // Simulate Live Data
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Simulate Battery
            setBatteryData(prev => {
                const lastLevel = prev[prev.length - 1].level;
                const newLevel = Math.max(0, lastLevel - Math.random() * 2); // Discharges slowly
                const newData = [...prev, { time: now, level: parseFloat(newLevel.toFixed(1)) }];
                return newData.slice(-15); // Keep last 15 points
            });

            // Simulate Signal Strength
            setSignalData(prev => {
                const newStrength = Math.min(100, Math.max(0, Math.floor(Math.random() * (100 - 60) + 60)));
                const newData = [...prev, { time: now, strength: newStrength }];
                return newData.slice(-15);
            });

        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <h1 className="text-3xl font-orbitron font-bold text-white border-b border-white/5 pb-4 flex items-center gap-3">
                <Activity className="text-sea-cyan" /> Analytics du Drone (Simulation)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Battery History Chart */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                        <Battery className="text-green-400" /> Historique Batterie
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={batteryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
                                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Line type="monotone" dataKey="level" stroke="#4ade80" strokeWidth={3} dot={{ r: 4, fill: '#4ade80' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={500} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fleet Status Pie Chart */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center justify-center relative">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2 self-start w-full">
                        <Zap className="text-amber-400" /> État de la Flotte
                    </h3>
                    <div className="h-[250px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fleetStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {fleetStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-white font-orbitron">{fleetStatus.reduce((acc, curr) => acc + curr.value, 0)}</span>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest">Total Drones</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4 w-full">
                        {fleetStatus.map((status, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: status.color, boxShadow: `0 0 8px ${status.color}` }}></div>
                                <span className="text-xs text-white/70 font-bold">{status.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Signal Strength Area Chart */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                        <Signal className="text-sea-cyan" /> Qualité du Signal (Live)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={signalData}>
                                <defs>
                                    <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} />
                                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                                <Area
                                    type="monotone"
                                    dataKey="strength"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSignal)"
                                    animationDuration={500}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DroneStatistics;
