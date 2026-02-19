import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, Shield, User as UserIcon, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'nageur'
    });
    const [message, setMessage] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/users', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Utilisateur créé avec succès' });
            setFormData({ nom: '', prenom: '', email: '', password: '', role: 'nageur' });
            fetchUsers();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la création' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-orbitron font-bold text-white border-b border-white/5 pb-4">Gestion des Utilisateurs</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl self-start">
                    <div className="flex items-center gap-3 mb-6">
                        <UserPlus className="text-sea-cyan" />
                        <h2 className="text-xl font-orbitron font-bold text-white">Créer un Compte</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {message.text}
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Nom</label>
                            <input name="nom" value={formData.nom} onChange={handleChange} required className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white focus:border-sea-cyan outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Prénom</label>
                            <input name="prenom" value={formData.prenom} onChange={handleChange} required className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white focus:border-sea-cyan outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white focus:border-sea-cyan outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Mot de passe</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white focus:border-sea-cyan outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-sea-light/60 uppercase tracking-widest mb-1 block">Rôle</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-sea-dark/50 border border-white/10 rounded-lg p-2 text-white focus:border-sea-cyan outline-none">
                                <option value="nageur">Nageur (Mobile)</option>
                                <option value="responsable_drone">Responsable Drone (Web)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-sea-cyan hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-sea-cyan/30 mt-4">
                            CRÉER L'UTILISATEUR
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl overflow-x-auto">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6">Liste du Personnel</h2>
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
                                    <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-sea-light/60" />
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
                                                <button onClick={() => handleDelete(user._id)} className="p-2 text-sea-light/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
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
            </div>
        </div>
    );
};

export default UserManagement;
