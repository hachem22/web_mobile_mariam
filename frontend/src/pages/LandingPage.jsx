import React from 'react';
import { Link } from 'react-router-dom';
import {
    Waves, Shield, Zap, Target, ArrowRight,
    BarChart3, Users, Map as MapIcon,
    Cpu, Activity, Globe, MousePointer2,
    ShieldAlert, ChevronRight
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl hover:border-sea-cyan/50 transition-all duration-500 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 bg-sea-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sea-cyan/20 transition-all duration-500">
            <Icon className="w-8 h-8 text-sea-cyan" />
        </div>
        <h3 className="text-xl font-orbitron font-bold text-white mb-4">{title}</h3>
        <p className="text-sea-light/70 font-dm leading-relaxed">
            {description}
        </p>
    </div>
);

const RoleCard = ({ icon: Icon, role, description, features, color, delay }) => (
    <div
        className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 group hover:border-white/20 transition-all duration-500 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} style={{ backgroundColor: color }}></div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6`} style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
            <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-2xl font-orbitron font-bold text-white mb-3">{role}</h3>
        <p className="text-sea-light/60 text-sm mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
            {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/80 font-dm">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }}></div>
                    {f}
                </li>
            ))}
        </ul>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-sea-dark font-body selection:bg-sea-cyan selection:text-white overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-sea-dark/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sea-cyan rounded-lg flex items-center justify-center shadow-lg shadow-sea-cyan/20">
                            <span className="font-orbitron font-bold text-white text-xl">S</span>
                        </div>
                        <span className="font-orbitron font-bold text-2xl text-white tracking-tight">SeaGuard</span>
                    </div>
                    <Link
                        to="/login"
                        className="bg-white/10 hover:bg-white/20 text-white font-dm font-semibold px-6 py-2.5 rounded-full border border-white/10 transition-all"
                    >
                        Accéder au Panel
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Visual Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-sea-dark/20 via-sea-dark/60 to-sea-dark z-10"></div>
                    <div className="absolute inset-0 opacity-30 z-20">
                        {/* Scanning Horizontal Line */}
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-sea-cyan to-transparent animate-scan shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                    </div>

                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-105"
                    >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-blue-ocean-with-waves-42618-large.mp4" type="video/mp4" />
                        <img
                            src="https://images.unsplash.com/photo-1517373116369-9bdb8ccddedc?q=80&w=2000&auto=format&fit=crop"
                            alt="Deep ocean surveillance"
                            className="w-full h-full object-cover animate-pulse-soft"
                        />
                    </video>
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 font-dm text-sm font-semibold mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sea-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sea-cyan"></span>
                        </span>
                        UNITÉ DE SURVEILLANCE PAR DRONE IA
                    </div>

                    <h1 className="text-6xl md:text-9xl font-orbitron font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                        ANTICIPER. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sea-cyan via-blue-400 to-emerald-400">AGIR. SAUVER.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-sea-light/80 font-dm max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100 italic">
                        "L'intelligence artificielle au service du sauvetage en mer pour une protection 24/7 de nos littoraux."
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in-up delay-200">
                        <Link
                            to="/login"
                            className="w-full md:w-auto bg-sea-cyan hover:bg-blue-500 text-white font-orbitron font-bold px-12 py-6 rounded-2xl flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-2 group"
                        >
                            DÉPLOIEMENT OPÉRATIONNEL <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-10 animate-float opacity-20 hidden lg:block">
                    <div className="w-32 h-32 rounded-3xl border border-sea-cyan/30 rotate-12"></div>
                </div>
                <div className="absolute bottom-1/4 right-10 animate-float delay-300 opacity-20 hidden lg:block">
                    <div className="w-24 h-24 rounded-full border border-sea-cyan/30"></div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-24 relative z-20 bg-sea-dark/80 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="text-5xl font-orbitron font-black text-white mb-2 group-hover:text-sea-cyan transition-colors">99%</div>
                            <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Précision IA</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-orbitron font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">{"<"}15s</div>
                            <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Temps de Réaction</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-orbitron font-black text-white mb-2 group-hover:text-blue-400 transition-colors">24/7</div>
                            <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Surveillance</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-orbitron font-black text-white mb-2 group-hover:text-purple-400 transition-colors">10k+</div>
                            <div className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Zones Sécurisées</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 bg-sea-dark relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl mb-20">
                        <div className="text-sea-cyan font-orbitron font-bold text-sm tracking-widest mb-4">TECHNOLOGIES</div>
                        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6">Écosystème de Sécurité Avancé</h2>
                        <div className="w-20 h-1 bg-sea-cyan rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={ShieldAlert}
                            title="Computer Vision"
                            description="Nos drones utilisent des réseaux de neurones convolutionnels pour identifier les nageurs en détresse dans toutes les conditions."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Télémétrie Live"
                            description="Visualisez l'état complet de votre flotte : batterie, signal, altitude et vitesse en temps réel sur tableau de bord."
                            delay={100}
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Géofencing"
                            description="Définissez des zones de surveillance prioritaires et recevez des alertes automatiques en cas d'intrusion ou incident."
                            delay={200}
                        />
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            </section>

            {/* How it Works Section (VIDEO) */}
            <section className="py-32 px-6 bg-slate-900/40 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-10">
                            <div className="space-y-4">
                                <span className="text-sea-cyan font-orbitron font-bold text-sm tracking-[0.3em] uppercase">Workflow Opérationnel</span>
                                <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white leading-tight">
                                    Comment ça <span className="text-transparent bg-clip-text bg-gradient-to-r from-sea-cyan to-blue-400">marche ?</span>
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-orbitron font-bold group-hover:border-sea-cyan/50 transition-all">01</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-2 group-hover:text-sea-cyan transition-colors">Détection Autonome</h4>
                                        <p className="text-sea-light/50 text-sm leading-relaxed">Nos drones patrouillent les zones à risque et analysent chaque pixel pour détecter des comportements de noyade ou des signaux de détresse.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-orbitron font-bold group-hover:border-blue-400/50 transition-all">02</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">Alerte Intelligente</h4>
                                        <p className="text-sea-light/50 text-sm leading-relaxed">Dès qu'une cible est identifiée, le système génère une alerte prioritaire avec flux vidéo direct et coordonnées GPS précises vers le centre de commandement.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-orbitron font-bold group-hover:border-emerald-400/50 transition-all">03</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">Intervention Guidée</h4>
                                        <p className="text-sea-light/50 text-sm leading-relaxed">Le nageur le plus proche reçoit la mission sur son application mobile et est guidé en temps réel vers la position exacte de la victime.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group cursor-pointer hover:border-sea-cyan/30 transition-all">
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-sea-dark/40 group-hover:bg-sea-dark/20 transition-all">
                                    <div className="w-24 h-24 bg-sea-cyan/20 backdrop-blur-md rounded-full flex items-center justify-center border border-sea-cyan/40 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <Zap className="w-10 h-10 text-white fill-white animate-pulse" />
                                    </div>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1200&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                                    alt="Sea Rescue Operation Demo"
                                />
                                <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 z-30">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                                    <span className="text-white text-xs font-orbitron font-bold tracking-[0.2em]">MISSION DEMO LIVE</span>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-sea-cyan/30 rounded-tr-[3rem] pointer-events-none"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-sea-cyan/30 rounded-bl-[3rem] pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roles Breakdown Section */}
            <section className="py-32 px-6 bg-slate-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6">Un Système, Trois Unités</h2>
                        <p className="text-white/40 font-dm max-w-2xl mx-auto text-lg leading-relaxed">Une coordination parfaite entre la stratégie, la surveillance et l'intervention sur le terrain.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <RoleCard
                            icon={Target}
                            role="Gouverneur (Admin)"
                            description="Supervision globale de l'écosystème SeaGuard et gestion des forces."
                            features={[
                                "Gestion complète des utilisateurs et rôles",
                                "Statistiques de performance globales",
                                "Audit des missions et incidents",
                                "Paramétrage du système IA"
                            ]}
                            color="#ef4444"
                            delay={0}
                        />
                        <RoleCard
                            icon={Cpu}
                            role="Responsable Drone"
                            description="Pilotage stratégique et surveillance temps réel des zones de baignade."
                            features={[
                                "Tableau de bord Mission Control",
                                "Gestion de la flotte de drones",
                                "Validation des alertes IA",
                                "Affectation des missions aux nageurs"
                            ]}
                            color="#06b6d4"
                            delay={100}
                        />
                        <RoleCard
                            icon={Users}
                            role="Nageur Sauveteur"
                            description="L'unité d'élite pour l'intervention rapide en mer via application mobile."
                            features={[
                                "Réception instantanée des alertes GPS",
                                "Navigation guidée vers la victime",
                                "Communication avec le commandement",
                                "Rapport d'incident mobile"
                            ]}
                            color="#22c55e"
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 px-6 bg-sea-dark relative overflow-hidden">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-sea-cyan/20 to-blue-600/20 border border-white/10 rounded-[40px] p-12 md:p-24 text-center relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                    <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-8">Prêt à sécuriser vos côtes ?</h2>
                    <p className="text-sea-light/70 text-lg md:text-xl font-dm mb-12 max-w-2xl mx-auto">
                        Rejoignez les littoraux qui font confiance à SeaGuard pour une sécurité maritime augmentée par l'intelligence artificielle.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-3 bg-white text-sea-dark font-orbitron font-bold px-10 py-5 rounded-2xl hover:bg-sea-cyan hover:text-white transition-all transform hover:scale-105"
                    >
                        ACCÉDER AU PANEL D'OPÉRATIONS <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-sea-cyan/10 blur-[150px] rounded-full pointer-events-none"></div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-slate-950 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sea-cyan/20 rounded-xl flex items-center justify-center border border-sea-cyan/30">
                                <span className="font-orbitron font-bold text-sea-cyan text-2xl">S</span>
                            </div>
                            <span className="font-orbitron font-bold text-2xl text-white tracking-widest">SEAGUARD</span>
                        </div>
                        <div className="flex gap-8 text-white/40 font-dm text-sm uppercase tracking-widest">
                            <a href="#" className="hover:text-sea-cyan transition-colors">Plateforme</a>
                            <a href="#" className="hover:text-sea-cyan transition-colors">Technologie</a>
                            <a href="#" className="hover:text-sea-cyan transition-colors">Sécurité</a>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
                        <p className="text-white/20 font-dm text-xs tracking-wider">
                            &copy; 2026 SEAGUARD AI SYSTEMS. TOUS DROITS RÉSERVÉS.
                        </p>
                        <div className="flex items-center gap-6 opacity-30 text-[10px] font-bold text-white uppercase tracking-[0.3em]">
                            <span>Vision par IA</span>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <span>Coordination Temps Réel</span>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <span>Sauvetage Augmenté</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
