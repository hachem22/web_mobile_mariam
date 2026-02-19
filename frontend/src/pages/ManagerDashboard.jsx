import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Routes, Route } from 'react-router-dom';
import LiveMap from '../components/LiveMap';
import VideoFeed from '../components/VideoFeed';
import io from 'socket.io-client';
import { MousePointer2, Settings, Target, Zap, Shield, Navigation } from 'lucide-react';
import axios from 'axios';
import DroneStatistics from '../components/DroneStatistics';

const ManagerOverview = () => {
    const [drones, setDrones] = useState([]);
    const [mode, setMode] = useState('manuel'); // 'manuel' | 'autonome'
    const [patrolPoints, setPatrolPoints] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('drone_update', (data) => {
            setDrones(prev => {
                const index = prev.findIndex(d => d.id === data.drone_id);
                if (index > -1) {
                    const newDrones = [...prev];
                    newDrones[index] = { ...newDrones[index], ...data };
                    return newDrones;
                } else {
                    return [...prev, { id: data.drone_id, name: `Drone ${data.drone_id}`, ...data }];
                }
            });
        });

        // Fetch initial drones
        const fetchDrones = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/drones', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDrones(res.data);
                if (res.data.length > 0) setSelectedDrone(res.data[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDrones();

        return () => socket.disconnect();
    }, []);

    const handleMapClick = (latlng) => {
        if (mode === 'autonome' && patrolPoints.length < 4) {
            setPatrolPoints([...patrolPoints, latlng]);
        }
    };

    const saveZone = async () => {
        if (patrolPoints.length !== 4) return;
        try {
            const token = localStorage.getItem('token');
            // Mock sending to backend
            console.log('Saving zone:', patrolPoints);
            // await axios.post('/api/zones', { points: patrolPoints, drone_id: selectedDrone._id }, { headers: ... });
            alert('Zone de patrouille définie avec succès !');
            setPatrolPoints([]);
        } catch (err) {
            alert('Erreur lors de la sauvegarde');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h1 className="text-3xl font-orbitron font-bold text-white">Mission Control</h1>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setMode('manuel')}
                            className={`px-4 py-2 rounded-lg font-orbitron text-xs font-bold transition-all ${mode === 'manuel' ? 'bg-sea-cyan text-white shadow-lg shadow-sea-cyan/30' : 'text-white/40 hover:text-white'}`}
                        >
                            MANUEL
                        </button>
                        <button
                            onClick={() => setMode('autonome')}
                            className={`px-4 py-2 rounded-lg font-orbitron text-xs font-bold transition-all ${mode === 'autonome' ? 'bg-sea-cyan text-white shadow-lg shadow-sea-cyan/30' : 'text-white/40 hover:text-white'}`}
                        >
                            AUTONOME
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Map */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-[500px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                        <LiveMap drones={drones} onMapClick={handleMapClick} patrolPoints={patrolPoints} />

                        {mode === 'autonome' && (
                            <div className="absolute top-4 left-4 z-[1000] bg-sea-dark/90 backdrop-blur-md p-4 rounded-xl border border-sea-cyan/30 shadow-2xl max-w-[200px]">
                                <h4 className="text-white font-orbitron text-xs font-bold mb-2 flex items-center gap-2">
                                    <Target className="w-3 h-3 text-sea-cyan" /> DÉFINIR ZONE
                                </h4>
                                <p className="text-[10px] text-sea-light/60 mb-3">Cliquez sur la carte pour définir les 4 points de patrouille.</p>
                                <div className="space-y-1 mb-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center justify-between text-[10px]">
                                            <span className="text-sea-light/40">Point {i}</span>
                                            <span className={patrolPoints[i - 1] ? 'text-sea-cyan' : 'text-white/10'}>
                                                {patrolPoints[i - 1] ? 'DÉFINI' : '---'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {patrolPoints.length === 4 ? (
                                    <button onClick={saveZone} className="w-full bg-sea-cyan text-white text-[10px] font-bold py-2 rounded-lg animate-pulse">
                                        ACTIVER LA ZONE
                                    </button>
                                ) : (
                                    <button onClick={() => setPatrolPoints([])} className="w-full bg-white/5 text-white/40 text-[10px] font-bold py-2 rounded-lg border border-white/10">
                                        RÉINITIALISER
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Live Feed & Info */}
                <div className="space-y-6">
                    <div className="aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <VideoFeed />
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-orbitron font-bold">Drone Info</h3>
                            <span className="text-[10px] bg-green-500/20 text-green-300 font-bold px-2 py-0.5 rounded uppercase">Connected</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[10px] text-sea-light/40 uppercase block mb-1">Batterie</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-sea-cyan w-[85%]"></div>
                                    </div>
                                    <span className="text-xs font-mono text-white">85%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-[10px] text-sea-light/40 uppercase block mb-1">Altitude</span>
                                <span className="text-xs font-mono text-white">42m</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                <Navigation className="w-4 h-4 text-sea-cyan" /> RENTRER À LA BASE
                            </button>
                            <button className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                <Zap className="w-4 h-4" /> ARRÊT D'URGENCE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManagerDashboard = () => {
    return (
        <Layout role="manager">
            <Routes>
                <Route path="/" element={<ManagerOverview />} />
                <Route path="/drones" element={<DroneStatistics />} />
            </Routes>
        </Layout>
    );
};

export default ManagerDashboard;
