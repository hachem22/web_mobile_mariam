import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Shield, Zap, Target, ArrowRight, BarChart3, Users, Map as MapIcon } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl hover:border-sea-cyan/50 transition-all duration-500 group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 bg-sea-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-8 h-8 text-sea-cyan" />
        </div>
        <h3 className="text-xl font-orbitron font-bold text-white mb-4">{title}</h3>
        <p className="text-sea-light/70 font-dm leading-relaxed">
            {description}
        </p>
    </div>
);

const StatCard = ({ value, label }) => (
    <div className="text-center">
        <div className="text-5xl font-orbitron font-black text-white mb-2">{value}</div>
        <div className="text-sea-cyan font-dm font-medium uppercase tracking-widest text-sm">{label}</div>
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
                        Accéder
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Visual Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-sea-dark/60 via-sea-dark/80 to-sea-dark z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2000&auto=format&fit=crop"
                        alt="Ocean background"
                        className="w-full h-full object-cover scale-110 animate-[pulse_10s_ease-in-out_infinite]"
                    />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sea-cyan/10 border border-sea-cyan/20 text-sea-cyan font-dm text-sm font-semibold mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sea-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sea-cyan"></span>
                        </span>
                        SYSTÈME INTELLIGENT DE SAUVETAGE MARITIME
                    </div>

                    <h1 className="text-6xl md:text-8xl font-orbitron font-black text-white mb-8 tracking-tighter leading-none">
                        Surveiller. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sea-cyan to-blue-500">Détecter. Sauver.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-sea-light/80 font-dm max-w-2xl mx-auto mb-12 leading-relaxed">
                        La plateforme de surveillance par drone pilotée par IA pour une réactivité absolue en mer.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link
                            to="/login"
                            className="w-full md:w-auto bg-sea-cyan hover:bg-blue-500 text-white font-orbitron font-bold px-10 py-5 rounded-xl flex items-center justify-center gap-3 shadow-2xl shadow-sea-cyan/30 transition-all transform hover:-translate-y-1"
                        >
                            DÉPLOYER LA PLATEFORME <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Radar effect decoration */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-sea-cyan/5 rounded-full border border-sea-cyan/10 animate-[ping_5s_infinite] pointer-events-none"></div>
                <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-sea-cyan/10 rounded-full border border-sea-cyan/20 animate-[ping_7s_infinite] pointer-events-none"></div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 bg-sea-dark relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 text-white">
                        <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">Technologie de Pointe</h2>
                        <div className="w-24 h-1 bg-sea-cyan mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Shield}
                            title="IA Embarquée"
                            description="Détection automatique et instantanée des personnes en difficulté grâce à nos algorithmes de vision par ordinateur."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Temps Réel"
                            description="Coordination fluide entre les centres de commandement et les équipes d'intervention via Socket.IO."
                            delay={100}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Affectation Auto"
                            description="Algorithme intelligent dépêchant immédiatement le nageur le plus proche et disponible sur zone."
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-32 px-6 bg-slate-900/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8 animate-fade-in-left">
                            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white leading-tight">
                                Comment fonctionne le <span className="text-sea-cyan">Sauvetage ?</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-sea-cyan/20 flex items-center justify-center text-sea-cyan font-bold shrink-0 border border-sea-cyan/30">1</div>
                                    <div>
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-1">Détection IA</h4>
                                        <p className="text-sea-light/60">Le drone survole la zone en mode autonome et analyse le flux vidéo pour détecter des anomalies.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-sea-cyan/20 flex items-center justify-center text-sea-cyan font-bold shrink-0 border border-sea-cyan/30">2</div>
                                    <div>
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-1">Alerte Immédiate</h4>
                                        <p className="text-sea-light/60">Une notification est envoyée au responsable drone avec les coordonnées GPS précises de la victime.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-sea-cyan/20 flex items-center justify-center text-sea-cyan font-bold shrink-0 border border-sea-cyan/30">3</div>
                                    <div>
                                        <h4 className="text-white font-orbitron font-bold text-lg mb-1">Déploiement Nageur</h4>
                                        <p className="text-sea-light/60">Le nageur le plus proche reçoit la mission sur son mobile et est guidé vers la cible.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative animate-fade-in-right">
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                                <div className="absolute inset-0 flex items-center justify-center bg-sea-dark/40 group-hover:bg-sea-dark/20 transition-all pointer-events-none">
                                    <div className="w-20 h-20 bg-sea-cyan rounded-full flex items-center justify-center shadow-2xl shadow-sea-cyan/50 animate-pulse">
                                        <Zap className="w-8 h-8 text-white fill-white" />
                                    </div>
                                </div>
                                {/* Video Placeholder Content */}
                                <img
                                    src="https://images.unsplash.com/photo-1500375591448-4a4c84150dc5?q=80&w=1000&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-60"
                                    alt="Rescue Operation Demo"
                                />
                                <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                    <span className="text-white text-sm font-dm font-bold uppercase tracking-widest">LIVE DEMO</span>
                                </div>
                            </div>
                            {/* Decorative Frame */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-sea-cyan rounded-tr-3xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-sea-cyan rounded-bl-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-950 border-t border-white/5 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 bg-sea-cyan rounded-lg flex items-center justify-center">
                            <span className="font-orbitron font-bold text-white text-sm">S</span>
                        </div>
                        <span className="font-orbitron font-bold text-lg text-white">SeaGuard</span>
                    </div>
                    <p className="text-sea-light/30 font-dm text-sm">
                        &copy; 2026 SeaGuard AI Systems. Tous droits réservés. <br />
                        Technologie de surveillance maritime de nouvelle génération.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
