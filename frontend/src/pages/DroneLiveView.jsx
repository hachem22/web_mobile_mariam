import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import {
    Activity, Battery, Navigation, Wind,
    ArrowLeft, Wifi, WifiOff, Camera,
    Map as MapIcon, Info, Crosshair
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import VideoFeed from '../components/VideoFeed';

const TelemetryCard = ({ icon: Icon, label, value, unit, color = "text-sea-cyan" }) => (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 group hover:border-white/20 transition-all">
        <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
            <p className="text-xl font-mono font-bold text-white leading-none">
                {value}<span className="text-xs ml-1 text-white/30 font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

const DroneLiveView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drone, setDrone] = useState(null);
    const [telemetry, setTelemetry] = useState({
        lat: 43.296482,
        lng: 5.369780,
        altitude: 0,
        batterie: 100,
        vitesse: 0,
        connected: false
    });
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {
        const fetchDrone = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/drones/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDrone(res.data);
                if (res.data.position_actuelle) {
                    setTelemetry(prev => ({
                        ...prev,
                        lat: res.data.position_actuelle.lat,
                        lng: res.data.position_actuelle.lng
                    }));
                }
            } catch (err) {
                console.error("Error fetching drone:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDrone();

        // Socket logic
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            setTelemetry(prev => ({ ...prev, connected: true }));
        });

        socketRef.current.on('disconnect', () => {
            setTelemetry(prev => ({ ...prev, connected: false }));
        });

        socketRef.current.on('drone_update', (data) => {
            if (data.drone_id === id) {
                setTelemetry(prev => ({
                    ...prev,
                    lat: data.lat || prev.lat,
                    lng: data.lng || prev.lng,
                    altitude: data.altitude !== undefined ? data.altitude : prev.altitude,
                    batterie: data.batterie !== undefined ? data.batterie : prev.batterie,
                    vitesse: data.vitesse !== undefined ? data.vitesse : prev.vitesse,
                    connected: true
                }));
            }
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [id]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-sea-dark">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-sea-cyan/20 border-t-sea-cyan rounded-full animate-spin"></div>
                <p className="font-orbitron text-xs text-sea-light/40 tracking-widest">INITIALISATION DU FLUX...</p>
            </div>
        </div>
    );

    if (!drone) return (
        <div className="h-screen flex items-center justify-center bg-sea-dark p-8">
            <div className="text-center">
                <p className="text-red-400 font-orbitron mb-4">DRONE NON IDENTIFIÉ</p>
                <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white flex items-center gap-2 mx-auto">
                    <ArrowLeft size={16} /> Retour
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-sea-dark flex flex-col p-6 animate-fade-in">
            {/* Header HUD */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">
                                {drone.nom}
                            </h1>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 ${telemetry.connected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {telemetry.connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                                {telemetry.connected ? 'STABLE' : 'SIGNAL PERDU'}
                            </div>
                        </div>
                        <p className="text-xs text-white/30 font-mono mt-1">ID: {drone.numero_serie} | MODEL: {drone.modele || 'GENERIC'}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <TelemetryCard icon={Battery} label="Batterie" value={telemetry.batterie} unit="%" color={telemetry.batterie < 20 ? "text-red-400" : "text-green-400"} />
                    <TelemetryCard icon={Navigation} label="Altitude" value={telemetry.altitude} unit="M" />
                    <TelemetryCard icon={Wind} label="Vitesse" value={telemetry.vitesse} unit="KM/H" color="text-yellow-400" />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-8 flex-1">
                {/* Visual Feeds (Left: 8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Main Video Case */}
                    <div className="relative aspect-video rounded-3xl border border-white/10 overflow-hidden shadow-2xl group">
                        <VideoFeed src={drone.adresse_ip_camera} />

                        {/* Internal HUD Elements */}
                        <div className="absolute inset-x-8 top-8 flex justify-between pointer-events-none z-30">
                            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                <Crosshair className="text-sea-cyan animate-pulse" size={16} />
                                <span className="text-[10px] font-mono text-white/80 uppercase">Targeting Tracking Active</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-mono text-white/80">{new Date().toLocaleTimeString()}</p>
                                <p className="text-[10px] font-mono text-white/40 italic">LAT: {telemetry.lat?.toFixed(6) || '---'}</p>
                                <p className="text-[10px] font-mono text-white/40 italic">LNG: {telemetry.lng?.toFixed(6) || '---'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <h3 className="text-[10px] font-orbitron text-white/40 uppercase mb-4 flex items-center gap-2">
                                <Info size={12} /> Mission Status
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                <span className="text-sm font-medium text-white">Active Patrol</span>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <h3 className="text-[10px] font-orbitron text-white/40 uppercase mb-4 flex items-center gap-2">
                                <Activity size={12} /> Engine Load
                            </h3>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-sea-cyan h-full w-[45%] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                            </div>
                            <p className="text-[10px] text-right mt-2 text-white/40 font-mono">45%</p>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <h3 className="text-[10px] font-orbitron text-white/40 uppercase mb-4 flex items-center gap-2">
                                <Camera size={12} /> Camera Quality
                            </h3>
                            <div className="text-sm font-medium text-white">4K UHD / 60 FPS</div>
                        </div>
                    </div>
                </div>

                {/* Tactical Data (Right: 4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-8 h-full flex flex-col">
                    {/* Small Map Container */}
                    <div className="flex-1 min-h-[400px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
                        <div className="absolute top-4 left-4 z-10 bg-sea-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                            <span className="text-[10px] font-orbitron text-white font-bold flex items-center gap-2">
                                <MapIcon size={12} /> Tactile Map
                            </span>
                        </div>
                        <LiveMap
                            drones={[{
                                ...drone,
                                lat: telemetry.lat,
                                lng: telemetry.lng,
                                statut: telemetry.connected ? 'En Ligne' : 'Hors Ligne'
                            }]}
                        />
                    </div>

                    {/* Quick Controls/Notifications panel */}
                    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl border-t-white/20">
                        <h3 className="text-[10px] font-orbitron text-white/60 mb-6 flex items-center gap-2 tracking-widest">
                            <Crosshair size={14} className="text-red-400" /> Logs Systèmes
                        </h3>
                        <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex gap-3 text-[10px]">
                                <span className="text-sea-cyan font-mono">[0.00ms]</span>
                                <p className="text-white/60">Connexion établie avec le drone SG-Alpha</p>
                            </div>
                            <div className="flex gap-3 text-[10px]">
                                <span className="text-sea-cyan font-mono">[1.42s]</span>
                                <p className="text-white/60">Activation du flux vidéo RTSP</p>
                            </div>
                            <div className="flex gap-3 text-[10px]">
                                <span className="text-yellow-400 font-mono">[2.15s]</span>
                                <p className="text-white/60">Stabilité du drone : 98% (Vents modérés)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DroneLiveView;
