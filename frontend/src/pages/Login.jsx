import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, User, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'responsable_drone') navigate('/manager');
            else navigate('/');
        } catch (err) {
            setError('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="min-h-screen bg-sea-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-sea-dark/80 to-sea-dark"></div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-sea-cyan/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Waves className="w-8 h-8 text-sea-cyan" />
                    </div>
                    <h1 className="text-3xl font-orbitron font-bold text-white mb-2">SeaGuard</h1>
                    <p className="text-sea-light/70 text-sm font-dm">Systeme de Surveillance & Sauvetage</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 text-red-200 text-sm p-3 rounded-lg border border-red-500/30">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-sea-light/80 ml-1">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sea-light/50" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-sea-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sea-cyan focus:ring-1 focus:ring-sea-cyan transition-all"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-sea-light/80 ml-1">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sea-light/50" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-sea-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-sea-cyan focus:ring-1 focus:ring-sea-cyan transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sea-cyan to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Se Connecter
                    </button>
                </form>


                <div className="mt-8 text-center text-xs text-sea-light/40">
                    <p>&copy; 2026 SeaGuard AI Systems. Restricted Access.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
