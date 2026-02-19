import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Cpu, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';

const DroneManagement = () => {
    const [drones, setDrones] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nom: '',
        modele: '',
        numero_serie: '',
        adresse_ip_camera: 'rtsp://192.168.1.11:8080', // Default provided by user (needs rtsp:// prefix for model validation)
        responsable_id: ''
    });
    const [message, setMessage] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [droneRes, userRes] = await Promise.all([
                axios.get('/api/drones', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setDrones(droneRes.data);
            setManagers(userRes.data.filter(u => u.role === 'responsable_drone'));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/drones', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Drone ajouté avec succès' });
            setFormData({ nom: '', modele: '', numero_serie: '', adresse_ip_camera: 'rtsp://192.168.1.11:8080', responsable_id: '' });
            fetchData();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l’ajout' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce drone ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/drones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-orbitron font-bold text-white border-b border-white/5 pb-4">Gestion de la Flotte</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Drone Form */}
                <div className="lg:col-span-1 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl self-start">
                    <div className="flex items-center gap-3 mb-6">
                        <Plus className="text-sea-cyan" />
                        <h2 className="text-xl font-orbitron font-bold text-white">Ajouter un Drone</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {message.text}
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Nom du Drone</label>
                            <input name="nom" value={formData.nom} onChange={handleChange} required placeholder="SeaGuard Alpha" className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-sea-cyan" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Modèle</label>
                            <input name="modele" value={formData.modele} onChange={handleChange} required placeholder="X-Rescue V2" className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-sea-cyan" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">S/N (Numéro de série)</label>
                            <input name="numero_serie" value={formData.numero_serie} onChange={handleChange} required placeholder="SG-001" className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-sea-cyan" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Flux Vidéo (RTSP)</label>
                            <input name="adresse_ip_camera" value={formData.adresse_ip_camera} onChange={handleChange} required className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-sea-cyan" />
                            <p className="text-[10px] text-sea-light/40 mt-1">Format requis: rtsp://...</p>
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Affecter à</label>
                            <select name="responsable_id" value={formData.responsable_id} onChange={handleChange} className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-sea-cyan">
                                <option value="">Choisir un Responsable</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.prenom} {m.nom}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-sea-cyan hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sea-cyan/30 mt-4">
                            AJOUTER AU REGISTRE
                        </button>
                    </form>
                </div>

                {/* Drone List */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6">État de la Flotte</h2>
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sea-cyan w-10 h-10" /></div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/5">
                                    <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Drone</th>
                                    <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Responsable</th>
                                    <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Statut</th>
                                    <th className="pb-4 text-xs font-dm uppercase text-sea-light/40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {drones.map(drone => {
                                    const resp = managers.find(m => m._id === drone.responsable_id);
                                    return (
                                        <tr key={drone._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-sea-cyan/10 flex items-center justify-center">
                                                        <Cpu className="w-4 h-4 text-sea-cyan" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold">{drone.nom}</div>
                                                        <div className="text-[10px] text-sea-light/40 font-mono">{drone.numero_serie}</div>
                                                    </div>
                                                </div>
                                            </td>
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
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${drone.statut === 'disponible' ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {drone.statut}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button onClick={() => handleDelete(drone._id)} className="p-2 text-sea-light/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {drones.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-10 text-center text-sea-light/20 italic">Aucun drone enregistré</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DroneManagement;
