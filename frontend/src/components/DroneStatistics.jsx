import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Battery, Signal, Zap, Wind, Navigation, Clock, Globe, BarChart3, TrendingUp } from 'lucide-react';

const SummaryCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 group hover:border-white/20 transition-all">
        <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</p>
            <p className="text-xl font-orbitron font-bold text-white leading-none">
                {value}<span className="text-xs ml-1 text-white/30 font-normal font-sans">{unit}</span>
            </p>
        </div>
    </div>
);

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
    const [speedData, setSpeedData] = useState([
        { time: '10:00', speed: 12 },
        { time: '10:05', speed: 15 },
        { time: '10:10', speed: 18 },
        { time: '10:15', speed: 14 },
        { time: '10:20', speed: 20 }
    ]);
    const [altitudeData, setAltitudeData] = useState([
        { time: '10:00', alt: 45 },
        { time: '10:05', alt: 52 },
        { time: '10:10', alt: 48 },
        { time: '10:15', alt: 55 },
        { time: '10:20', alt: 50 }
    ]);
    const [fleetStatus, setFleetStatus] = useState([
        { name: 'Active', value: 4, color: '#06b6d4' },
        { name: 'Maintenance', value: 1, color: '#f59e0b' },
        { name: 'Charging', value: 2, color: '#10b981' },
    ]);
    const [dailyMissions, setDailyMissions] = useState([
        { day: 'Lun', missions: 12 },
        { day: 'Mar', missions: 15 },
        { day: 'Mer', missions: 8 },
        { day: 'Jeu', missions: 20 },
        { day: 'Ven', missions: 18 },
        { day: 'Sam', missions: 25 },
        { day: 'Dim', missions: 22 },
    ]);

    // Simulate Live Data
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Simulate Battery
            setBatteryData(prev => {
                const lastLevel = prev[prev.length - 1].level;
                const newLevel = Math.max(0, lastLevel - Math.random() * 0.5);
                const newData = [...prev, { time: now, level: parseFloat(newLevel.toFixed(1)) }];
                return newData.slice(-15);
            });

            // Simulate Signal Strength
            setSignalData(prev => {
                const newStrength = Math.min(100, Math.max(0, Math.floor(Math.random() * (100 - 60) + 60)));
                const newData = [...prev, { time: now, strength: newStrength }];
                return newData.slice(-15);
            });

            // Simulate Speed
            setSpeedData(prev => {
                const newSpeed = Math.min(45, Math.max(0, Math.floor(Math.random() * (40 - 5) + 5)));
                const newData = [...prev, { time: now, speed: newSpeed }];
                return newData.slice(-15);
            });

            // Simulate Altitude
            setAltitudeData(prev => {
                const lastAlt = prev[prev.length - 1].alt;
                const newAlt = Math.min(120, Math.max(10, lastAlt + (Math.random() - 0.5) * 10));
                const newData = [...prev, { time: now, alt: Math.floor(newAlt) }];
                return newData.slice(-15);
            });

        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in p-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                        <Activity className="text-sea-cyan" /> Analytics du Drone
                    </h1>
                    <p className="text-sm text-white/30 mt-1">Données de performance et état de santé global de la flotte</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sea-cyan/10 border border-sea-cyan/20 text-sea-cyan text-[10px] font-bold uppercase tracking-widest">
                    <TrendingUp size={14} /> Simulation Active
                </div>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard icon={Clock} label="Heures de Vol" value="1,248" unit="HRS" color="text-sea-cyan" />
                <SummaryCard icon={Globe} label="Distance Totale" value="8,420" unit="KM" color="text-purple-400" />
                <SummaryCard icon={Wind} label="Vitesse Moyenne" value="32" unit="KM/H" color="text-orange-400" />
                <SummaryCard icon={Navigation} label="Altitude Max" value="115" unit="M" color="text-blue-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Battery History Chart */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <Battery className="text-green-400/20 w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                        Historique Batterie
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={batteryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '10px' }}
                                />
                                <Line type="monotone" dataKey="level" stroke="#4ade80" strokeWidth={3} dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Altitude Profile Chart */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <Navigation className="text-blue-400/20 w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                        Altitude
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={altitudeData}>
                                <defs>
                                    <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 150]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '10px' }} />
                                <Area type="stepAfter" dataKey="alt" stroke="#60a5fa" strokeWidth={2} fill="url(#colorAlt)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fleet Status Pie Chart */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center justify-center relative">
                    <div className="absolute top-0 right-0 p-4">
                        <Zap className="text-amber-400/20 w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2 self-start w-full">
                        État de la Flotte
                    </h3>
                    <div className="h-[200px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fleetStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {fleetStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white font-orbitron">{fleetStatus.reduce((acc, curr) => acc + curr.value, 0)}</span>
                            <span className="text-[8px] text-white/50 uppercase tracking-widest font-medium">Capacité</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 w-full">
                        {fleetStatus.map((status, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></div>
                                <span className="text-[10px] text-white/60 font-medium uppercase font-orbitron">{status.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Speed Analytics Area Chart */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                        <Wind className="text-sea-cyan/20 w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-white mb-6">Vitesse (KM/H)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={speedData}>
                                <defs>
                                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10 }} />
                                <YAxis stroke="rgba(255,255,255,0.2)" domain={[0, 50]} tick={{ fontSize: 10 }} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="speed" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSpeed)" animationDuration={300} isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Flight Activity Bar Chart */}
                <div className="lg:col-span-1 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl relative">
                    <div className="absolute top-0 right-0 p-4">
                        <BarChart3 className="text-purple-400/20 w-12 h-12" />
                    </div>
                    <h3 className="text-lg font-orbitron font-bold text-white mb-6">Missions Hebdomadaires</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyMissions}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} axisLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                                <Bar dataKey="missions" fill="#a855f7" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DroneStatistics;

