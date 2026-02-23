import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Users, Cpu, Target, AlertTriangle, TrendingUp,
    Activity, Loader2, RefreshCw, Award, FileDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/* ─── Palette ────────────────────────────────────────────────────────── */
const C = {
    cyan: '#06b6d4',
    blue: '#3b82f6',
    green: '#22c55e',
    amber: '#f59e0b',
    red: '#ef4444',
    purple: '#a855f7',
    slate: '#94a3b8',
};

const tooltipStyle = {
    contentStyle: { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '10px', fontSize: 12 },
    itemStyle: { color: '#cbd5e1' },
    cursor: { fill: 'rgba(255,255,255,0.04)' },
};

/* ─── KPI Card ───────────────────────────────────────────────────────── */
const KpiCard = ({ icon: Icon, label, value, sub, color, loading }) => (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <Icon className="w-7 h-7" style={{ color }} />
        </div>
        <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
            {loading
                ? <div className="w-12 h-7 bg-white/10 rounded animate-pulse" />
                : <p className="text-3xl font-orbitron font-bold text-white">{value}</p>
            }
            {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
        </div>
    </div>
);

/* ─── Chart Card ─────────────────────────────────────────────────────── */
const ChartCard = ({ title, icon: Icon, iconColor, children, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl ${className}`}>
        <h3 className="text-base font-orbitron font-bold text-white mb-5 flex items-center gap-2">
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
            {title}
        </h3>
        {children}
    </div>
);

/* ─── Custom Donut Label ─────────────────────────────────────────────── */
const DonutCenter = ({ total, label }) => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-6" fontSize="26" fontWeight="bold" fill="white" fontFamily="'Orbitron', sans-serif">
            {total}
        </tspan>
        <tspan x="50%" dy="20" fontSize="10" fill="rgba(255,255,255,0.4)" textTransform="uppercase">
            {label}
        </tspan>
    </text>
);

/* ─── Main ───────────────────────────────────────────────────────────── */
const AdminStatistics = () => {
    const statsRef = useRef(null);
    const [data, setData] = useState({ users: [], drones: [], missions: [] });
    const [exporting, setExporting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchAll = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const h = { Authorization: `Bearer ${token}` };
            const [uRes, dRes, mRes] = await Promise.all([
                axios.get('/api/users', { headers: h }),
                axios.get('/api/drones', { headers: h }),
                axios.get('/api/missions', { headers: h }),
            ]);
            setData({ users: uRes.data, drones: dRes.data, missions: mRes.data });
            setLastUpdated(new Date().toLocaleTimeString('fr-FR'));
        } catch (err) {
            console.error('Stats fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleExportPDF = async () => {
        if (!statsRef.current) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(statsRef.current, {
                backgroundColor: '#0a1628',
                scale: 2,
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Rapport_Statistiques_SeaGuard_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('PDF Export error:', err);
            alert('Erreur lors de la génération du PDF');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    /* ── Derived metrics ── */
    const { users, drones, missions } = data;

    // Users by role
    const roleMap = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
    const rolePieData = [
        { name: 'Admin', value: roleMap['admin'] || 0, color: C.red },
        { name: 'Responsable Drone', value: roleMap['responsable_drone'] || 0, color: C.cyan },
        { name: 'Nageur', value: roleMap['nageur'] || 0, color: C.green },
    ].filter(d => d.value > 0);

    // Drones by status
    const droneStatusMap = drones.reduce((acc, d) => { acc[d.statut] = (acc[d.statut] || 0) + 1; return acc; }, {});
    const droneStatusData = [
        { name: 'Disponible', value: droneStatusMap['disponible'] || 0, color: C.green },
        { name: 'En Mission', value: droneStatusMap['en_mission'] || 0, color: C.cyan },
        { name: 'Hors Ligne', value: droneStatusMap['hors_ligne'] || 0, color: C.slate },
    ].filter(d => d.value > 0);

    // Missions by status bar chart
    const missionStatusData = [
        { name: 'Affectée', count: missions.filter(m => m.statut === 'affectee').length, fill: C.amber },
        { name: 'En Cours', count: missions.filter(m => m.statut === 'en_cours').length, fill: C.cyan },
        { name: 'Secourue', count: missions.filter(m => m.statut === 'victime_secourue').length, fill: C.green },
        { name: 'Terminée', count: missions.filter(m => m.statut === 'terminee').length, fill: C.blue },
        { name: 'Annulée', count: missions.filter(m => m.statut === 'annulee').length, fill: C.red },
    ];

    // Missions over time (by month)
    const missionsByMonth = (() => {
        const map = {};
        missions.forEach(m => {
            const date = new Date(m.createdAt || m.date_affectation);
            if (isNaN(date)) return;
            const key = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).map(([month, count]) => ({ month, count })).slice(-8);
    })();

    // Battery radar per drone (top 6)
    const batteryRadar = drones.slice(0, 6).map(d => ({
        drone: d.nom?.length > 12 ? d.nom.slice(0, 12) + '…' : d.nom,
        batterie: d.batterie ?? 100,
    }));

    // Top managers by drone count
    const managerDroneCounts = users
        .filter(u => u.role === 'responsable_drone')
        .map(u => ({
            name: `${u.prenom} ${u.nom}`,
            drones: drones.filter(d => d.responsable_id === u._id || d.responsable_id?._id === u._id).length,
            missions: missions.filter(m => m.responsable_id === u._id || m.responsable_id?._id === u._id).length,
        }))
        .sort((a, b) => b.missions - a.missions)
        .slice(0, 5);

    /* ── KPIs ── */
    const dronesActive = drones.filter(d => d.statut === 'en_mission').length;
    const missionSuccess = missions.filter(m => m.statut === 'victime_secourue' || m.statut === 'terminee').length;
    const successRate = missions.length ? Math.round((missionSuccess / missions.length) * 100) : 0;
    const avgBattery = drones.length ? Math.round(drones.reduce((a, d) => a + (d.batterie ?? 100), 0) / drones.length) : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-white/30 text-sm">Chargement des statistiques…</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white">Statistiques Globales</h1>
                    <p className="text-sm text-white/30 mt-1">
                        Dernière mise à jour : {lastUpdated || '—'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting || loading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm disabled:opacity-50"
                    >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                        {exporting ? 'Génération...' : 'Exporter PDF'}
                    </button>
                    <button
                        onClick={() => fetchAll(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>
            </div>

            <div ref={statsRef} className="space-y-8 p-4 rounded-3xl">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KpiCard icon={Users} label="Utilisateurs" value={users.length} sub={`${roleMap['nageur'] || 0} nageurs`} color={C.blue} loading={false} />
                    <KpiCard icon={Cpu} label="Drones" value={drones.length} sub={`${dronesActive} en mission`} color={C.cyan} loading={false} />
                    <KpiCard icon={Target} label="Missions" value={missions.length} sub={`${missionSuccess} réussies`} color={C.green} loading={false} />
                    <KpiCard icon={TrendingUp} label="Taux de Réussite" value={`${successRate}%`} sub={`Batterie moy. ${avgBattery}%`} color={C.purple} loading={false} />
                </div>

                {/* Row 1: Role Pie + Drone Status Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Répartition des Rôles" icon={Users} iconColor={C.blue}>
                        {rolePieData.length === 0
                            ? <p className="text-white/20 text-center py-16">Aucun utilisateur</p>
                            : (
                                <div>
                                    <div className="h-[240px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={rolePieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="none" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                                    {rolePieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip {...tooltipStyle} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-5 mt-2">
                                        {rolePieData.map((r, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                                <span className="text-xs text-white/60">{r.name} <span className="text-white font-bold">({r.value})</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </ChartCard>

                    <ChartCard title="État de la Flotte" icon={Cpu} iconColor={C.cyan}>
                        {droneStatusData.length === 0
                            ? <p className="text-white/20 text-center py-16">Aucun drone enregistré</p>
                            : (
                                <div>
                                    <div className="h-[240px] relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={droneStatusData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} dataKey="value" stroke="none" paddingAngle={5}>
                                                    {droneStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip {...tooltipStyle} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-orbitron font-bold text-white">{drones.length}</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Drones Total</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-5 mt-2">
                                        {droneStatusData.map((d, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                                                <span className="text-xs text-white/60">{d.name} <span className="text-white font-bold">({d.value})</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </ChartCard>
                </div>

                {/* Row 2: Mission Status Bar + Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Missions par Statut" icon={Target} iconColor={C.green}>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={missionStatusData} barSize={30}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip {...tooltipStyle} />
                                    <Bar dataKey="count" name="Missions" radius={[6, 6, 0, 0]}>
                                        {missionStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard title="Évolution des Missions" icon={TrendingUp} iconColor={C.purple}>
                        {missionsByMonth.length === 0
                            ? <p className="text-white/20 text-center py-16">Pas encore de données temporelles</p>
                            : (
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={missionsByMonth}>
                                            <defs>
                                                <linearGradient id="missionGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={C.purple} stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                            <Tooltip {...tooltipStyle} />
                                            <Area type="monotone" dataKey="count" name="Missions" stroke={C.purple} strokeWidth={2} fill="url(#missionGrad)" dot={{ r: 4, fill: C.purple, stroke: '#fff', strokeWidth: 1 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )
                        }
                    </ChartCard>
                </div>

                {/* Row 3: Battery Radar + Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Niveau Batterie par Drone" icon={Activity} iconColor={C.amber}>
                        {batteryRadar.length === 0
                            ? <p className="text-white/20 text-center py-16">Aucun drone</p>
                            : (
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={batteryRadar}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey="drone" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                            <Radar name="Batterie %" dataKey="batterie" stroke={C.amber} fill={C.amber} fillOpacity={0.25} strokeWidth={2} dot={{ r: 4, fill: C.amber }} />
                                            <Tooltip {...tooltipStyle} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            )
                        }
                    </ChartCard>

                    <ChartCard title="Classement Responsables" icon={Award} iconColor={C.cyan}>
                        {managerDroneCounts.length === 0
                            ? <p className="text-white/20 text-center py-16">Aucun responsable drone</p>
                            : (
                                <div className="space-y-3 mt-1">
                                    {managerDroneCounts.map((m, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-sm flex-shrink-0"
                                                style={{
                                                    background: i === 0 ? `${C.amber}20` : i === 1 ? `${C.slate}20` : 'rgba(255,255,255,0.05)',
                                                    color: i === 0 ? C.amber : i === 1 ? C.slate : 'rgba(255,255,255,0.4)',
                                                    border: `1px solid ${i === 0 ? C.amber : i === 1 ? C.slate : 'rgba(255,255,255,0.1)'}40`
                                                }}>
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{m.name}</p>
                                                <p className="text-xs text-white/40">{m.drones} drone{m.drones !== 1 ? 's' : ''} affecté{m.drones !== 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-orbitron font-bold" style={{ color: C.cyan }}>{m.missions}</p>
                                                <p className="text-[10px] text-white/30 uppercase tracking-wide">missions</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </ChartCard>
                </div>

                {/* Row 4: Full-width drone battery bar chart */}
                {drones.length > 0 && (
                    <ChartCard title="Batterie de Chaque Drone" icon={Activity} iconColor={C.green} className="col-span-full">
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={drones.map(d => ({ name: d.nom, batterie: d.batterie ?? 100 }))} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                                    <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Batterie']} />
                                    <Bar dataKey="batterie" name="Batterie" radius={[6, 6, 0, 0]}>
                                        {drones.map((d, i) => (
                                            <Cell key={i} fill={d.batterie > 60 ? C.green : d.batterie > 30 ? C.amber : C.red} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                )}
            </div>
        </div>
    );
};

export default AdminStatistics;
