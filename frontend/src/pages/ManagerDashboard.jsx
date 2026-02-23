import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Routes, Route } from 'react-router-dom';
import LiveMap from '../components/LiveMap';
import VideoFeed from '../components/VideoFeed';
import io from 'socket.io-client';
import { MousePointer2, Settings, Target, Zap, Shield, Navigation } from 'lucide-react';
import axios from 'axios';
import DroneStatistics from '../components/DroneStatistics';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AssignModal = ({ alert, swimmers, onClose, onAssign }) => {
    const [selectedSwimmer, setSelectedSwimmer] = useState('');
    const [selectedDrone, setSelectedDrone] = useState('');
    const [drones, setDrones] = useState([]);

    useEffect(() => {
        if (alert && alert.drone_id) {
            setSelectedDrone(typeof alert.drone_id === 'object' ? alert.drone_id._id : alert.drone_id);
        }
        const fetchDrones = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/drones', { headers: { Authorization: `Bearer ${token}` } });
            setDrones(res.data);
        };
        fetchDrones();
    }, [alert]);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-sea-dark border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="text-sea-cyan" /> Affecter un Nageur
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-sea-light/40 uppercase block mb-1">Alerte</label>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-white">
                            {alert.type} - {alert.zone?.nom || 'Zone Inconnue'}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-sea-light/40 uppercase block mb-1">Sélectionner un Nageur</label>
                        <select
                            value={selectedSwimmer}
                            onChange={(e) => setSelectedSwimmer(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-sea-cyan transition-all"
                        >
                            <option value="">Choisir un nageur...</option>
                            {swimmers.map(s => (
                                <option key={s._id} value={s._id}>{s.nom} {s.prenom}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] text-sea-light/40 uppercase block mb-1">Drone Associé</label>
                        <select
                            value={selectedDrone}
                            onChange={(e) => setSelectedDrone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-sea-cyan transition-all"
                        >
                            <option value="">Choisir un drone...</option>
                            {drones.map(d => (
                                <option key={d._id} value={d._id}>
                                    {d.nom} {d._id === (typeof alert.drone_id === 'object' ? alert.drone_id._id : alert.drone_id) ? '(Associé à l\'alerte)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10 transition-all">
                        ANNULER
                    </button>
                    <button
                        onClick={() => onAssign(selectedSwimmer, selectedDrone)}
                        disabled={!selectedSwimmer || !selectedDrone}
                        className="flex-1 py-3 rounded-xl bg-sea-cyan text-white text-xs font-bold disabled:opacity-50 shadow-lg shadow-sea-cyan/30 transition-all"
                    >
                        CONFIRMER
                    </button>
                </div>
            </div>
        </div>
    );
};

const ManagerOverview = () => {
    const [drones, setDrones] = useState([]);
    const [mode, setMode] = useState('manuel'); // 'manuel' | 'autonome'
    const [patrolPoints, setPatrolPoints] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [alertes, setAlertes] = useState([]);
    const [swimmers, setSwimmers] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(null);

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

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [dronesRes, alertesRes, swimmersRes] = await Promise.all([
                    axios.get('/api/drones', { headers }),
                    axios.get('/api/missions/alertes', { headers }),
                    axios.get('/api/users', { headers })
                ]);

                setDrones(dronesRes.data);
                setAlertes(alertesRes.data.filter(a => !a.traitee));
                setSwimmers(swimmersRes.data.filter(u => u.role === 'nageur'));

                if (dronesRes.data.length > 0) setSelectedDrone(dronesRes.data[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();

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
                            <h3 className="text-white font-orbitron font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" /> Alertes en attente
                            </h3>
                            <span className="text-[10px] bg-orange-400/20 text-orange-400 font-bold px-2 py-0.5 rounded">
                                {alertes.length} NEW
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {alertes.map(alert => (
                                <div key={alert._id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-sea-cyan/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] text-sea-cyan font-bold block">{alert.type}</span>
                                            <span className="text-[10px] text-sea-light/40">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <button
                                            onClick={() => setShowAssignModal(alert)}
                                            className="p-1.5 bg-sea-cyan/20 hover:bg-sea-cyan text-sea-cyan hover:text-white rounded-lg transition-all"
                                        >
                                            <Navigation size={14} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-sea-light/60 line-clamp-1">{alert.zone?.nom || 'Position Inconnue'}</p>
                                </div>
                            ))}
                            {alertes.length === 0 && (
                                <div className="text-center py-6">
                                    <CheckCircle2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                    <p className="text-[10px] text-white/20">Aucune alerte en attente</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
                        {/* Status section previously here */}
                    </div>
                </div>
            </div>

            {showAssignModal && (
                <AssignModal
                    alert={showAssignModal}
                    swimmers={swimmers}
                    onClose={() => setShowAssignModal(null)}
                    onAssign={async (swimmerId, droneId) => {
                        try {
                            const token = localStorage.getItem('token');
                            await axios.post('/api/missions', {
                                alerte_id: showAssignModal._id,
                                nageur_id: swimmerId,
                                drone_id: droneId,
                                victime_position: showAssignModal.position
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            setAlertes(prev => prev.filter(a => a._id !== showAssignModal._id));
                            setShowAssignModal(null);
                            alert('Mission affectée avec succès !');
                        } catch (err) {
                            alert('Erreur lors de l\'affectation');
                        }
                    }}
                />
            )}
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
