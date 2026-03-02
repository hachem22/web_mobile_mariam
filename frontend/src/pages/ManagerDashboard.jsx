import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Routes, Route } from 'react-router-dom';
import LiveMap from '../components/LiveMap';
import VideoFeed from '../components/VideoFeed';
import io from 'socket.io-client';
import { MousePointer2, Settings, Target, Zap, Shield, Navigation, ChevronDown, Battery, Maximize2, Minimize2, Monitor, Wind, Activity, Repeat, Crosshair, Info, Camera, MapPin, Mic, Fan, ShieldAlert, Home, LogOut, Radio, PlusCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import DroneStatistics from '../components/DroneStatistics';
import DroneLiveView from './DroneLiveView';
import SwimmerManagement from './SwimmerManagement';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import Joyride, { STATUS } from 'react-joyride';

const TelemetryCard = ({ icon: Icon, label, value, unit, color = "text-sea-cyan" }) => (
    <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 group hover:border-white/20 transition-all">
        <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={16} />
        </div>
        <div>
            <p className="text-[8px] uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
            <p className="text-sm font-mono font-bold text-white leading-none">
                {value}<span className="text-[10px] ml-1 text-white/30 font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

const AssignModal = ({ alert, swimmers, drones, activeZone, onClose, onAssign }) => {
    const [selectedSwimmer, setSelectedSwimmer] = useState('');
    const [selectedDrone, setSelectedDrone] = useState('');
    const [isSwimmerOpen, setIsSwimmerOpen] = useState(false);

    useEffect(() => {
        if (alert && alert.drone_id) {
            setSelectedDrone(typeof alert.drone_id === 'object' ? alert.drone_id._id : alert.drone_id);
        } else if (drones && drones.length > 0) {
            setSelectedDrone(drones[0]._id);
        }
    }, [alert, drones]);

    const currentSwimmer = swimmers.find(s => s._id === selectedSwimmer);

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
                            {alert.type} - {alert.zone?.nom || activeZone?.nom || 'Zone Inconnue'}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-[10px] text-sea-light/40 uppercase block mb-1">Sélectionner un Nageur</label>
                        <button
                            type="button"
                            onClick={() => setIsSwimmerOpen(!isSwimmerOpen)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm flex items-center justify-between hover:bg-white/10 transition-all"
                        >
                            <span>{currentSwimmer ? `${currentSwimmer.nom} ${currentSwimmer.prenom}` : 'Choisir un nageur...'}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isSwimmerOpen ? 'rotate-180 text-sea-cyan' : 'text-white/40'}`} />
                        </button>

                        {isSwimmerOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-sea-dark/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[2100] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {swimmers.map(s => (
                                        <button
                                            key={s._id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSwimmer(s._id);
                                                setIsSwimmerOpen(false);
                                            }}
                                            className={`w-full text-left p-3 text-sm transition-all hover:bg-white/10 flex items-center justify-between ${selectedSwimmer === s._id ? 'text-sea-cyan bg-sea-cyan/5' : 'text-white/70'}`}
                                        >
                                            <span>{s.nom} {s.prenom}</span>
                                            {selectedSwimmer === s._id && <div className="w-1.5 h-1.5 rounded-full bg-sea-cyan shadow-[0_0_8px_#06b6d4]" />}
                                        </button>
                                    ))}
                                    {swimmers.length === 0 && (
                                        <div className="p-4 text-center text-xs text-white/30 italic">Aucun nageur disponible</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-[10px] text-sea-light/40 uppercase block mb-1">Drone Associé</label>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-sea-cyan font-bold">
                            {drones.find(d => d._id === selectedDrone)?.nom || 'Chargement...'}
                        </div>
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

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="flex items-center gap-2">
        <Icon size={16} style={{ color }} />
        <div>
            <p className="text-[8px] uppercase tracking-widest text-white/40">{title}</p>
            <p className="text-sm font-bold text-white">{value}</p>
        </div>
    </div>
);

const ManagerOverview = () => {
    const { user } = useAuth();
    const [drones, setDrones] = useState([]);
    const [mode, setMode] = useState('manuel'); // 'manuel' | 'autonome'
    const [patrolPoints, setPatrolPoints] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [alertes, setAlertes] = useState([]); // Renamed from 'alerts' to 'alertes' to match original code
    const [swimmers, setSwimmers] = useState([]);
    const [zones, setZones] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(null);
    const [layoutMode, setLayoutMode] = useState('standard'); // 'standard' | 'video_focus' | 'theater'
    const [isSwapped, setIsSwapped] = useState(false);
    const [stats, setStats] = useState({ drones: 0, missions: 0, alerts: 0, declarations: 0 });
    const [declarations, setDeclarations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRedAlert, setIsRedAlert] = useState(false);

    // Joyride Tour State
    const [runTour, setRunTour] = useState(false);
    const [tourSteps] = useState([
        {
            target: '.tour-step-1',
            content: 'Bienvenue sur Mission Control ! Sélectionnez un drone ici pour voir, contrôler et déployer ses missions.',
            disableBeacon: true,
            placement: 'bottom',
        },
        {
            target: '.tour-step-2',
            content: 'Consultez la télémétrie en temps réel (Altitude, Vitesse, Batterie, GPS).',
            placement: 'bottom',
        },
        {
            target: '.tour-step-3',
            content: 'Ce bouton permet d\'inverser la caméra du drone avec la vue cartographique globale !',
            placement: 'bottom',
        },
        {
            target: '.tour-step-4',
            content: 'C\'est ici qu\'apparaissent les alertes IA et surtout les Déclarations d\'urgence des nageurs. Vous pourrez déployer un drone en un clic !',
            placement: 'left',
        }
    ]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
        }
    };


    const activeZone = useMemo(() => {
        if (!selectedDrone) return null;
        return zones.find(z => (z.drone_id === selectedDrone._id) || (z.drone_id?._id === selectedDrone._id));
    }, [zones, selectedDrone]);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('drone_update', (data) => {
            setDrones(prev => {
                const index = prev.findIndex(d => (d._id === data.drone_id) || (d.id === data.drone_id));
                if (index > -1) {
                    const newDrones = [...prev];
                    const updatedDrone = { ...newDrones[index], ...data };
                    newDrones[index] = updatedDrone;

                    // Keep selectedDrone in sync
                    setSelectedDrone(prevSelected => {
                        if (prevSelected && (prevSelected._id === updatedDrone._id)) {
                            return updatedDrone;
                        }
                        return prevSelected;
                    });

                    return newDrones;
                } else {
                    return [...prev, { _id: data.drone_id, nom: `Drone ${data.drone_id}`, ...data }];
                }
            });
        });

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [dronesRes, alertesRes, swimmersRes, zonesRes, missionsRes, declarationsRes] = await Promise.all([
                    axios.get('/api/drones', { headers }),
                    axios.get('/api/missions/alertes', { headers }),
                    axios.get('/api/users', { headers }),
                    axios.get('/api/zones', { headers }),
                    axios.get('/api/missions', { headers }),
                    axios.get('/api/declarations', { headers })
                ]);

                const assignedDrones = dronesRes.data.filter(d =>
                    (d.responsable_id === user?._id) || (d.responsable_id?._id === user?._id)
                );

                setDrones(assignedDrones);
                setAlertes(alertesRes.data.filter(a => !a.traitee).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                setSwimmers(swimmersRes.data.filter(u => u.role === 'nageur'));
                setZones(zonesRes.data);

                // Filter for pending declarations and sort by newest first
                setDeclarations(
                    declarationsRes.data
                        .filter(d => d.statut === 'en_attente')
                        .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
                );

                setStats({
                    drones: assignedDrones.length,
                    missions: missionsRes.data.filter(m => m.statut === 'en cours').length,
                    alerts: alertesRes.data.filter(a => !a.traitee).length,
                    declarations: declarationsRes.data.filter(d => d.statut === 'en_attente').length
                });

                if (assignedDrones.length > 0) setSelectedDrone(assignedDrones[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        socket.on('new_declaration', (declaration) => {
            // Jouer le son d'alerte
            try {
                const audio = new window.Audio('/alert.mp3');
                audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (err) {
                console.error('Audio error:', err);
            }

            setDeclarations(prev => [declaration, ...prev].slice(0, 5));
            setStats(prev => ({ ...prev, declarations: prev.declarations + 1 }));

            // Déclencher l'interface rouge
            setIsRedAlert(true);
            setTimeout(() => {
                setIsRedAlert(false);
            }, 3000);
        });

        socket.on('new_mission', (mission) => {
            setStats(prev => ({ ...prev, missions: prev.missions + 1 }));
            // Refresh data to keep drone assignments & swimmers synced
            fetchData();

            // Déclencher l'interface rouge
            setIsRedAlert(true);
            setTimeout(() => {
                setIsRedAlert(false);
            }, 3000);
        });

        return () => socket.disconnect();
    }, [user]);

    const handleMapClick = (latlng) => {
        if (mode === 'autonome' && !activeZone && patrolPoints.length < 4) {
            setPatrolPoints([...patrolPoints, latlng]);
        }
    };

    const saveZone = async () => {
        if (patrolPoints.length !== 4) return;
        if (activeZone) {
            alert('Une zone existe déjà pour ce drone. Supprimez-la d\'abord.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const { value: zoneName } = await Swal.fire({
                title: 'Nommer la zone',
                input: 'text',
                inputLabel: 'Entrez un nom pour cette zone de patrouille',
                inputPlaceholder: 'Ex: Zone Nord, Secteur A...',
                showCancelButton: true,
                confirmButtonText: 'Sauvegarder',
                cancelButtonText: 'Annuler',
                background: '#0a1628',
                color: '#fff',
                confirmButtonColor: '#06b6d4',
                inputAttributes: {
                    className: 'swal2-input-custom'
                }
            });

            if (!zoneName) return;

            if (!selectedDrone) {
                alert('Aucun drone sélectionné');
                return;
            }

            const res = await axios.post('/api/zones', {
                nom: zoneName,
                points: patrolPoints,
                drone_id: selectedDrone._id,
                responsable_id: selectedDrone.responsable_id?._id || selectedDrone.responsable_id
            }, { headers });

            setZones([...zones, res.data]);
            setPatrolPoints([]);

            Swal.fire({
                title: 'Succès !',
                text: 'Zone de patrouille définie avec succès.',
                icon: 'success',
                background: '#0a1628',
                color: '#fff',
                confirmButtonColor: '#06b6d4'
            });
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.message || err.message));
        }
    };

    const handleMissionCommand = async (command, details) => {
        const result = await Swal.fire({
            title: details.title,
            text: details.text,
            icon: details.icon || 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            background: '#0a1628',
            color: '#fff',
            confirmButtonColor: details.confirmColor || '#06b6d4',
            cancelButtonColor: 'rgba(255,255,255,0.1)',
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Commande envoyée',
                text: `La commande ${command} a été transmise au drone.`,
                icon: 'success',
                background: '#0a1628',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleDeleteZone = async () => {
        if (!activeZone) return;

        const result = await Swal.fire({
            title: 'Supprimer la zone ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            background: '#0a1628',
            color: '#fff'
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`/api/zones/${activeZone._id}`, { headers });

            setZones(prev => prev.filter(z => z._id !== activeZone._id));

            Swal.fire({
                title: 'Supprimé !',
                text: 'La zone a été supprimée.',
                icon: 'success',
                background: '#0a1628',
                color: '#fff',
                confirmButtonColor: '#06b6d4'
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la suppression',
                background: '#0a1628',
                color: '#fff'
            });
        }
    };

    const handleSimulateAlert = async () => {
        if (!selectedDrone) {
            Swal.fire({
                icon: 'warning',
                title: 'Aucun drone',
                text: 'Veuillez sélectionner un drone pour simuler une alerte.',
                background: '#0a1628',
                color: '#fff'
            });
            return;
        }

        try {
            const types = ['Baigneur en difficulté', 'Zone interdite', 'Objet suspect', 'Nageur épuisé'];
            const randomType = types[Math.floor(Math.random() * types.length)];

            // Random offset around drone position
            const lat = (selectedDrone.position_actuelle?.lat || 43.296482) + (Math.random() - 0.5) * 0.01;
            const lng = (selectedDrone.position_actuelle?.lng || 5.369780) + (Math.random() - 0.5) * 0.01;

            const payload = {
                drone_id: selectedDrone._id,
                type: randomType,
                position: { lat, lng },
                image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000',
                confiance: 0.85 + Math.random() * 0.1,
                timestamp: new Date()
            };

            await axios.post('/api/missions/alertes', payload);

            Swal.fire({
                icon: 'success',
                title: 'Alerte simulée !',
                text: `Une alerte de type "${randomType}" a été créée.`,
                background: '#0a1628',
                color: '#fff',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            console.error('Simulation error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Échec de la simulation : ' + (err.response?.data?.message || err.message),
                background: '#0a1628',
                color: '#fff'
            });
        }
    };

    const handleFullscreen = (elementId) => {
        const elem = document.getElementById(elementId);
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    };

    const handleDeployDrone = async (decl) => {
        if (!selectedDrone) {
            Swal.fire({
                icon: 'warning',
                title: 'Aucun drone',
                text: 'Veuillez sélectionner un drone avant de le déployer.',
                background: '#0a1628',
                color: '#fff'
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Marquer la déclaration comme traitée
            await axios.put(`/api/declarations/${decl._id}`, { statut: 'traitee' }, { headers });

            // 2. Créer une "Alerte" automatique pour le drone actif
            await axios.post('/api/missions/alertes', {
                drone_id: selectedDrone._id,
                type: 'Intervention sur Déclaration S.O.S',
                position: decl.position,
                image_url: decl.photo_url || 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5',
                confiance: 1.0,
                timestamp: new Date()
            }, { headers });

            Swal.fire({
                icon: 'success',
                title: 'Drone Déployé !',
                text: `Le drone ${selectedDrone.nom} est en route vers la position S.O.S.`,
                background: '#0a1628',
                color: '#fff'
            });

            // Enlever de l'affichage local vu qu'elle est traitée
            setDeclarations(prev => prev.filter(d => d._id !== decl._id));
            setStats(prev => ({ ...prev, declarations: Math.max(0, prev.declarations - 1) }));

            // Revenir sur la map si on est dans un autre mode
            setIsSwapped(false);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors du déploiement : ' + (err.response?.data?.message || err.message),
                background: '#0a1628',
                color: '#fff'
            });
        }
    };

    return (
        <div className={`space-y-6 transition-colors duration-500 rounded-lg ${isRedAlert ? 'bg-red-900/40 shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]' : ''}`}>
            {/* Joyride Tour Component */}
            <Joyride
                steps={tourSteps}
                run={runTour}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        arrowColor: '#0a1628',
                        backgroundColor: '#0a1628',
                        overlayColor: 'rgba(0, 0, 0, 0.7)',
                        primaryColor: '#00E5FF',
                        textColor: '#fff',
                        zIndex: 10000,
                    }
                }}
                locale={{ back: 'Précédent', close: 'Fermer', last: 'Terminer', next: 'Suivant', skip: 'Passer' }}
            />

            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-orbitron font-bold text-white">Mission Control</h1>
                    <button
                        onClick={() => setRunTour(true)}
                        className="flex items-center gap-2 bg-sea-cyan/10 hover:bg-sea-cyan/20 text-sea-cyan px-3 py-1.5 rounded-lg border border-sea-cyan/30 transition-all text-xs font-bold"
                    >
                        <Info size={14} /> Guide
                    </button>
                </div>
                <div className="flex items-center gap-6 tour-step-2">
                    {selectedDrone && (
                        <div className="hidden md:flex gap-3">
                            <TelemetryCard
                                icon={Battery}
                                label="Batterie"
                                value={selectedDrone.batterie || 0}
                                unit="%"
                                color={selectedDrone.batterie < 20 ? "text-red-400" : "text-green-400"}
                            />
                            <TelemetryCard
                                icon={Navigation}
                                label="Altitude"
                                value={selectedDrone.altitude || 0}
                                unit="M"
                            />
                            <TelemetryCard
                                icon={Wind}
                                label="Vitesse"
                                value={selectedDrone.vitesse || 0}
                                unit="KM/H"
                                color="text-yellow-400"
                            />
                            <TelemetryCard
                                icon={MapPin}
                                label="Latitude"
                                value={selectedDrone.position_actuelle?.lat?.toFixed(5) || '0.00000'}
                                unit=""
                                color="text-blue-400"
                            />
                            <TelemetryCard
                                icon={MapPin}
                                label="Longitude"
                                value={selectedDrone.position_actuelle?.lng?.toFixed(5) || '0.00000'}
                                unit=""
                                color="text-purple-400"
                            />
                        </div>
                    )}
                    <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-2 tour-step-3">
                        <button
                            onClick={() => setIsSwapped(!isSwapped)}
                            className="p-2 rounded-lg text-white/40 hover:text-sea-cyan hover:bg-white/5 transition-all"
                            title="Inverser les positions"
                        >
                            <Repeat size={16} className={isSwapped ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </button>
                        <div className="w-px h-4 bg-white/10"></div>
                        <div className="flex">
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
            </div>

            <div className={`grid grid-cols-1 ${layoutMode === 'theater' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6 transition-all duration-500`}>
                {/* Main Content Area (Column 1 & 2) */}
                <div className={`${layoutMode === 'standard' ? 'lg:col-span-2' : layoutMode === 'video_focus' ? 'lg:col-span-1' : 'lg:col-span-1 hidden'} space-y-6 transition-all duration-500`}>
                    {/* Drones list (tour-step-1) */}
                    {!isSwapped && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tour-step-1">
                            {drones.map(drone => (
                                <button
                                    key={drone._id || drone.id}
                                    onClick={() => setSelectedDrone(drone)}
                                    className={`relative overflow-hidden p-4 rounded-xl border text-left transition-all ${selectedDrone?._id === drone._id
                                            ? 'bg-sea-cyan/10 border-sea-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-white font-orbitron font-bold text-sm tracking-wider">{drone.nom}</h3>
                                            <p className="text-[10px] text-white/40 uppercase mt-0.5">{drone.modele || 'Modèle standard'}</p>
                                        </div>
                                        <div className={`p-1.5 rounded-lg ${drone.statut === 'en_vol' ? 'bg-green-500/20 text-green-400' : 'bg-sea-cyan/20 text-sea-cyan'}`}>
                                            <Battery size={14} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-2 h-2 rounded-full ${drone.statut === 'en_vol' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-sea-cyan shadow-[0_0_8px_#06b6d4]'}`} />
                                        <span className="text-xs text-white/70 uppercase tracking-wider">{drone.statut}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/50">
                                        <span className="flex items-center gap-1"><Navigation size={10} /> {drone.altitude || 0}m</span>
                                        <span className="flex items-center gap-1"><Wind size={10} /> {drone.vitesse || 0}km/h</span>
                                    </div>
                                    {selectedDrone?._id === drone._id && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-sea-cyan/20 to-transparent blur-xl rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {isSwapped ? (
                        /* Video Feed in Left/Large Area */
                        <div id="video-container-large" className="aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group bg-black tour-step-6">
                            <VideoFeed src={selectedDrone?.adresse_ip_camera} />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start pointer-events-auto">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setLayoutMode(layoutMode === 'standard' ? 'video_focus' : 'standard')}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Mode Focus"
                                        >
                                            {layoutMode === 'standard' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setIsSwapped(false)}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Réduire en vignette"
                                        >
                                            <Repeat size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleFullscreen('video-container-large')}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Plein Écran"
                                        >
                                            <Maximize2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {/* HUD Overlays */}
                                <div className="absolute inset-x-4 top-4 flex justify-between pointer-events-none z-30">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                        <Crosshair className="text-sea-cyan animate-pulse" size={12} />
                                        <span className="text-[8px] font-mono text-white/80 uppercase">Tracking Active</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-mono text-white/80">{new Date().toLocaleTimeString()}</p>
                                        <p className="text-[8px] font-mono text-white/40 italic">LAT: {selectedDrone?.position_actuelle?.lat?.toFixed(6) || '---'}</p>
                                        <p className="text-[8px] font-mono text-white/40 italic">LNG: {selectedDrone?.position_actuelle?.lng?.toFixed(6) || '---'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Map in Left/Large Area */
                        <div className="h-[500px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative tour-step-5">
                            <LiveMap drones={drones} onMapClick={handleMapClick} patrolPoints={patrolPoints} theme="light" zones={zones} />

                            {/* Mode autonomous controls (remain anchored to map) */}
                            {mode === 'autonome' && (
                                <div className="absolute top-4 left-4 z-[1000] bg-sea-dark/90 backdrop-blur-md p-4 rounded-xl border border-sea-cyan/30 shadow-2xl max-w-[200px]">
                                    <h4 className="text-white font-orbitron text-xs font-bold mb-2 flex items-center gap-2">
                                        <Target className="w-3 h-3 text-sea-cyan" /> DÉFINIR ZONE
                                    </h4>

                                    {selectedDrone && !activeZone && (
                                        <div className="bg-white/5 p-2 rounded-lg mb-3 border border-white/10">
                                            <p className="text-[8px] text-white/40 uppercase">Drone Actif</p>
                                            <p className="text-[10px] text-sea-cyan font-bold">{selectedDrone.nom}</p>
                                        </div>
                                    )}

                                    {activeZone ? (
                                        <div className="bg-white/5 p-3 rounded-xl border border-sea-cyan/20 space-y-3">
                                            <div>
                                                <p className="text-[8px] text-white/40 uppercase">Zone Active</p>
                                                <p className="text-[10px] text-white font-bold">{activeZone.nom}</p>
                                            </div>
                                            <button
                                                onClick={handleDeleteZone}
                                                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-bold py-2 rounded-lg border border-red-500/20 transition-all"
                                            >
                                                SUPPRIMER LA ZONE
                                            </button>
                                        </div>
                                    ) : (
                                        <>
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
                                                    SAUVEGARDER LA ZONE
                                                </button>
                                            ) : (
                                                <button onClick={() => setPatrolPoints([])} className="w-full bg-white/5 text-white/40 text-[10px] font-bold py-2 rounded-lg border border-white/10">
                                                    RÉINITIALISER
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mission Control Buttons */}
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-center gap-4 tour-step-7">
                        <button
                            onClick={() => handleMissionCommand('VOICE_STREAMING', {
                                title: 'Démarrer le Voice Streaming ?',
                                text: 'Cela activera la transmission audio vers le drone.',
                                icon: 'info'
                            })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sea-cyan text-white font-orbitron font-bold text-xs hover:bg-sea-cyan/80 transition-all shadow-lg shadow-sea-cyan/20"
                        >
                            <Mic size={16} /> VOICE STREAMING
                        </button>
                        <button
                            onClick={() => handleMissionCommand('PARACHUTE', {
                                title: 'Déployer le Parachute ?',
                                text: 'ATTENTION : Cela stoppera les moteurs et fera descendre le drone immédiatement.',
                                icon: 'warning',
                                confirmColor: '#f97316'
                            })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-orbitron font-bold text-xs hover:bg-orange-500 hover:text-white transition-all"
                        >
                            <Fan size={16} /> DÉPLOYER PARACHUTE
                        </button>
                        <button
                            onClick={() => handleMissionCommand('FAIL_SAFE', {
                                title: 'Activer le Fail Safe ?',
                                text: 'Le drone passera en mode de sécurité d\'urgence.',
                                icon: 'error',
                                confirmColor: '#ef4444'
                            })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-orbitron font-bold text-xs hover:bg-red-500 hover:text-white transition-all"
                        >
                            <ShieldAlert size={16} /> FAIL SAFE
                        </button>
                        <button
                            onClick={() => handleMissionCommand('RTH', {
                                title: 'Retour à la base (RTH) ?',
                                text: 'Le drone annulera sa mission actuelle et reviendra au point de décollage.',
                                icon: 'question'
                            })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-orbitron font-bold text-xs hover:bg-white/10 hover:text-white transition-all"
                        >
                            <Home size={16} /> RETURN HOME
                        </button>
                    </div>
                </div>

                {/* Sidebar area (Column 3) */}
                <div className={`${layoutMode === 'standard' ? 'lg:col-span-1' : layoutMode === 'video_focus' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6 transition-all duration-500 tour-step-4`}>
                    {!isSwapped ? (
                        /* Default: Video Feed in Right/Small Area */
                        <div id="video-container" className="aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative group bg-black tour-step-6">
                            <VideoFeed src={selectedDrone?.adresse_ip_camera} />
                            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start pointer-events-auto">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setLayoutMode(layoutMode === 'standard' ? 'video_focus' : 'standard')}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Mode Focus"
                                        >
                                            {layoutMode === 'standard' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setIsSwapped(true)}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Agrandir le flux"
                                        >
                                            <Repeat size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleFullscreen('video-container')}
                                            className="bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/60 hover:text-sea-cyan transition-all"
                                            title="Plein Écran"
                                        >
                                            <Maximize2 size={16} />
                                        </button>
                                    </div>
                                    {selectedDrone && (
                                        <div className="flex flex-col gap-2 items-end">
                                            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-1.5">
                                                    <Battery size={12} className={selectedDrone.batterie < 20 ? 'text-red-500' : 'text-green-500'} />
                                                    <span className="text-[10px] font-mono text-white font-bold">{selectedDrone.batterie || 100}%</span>
                                                </div>
                                                <div className="w-px h-3 bg-white/10"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <Navigation size={12} className="text-sea-cyan" />
                                                    <span className="text-[10px] font-mono text-white font-bold">{selectedDrone.altitude || 0}m</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* HUD Overlays */}
                                <div className="absolute inset-x-4 top-4 flex justify-between pointer-events-none z-30">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                        <Crosshair className="text-sea-cyan animate-pulse" size={12} />
                                        <span className="text-[8px] font-mono text-white/80 uppercase">Tracking Active</span>
                                    </div>
                                    {isSwapped && (
                                        <div className="text-right">
                                            <p className="text-[8px] font-mono text-white/80">{new Date().toLocaleTimeString()}</p>
                                            <p className="text-[8px] font-mono text-white/40 italic">LAT: {selectedDrone?.position_actuelle?.lat?.toFixed(6) || '---'}</p>
                                            <p className="text-[8px] font-mono text-white/40 italic">LNG: {selectedDrone?.position_actuelle?.lng?.toFixed(6) || '---'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Swapped: Map in Right/Small Area */
                        <div className="h-[300px] lg:h-[400px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                            <LiveMap drones={drones} onMapClick={handleMapClick} patrolPoints={patrolPoints} theme="light" zones={zones} />
                            <button
                                onClick={() => setIsSwapped(false)}
                                className="absolute top-4 right-4 z-[1000] bg-sea-dark/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-white/40 hover:text-sea-cyan transition-all"
                                title="Récupérer Carte"
                            >
                                <Repeat size={16} />
                            </button>
                        </div>
                    )}

                    {/* Alertes section remains in the right column regardless of internal swap? 
                        Actually, it's usually better to keep the side panel for alerts/info. */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-orbitron font-bold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" /> Alertes en attente
                            </h3>
                            <StatCard
                                title="Urgences"
                                value={stats.declarations}
                                icon={AlertTriangle}
                                color="#F56565"
                            />
                        </div>

                        {/* DÉCLARATIONS NAGEURS */}
                        {declarations.length > 0 && (
                            <>
                                <div className="flex items-center gap-3 mb-6 mt-8">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                    <h2 className="text-xl font-bold text-white">Déclarations Nageurs</h2>
                                </div>
                                <div className="flex flex-col gap-4 mb-8">
                                    {declarations.map(decl => (
                                        <div key={decl._id} className="bg-red-500/10 border-l-4 border-red-500 rounded-2xl p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                                        S.O.S
                                                    </span>
                                                    <span className="text-red-400/80 text-sm font-medium">
                                                        {new Date(decl.timestamp || decl.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="px-3 py-1 bg-sea-dark rounded-lg text-sm font-medium text-white border border-white/10">
                                                    Par: {decl.nageur_id?.nom} {decl.nageur_id?.prenom}
                                                </div>
                                            </div>
                                            <p className="text-white text-lg font-medium mb-4">{decl.description}</p>
                                            <div className="flex gap-4 items-center">
                                                <div className="text-sm font-medium text-red-200/60 bg-red-500/5 px-4 py-2 rounded-xl">
                                                    📍 Lat: {decl.position?.lat.toFixed(4)}
                                                </div>
                                                <div className="text-sm font-medium text-red-200/60 bg-red-500/5 px-4 py-2 rounded-xl">
                                                    📍 Lng: {decl.position?.lng.toFixed(4)}
                                                </div>

                                                <button
                                                    onClick={() => handleDeployDrone(decl)}
                                                    className="ml-auto bg-sea-cyan hover:bg-sea-cyan/80 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-sea-cyan/20 flex items-center gap-2 cursor-pointer relative z-10"
                                                >
                                                    <Target size={14} /> DÉPLOYER DRONE ACTIF
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ALERTES DRONES CI-DESSOUS */}
                        <div className="flex items-center gap-3 mb-6 mt-8">
                            <Info className="w-6 h-6 text-sea-cyan" />
                            <h2 className="text-xl font-bold text-white">Alertes Systèmes</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSimulateAlert}
                                    className="text-[8px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all font-bold uppercase"
                                >
                                    Simuler
                                </button>
                                <span className="text-[10px] bg-orange-400/20 text-orange-400 font-bold px-2 py-0.5 rounded">
                                    {alertes.length} NEW
                                </span>
                            </div>
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
                </div>
            </div>

            {showAssignModal && (
                <AssignModal
                    alert={showAssignModal}
                    swimmers={swimmers}
                    drones={drones}
                    activeZone={activeZone}
                    onClose={() => setShowAssignModal(null)}
                    onAssign={async (swimmerId, droneId) => {
                        try {
                            if (!showAssignModal?.position?.lat || !showAssignModal?.position?.lng) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Données manquantes',
                                    text: 'Cette alerte ne contient pas de coordonnées GPS valides.',
                                    background: '#0a1628',
                                    color: '#fff'
                                });
                                return;
                            }

                            const token = localStorage.getItem('token');
                            const payload = {
                                alerte_id: showAssignModal._id,
                                nageur_id: swimmerId,
                                drone_id: droneId,
                                victime_position: {
                                    lat: showAssignModal.position.lat,
                                    lng: showAssignModal.position.lng
                                }
                            };

                            console.log('Sending mission payload:', payload);

                            await axios.post('/api/missions', payload, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            setAlertes(prev => prev.filter(a => a._id !== showAssignModal._id));
                            setShowAssignModal(null);

                            Swal.fire({
                                icon: 'success',
                                title: 'Mission affectée !',
                                text: 'Le nageur a été prévenu.',
                                background: '#0a1628',
                                color: '#fff',
                                confirmButtonColor: '#06b6d4'
                            });
                        } catch (err) {
                            console.error('Assignment error details:', err.response?.data);
                            Swal.fire({
                                icon: 'error',
                                title: 'Erreur',
                                text: 'Erreur lors de l\'affectation : ' + (err.response?.data?.message || err.message),
                                background: '#0a1628',
                                color: '#fff'
                            });
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
                <Route path="/drones/:id/live" element={<DroneLiveView />} />
                <Route path="/swimmers" element={<SwimmerManagement />} />
            </Routes>
        </Layout>
    );
};

export default ManagerDashboard;
