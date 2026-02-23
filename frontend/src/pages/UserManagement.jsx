import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, User as UserIcon, Loader2, X, Mail, Shield, Calendar, Hash } from 'lucide-react';

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

const ModalCard = ({ children }) => (
    <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1628 100%)' }}
    >
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
        {children}
    </div>
);

/* ─── Create User Modal ─────────────────────────────────────────────── */
const CreateUserModal = ({ onClose, onCreated }) => {
    const [formData, setFormData] = useState({ nom: '', prenom: '', email: '', password: '', role: 'nageur' });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/users', formData, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ type: 'success', text: 'Utilisateur créé avec succès ✓' });
            setTimeout(() => { onCreated(); onClose(); }, 1200);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la création' });
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none transition-all font-orbitron text-sm";
    const labelCls = "text-[10px] text-white/40 uppercase tracking-widest mb-1 shadow-sm block font-orbitron";

    return (
        <Backdrop onClose={onClose}>
            <ModalCard>
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#06b6d430,#3b82f630)', border: '1px solid rgba(6,182,212,0.3)' }}>
                            <UserPlus className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-orbitron font-bold text-white">Nouvel Utilisateur</h2>
                            <p className="text-xs text-white/30">Remplissez les informations ci-dessous</p>
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
                                <label className={labelCls}>Prénom</label>
                                <input name="prenom" value={formData.prenom} onChange={handleChange} required className={inputCls} placeholder="Jean" />
                            </div>
                            <div>
                                <label className={labelCls}>Nom</label>
                                <input name="nom" value={formData.nom} onChange={handleChange} required className={inputCls} placeholder="Dupont" />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="jean.dupont@seaguard.com" />
                        </div>
                        <div>
                            <label className={labelCls}>Mot de passe</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="••••••••" />
                        </div>
                        <div>
                            <label className={labelCls}>Rôle</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={inputCls}>
                                <option value="nageur">🏊 Nageur (Mobile)</option>
                                <option value="responsable_drone">🚁 Responsable Drone (Web)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-2 flex-grow py-2.5 rounded-xl font-bold text-sm text-white transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'CRÉER L\'UTILISATEUR'}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalCard>
        </Backdrop>
    );
};

/* ─── User Detail Modal ─────────────────────────────────────────────── */
const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    const roleColors = {
        admin: 'bg-red-500/20 text-red-300 border border-red-500/30',
        responsable_drone: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
        nageur: 'bg-green-500/20 text-green-300 border border-green-500/30',
    };
    const roleLabels = {
        admin: 'Administrateur',
        responsable_drone: 'Responsable Drone',
        nageur: 'Nageur (Mobile)',
    };
    const createdAt = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—';

    return (
        <Backdrop onClose={onClose}>
            {/* Larger card for detail view */}
            <div
                className="relative w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0d1f2d 0%, #0a1628 100%)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5" />
                </button>
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 8px 32px rgba(6,182,212,0.35)' }}>
                            {(user.prenom?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-2xl font-orbitron font-bold text-white">{user.prenom} {user.nom}</h3>
                            <p className="text-sm text-white/40 mt-0.5">{user.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${roleColors[user.role] || 'bg-white/10 text-white'}`}>
                                {roleLabels[user.role] || user.role}
                            </span>
                        </div>
                    </div>

                    {/* Info grid — 2 columns */}
                    <div className="grid grid-cols-2 gap-3">
                        <InfoRow icon={<Mail className="w-4 h-4 text-cyan-400" />} label="Email" value={user.email} />
                        <InfoRow icon={<UserIcon className="w-4 h-4 text-blue-400" />} label="Prénom" value={user.prenom} />
                        <InfoRow icon={<UserIcon className="w-4 h-4 text-blue-400" />} label="Nom" value={user.nom} />
                        <InfoRow icon={<Shield className="w-4 h-4 text-purple-400" />} label="Rôle" value={roleLabels[user.role] || user.role} />
                        <InfoRow icon={<Calendar className="w-4 h-4 text-green-400" />} label="Créé le" value={createdAt} />
                        <InfoRow icon={<Hash className="w-4 h-4 text-white/30" />} label="ID" value={user._id} mono />
                    </div>
                </div>
            </div>
        </Backdrop>
    );
};

const InfoRow = ({ icon, label, value, mono = false }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
            <p className={`text-sm text-white truncate ${mono ? 'font-mono text-xs text-white/60' : 'font-medium'}`}>{value || '—'}</p>
        </div>
    </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (selectedUser?._id === id) setSelectedUser(null);
            fetchUsers();
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Gestion des Utilisateurs</h1>
                    <p className="text-sm text-white/30 mt-1">{users.length} membre{users.length !== 1 ? 's' : ''} au total</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all transform hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}
                >
                    <UserPlus className="w-4 h-4" />
                    Nouvel Utilisateur
                </button>
            </div>

            {/* Full-width list */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-orbitron font-bold text-white">Liste du Personnel</h2>
                    <p className="text-xs text-white/30">Cliquez sur un utilisateur pour voir ses détails</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-sea-cyan w-10 h-10" /></div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-white/5">
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Utilisateur</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40">Rôle</th>
                                <th className="pb-4 text-xs font-dm uppercase text-sea-light/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr
                                    key={user._id}
                                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg,#06b6d420,#3b82f620)', border: '1px solid rgba(6,182,212,0.3)' }}>
                                                {(user.prenom?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">{user.prenom} {user.nom}</div>
                                                <div className="text-xs text-sea-light/40">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : user.role === 'responsable_drone' ? 'bg-sea-cyan/20 text-sea-cyan' : 'bg-green-500/20 text-green-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={(e) => handleDelete(user._id, e)}
                                                className="p-2 text-sea-light/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchUsers}
                />
            )}
            <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    );
};

export default UserManagement;
