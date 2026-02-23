import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Shield, Activity, Clock, MapPin, User as UserIcon, Loader2, RefreshCcw } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</p>
            <p className="text-2xl font-orbitron font-bold text-white leading-none">{value}</p>
        </div>
    </div>
);

const SwimmerManagement = () => {
    const [swimmers, setSwimmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchSwimmers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
            // Filter only swimmers
            const filtered = res.data.filter(u => u.role === 'nageur');
            setSwimmers(filtered);
        } catch (err) {
            console.error('Error fetching swimmers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSwimmers();
    }, []);

    const filteredSwimmers = swimmers.filter(s => {
        const matchesSearch = `${s.nom} ${s.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || s.statut_dispo === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: swimmers.length,
        available: swimmers.filter(s => s.statut_dispo === 'disponible').length,
        inMission: swimmers.filter(s => s.statut_dispo === 'en_mission').length,
        offline: swimmers.filter(s => s.statut_dispo === 'hors_ligne').length
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'disponible':
                return { label: 'Disponible', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]' };
            case 'en_mission':
                return { label: 'En Mission', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.1)]' };
            case 'hors_ligne':
                return { label: 'Hors Ligne', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' };
            default:
                return { label: 'Inconnu', color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' };
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                        <Users className="text-sea-cyan" /> Équipes de Nageurs
                    </h1>
                    <p className="text-sm text-white/30 mt-1">Supervision en temps réel des effectifs sur le terrain</p>
                </div>
                <button
                    onClick={fetchSwimmers}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider"
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    Actualiser
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Nageurs" value={stats.total} color="text-sea-cyan" />
                <StatCard icon={Shield} label="Disponibles" value={stats.available} color="text-green-400" />
                <StatCard icon={Activity} label="En Mission" value={stats.inMission} color="text-blue-400" />
                <StatCard icon={Clock} label="Hors Ligne" value={stats.offline} color="text-white/40" />
            </div>

            {/* Filters section */}
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="search"
                        placeholder="Rechercher un nageur..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sea-cyan/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {['all', 'disponible', 'en_mission', 'hors_ligne'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filterStatus === status
                                ? 'bg-sea-cyan/20 border-sea-cyan/30 text-sea-cyan'
                                : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {status === 'all' ? 'TOUS' : status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of swimmers */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-sea-cyan w-10 h-10" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSwimmers.map((swimmer) => {
                        const status = getStatusStyles(swimmer.statut_dispo);
                        return (
                            <div
                                key={swimmer._id}
                                className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sea-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sea-cyan/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                {(swimmer.prenom?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-sea-cyan transition-colors">
                                                    {swimmer.prenom} {swimmer.nom}
                                                </h3>
                                                <p className="text-xs text-white/30 lowercase">{swimmer.email}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${status.bg} ${status.color} border ${status.border}`}>
                                            {status.label}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-white/40 flex items-center gap-2 uppercase tracking-widest font-medium">
                                                <Activity size={14} className="text-sea-cyan" /> Activité
                                            </span>
                                            <span className="text-white font-mono italic">
                                                {swimmer.statut_dispo === 'en_mission' ? 'Mission Active' : 'En attente'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-white/40 flex items-center gap-2 uppercase tracking-widest font-medium">
                                                <MapPin size={14} className="text-sea-cyan" /> Secteur
                                            </span>
                                            <span className="text-white font-mono italic">Zone Nord-Ouest</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                                            Profil Complet
                                        </button>
                                        <button className="flex-1 py-2.5 rounded-xl bg-sea-cyan/10 border border-sea-cyan/20 text-sea-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-sea-cyan hover:text-white transition-all shadow-lg hover:shadow-sea-cyan/20">
                                            Contacter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredSwimmers.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <UserIcon size={48} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/40 font-orbitron">Aucun nageur trouvé</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SwimmerManagement;
