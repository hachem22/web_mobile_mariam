import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Trash2, Cpu, Loader2, AlertCircle,
    X, Hash, Link as LinkIcon, User as UserIcon, Shield, Calendar, Activity,
    Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Shared Modal Backdrop ─────────────────────────────────────────── */
const Backdrop = ({ onClose, children }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
    >
        <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
);

/* ─── Info Row (reusable) ────────────────────────────────────────────── */
const InfoRow = ({ icon, label, value, mono = false }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
            <p className={`text-sm text-white truncate ${mono ? 'font-mono text-xs text-white/60' : 'font-medium'}`}>{value || '—'}</p>
        </div>
    </div>
);

/* ─── Status Badge ───────────────────────────────────────────────────── */
const StatusBadge = ({ statut }) => {
    const map = {
        disponible: 'bg-green-500/20 text-green-300 border border-green-500/30',
        en_mission: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
        maintenance: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
        hors_service: 'bg-red-500/20 text-red-300 border border-red-500/30',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${map[statut] || 'bg-white/10 text-white/60'}`}>
            {statut || '—'}
        </span>
    );
};

/* ─── Create Drone Modal ─────────────────────────────────────────────── */
const CreateDroneModal = ({ onClose, onCreated, managers }) => {
    const [formData, setFormData] = useState({
        nom: '', modele: '', numero_serie: '',
        adresse_ip_camera: 'rtsp://192.168.1.11:8080', responsable_id: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/drones', formData, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ type: 'success', text: 'Drone ajouté avec succès ✓' });
            setTimeout(() => { onCreated(); onClose(); }, 1200);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || "Erreur lors de l'ajout" });
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-colors";
    const labelCls = "text-[10px] text-white/40 uppercase tracking-widest mb-1 block";

    return (
        <Backdrop onClose={onClose}>
            <div
                className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1628 100%)' }}
            >
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#06b6d430,#3b82f630)', border: '1px solid rgba(6,182,212,0.3)' }}>
                            <Cpu className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-orbitron font-bold text-white">Nouveau Drone</h2>
                            <p className="text-xs text-white/30">Enregistrez un drone dans la flotte</p>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl text-sm mb-4 ${message.type === 'success' ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-red-500/15 text-red-300 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelCls}>Nom du Drone</label>
                                <input name="nom" value={formData.nom} onChange={handleChange} required className={inputCls} placeholder="SeaGuard Alpha" />
                            </div>
                            <div>
                                <label className={labelCls}>Modèle</label>
                                <input name="modele" value={formData.modele} onChange={handleChange} required className={inputCls} placeholder="X-Rescue V2" />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>S/N (Numéro de série)</label>
                            <input name="numero_serie" value={formData.numero_serie} onChange={handleChange} required className={inputCls} placeholder="SG-001" />
                        </div>
                        <div>
                            <label className={labelCls}>Flux Vidéo (RTSP)</label>
                            <input name="adresse_ip_camera" value={formData.adresse_ip_camera} onChange={handleChange} required className={inputCls} />
                            <p className="text-[10px] text-white/30 mt-1">Format requis : rtsp://...</p>
                        </div>
                        <div>
                            <label className={labelCls}>Affecter à un Responsable</label>
                            <select name="responsable_id" value={formData.responsable_id} onChange={handleChange} className={inputCls}>
                                <option value="">Choisir un responsable</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.prenom} {m.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                                Annuler
                            </button>
                            <button type="submit" disabled={loading}
                                className="flex-grow py-2.5 rounded-xl font-bold text-sm text-white transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'AJOUTER AU REGISTRE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Backdrop>
    );
};

/* ─── Drone Detail Modal ─────────────────────────────────────────────── */
const DroneDetailModal = ({ drone, managers, onClose }) => {
    if (!drone) return null;

    const resp = managers.find(m => m._id === (drone.responsable_id?._id || drone.responsable_id));
    const createdAt = drone.createdAt
        ? new Date(drone.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—';

    return (
        <Backdrop onClose={onClose}>
            <div
                className="relative w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1628 100%)' }}
            >
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 8px 32px rgba(6,182,212,0.35)' }}>
                            <Cpu className="w-9 h-9 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-orbitron font-bold text-white">{drone.nom}</h3>
                            <p className="text-sm text-white/40 mt-0.5 font-mono">{drone.numero_serie}</p>
                            <div className="mt-2">
                                <StatusBadge statut={drone.statut} />
                            </div>
                        </div>
                    </div>

                    {/* Info grid — 2 columns */}
                    <div className="grid grid-cols-2 gap-3">
                        <InfoRow icon={<Cpu className="w-4 h-4 text-cyan-400" />} label="Nom" value={drone.nom} />
                        <InfoRow icon={<Activity className="w-4 h-4 text-blue-400" />} label="Modèle" value={drone.modele} />
                        <InfoRow icon={<Hash className="w-4 h-4 text-white/30" />} label="Numéro de série" value={drone.numero_serie} mono />
                        <InfoRow icon={<Shield className="w-4 h-4 text-purple-400" />} label="Statut" value={drone.statut} />
                        <InfoRow icon={<LinkIcon className="w-4 h-4 text-green-400" />} label="Flux RTSP" value={drone.adresse_ip_camera} mono />
                        <InfoRow
                            icon={<UserIcon className="w-4 h-4 text-orange-400" />}
                            label="Responsable"
                            value={resp ? `${resp.prenom} ${resp.nom}` : 'Non affecté'}
                        />
                        <InfoRow icon={<Calendar className="w-4 h-4 text-green-400" />} label="Enregistré le" value={createdAt} />
                        <InfoRow icon={<Hash className="w-4 h-4 text-white/20" />} label="ID" value={drone._id} mono />
                    </div>
                </div>
            </div>
        </Backdrop>
    );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
const DroneManagement = () => {
    const navigate = useNavigate();
    const [drones, setDrones] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [droneRes, userRes] = await Promise.all([
                axios.get('/api/drones', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setDrones(droneRes.data);
            setManagers(userRes.data.filter(u => u.role === 'responsable_drone'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Supprimer ce drone ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/drones/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (selectedDrone?._id === id) setSelectedDrone(null);
            fetchData();
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Gestion de la Flotte</h1>
                    <p className="text-sm text-white/30 mt-1">{drones.length} drone{drones.length !== 1 ? 's' : ''} enregistré{drones.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Drone
                </button>
            </div>

            {/* Full-width fleet table */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-orbitron font-bold text-white">État de la Flotte</h2>
                    <p className="text-xs text-white/30">Cliquez sur un drone pour voir ses détails</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sea-cyan w-10 h-10" /></div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-white/5">
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Drone</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Modèle</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Responsable</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Statut</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {drones.map(drone => {
                                const resp = managers.find(m => m._id === (drone.responsable_id?._id || drone.responsable_id));
                                return (
                                    <tr
                                        key={drone._id}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedDrone(drone)}
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg,#06b6d420,#3b82f620)', border: '1px solid rgba(6,182,212,0.3)' }}>
                                                    <Cpu className="w-4 h-4 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{drone.nom}</div>
                                                    <div className="text-[10px] text-sea-light/40 font-mono">{drone.numero_serie}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-white/60">{drone.modele || '—'}</td>
                                        <td className="py-4">
                                            {resp ? (
                                                <div className="text-sm text-sea-light/80">{resp.prenom} {resp.nom}</div>
                                            ) : (
                                                <div className="text-sm text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Non affecté
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge statut={drone.statut} />
                                        </td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`${drone._id}/live`);
                                                }}
                                                className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                title="Voir en direct"
                                            >
                                                <Video className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(drone._id, e)}
                                                className="p-2 text-sea-light/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {drones.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-16 text-center">
                                        <Cpu className="w-10 h-10 text-white/10 mx-auto mb-3" />
                                        <p className="text-white/20 italic">Aucun drone enregistré</p>
                                        <button onClick={() => setShowCreateModal(true)} className="mt-3 text-xs text-cyan-400 hover:underline">
                                            + Ajouter le premier drone
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateDroneModal
                    managers={managers}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchData}
                />
            )}
            <DroneDetailModal drone={selectedDrone} managers={managers} onClose={() => setSelectedDrone(null)} />
        </div>
    );
};

export default DroneManagement;
