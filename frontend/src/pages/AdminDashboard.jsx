import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import UserManagement from './UserManagement';
import DroneManagement from './DroneManagement';

const AdminOverview = () => (
    <div>
        <h1 className="text-3xl font-orbitron mb-6 text-white border-b border-white/5 pb-4">Vue d'ensemble</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <h3 className="text-sea-light/60 text-sm font-dm uppercase tracking-wider mb-2">Drones Actifs</h3>
                <p className="text-4xl font-mono font-bold text-sea-cyan">0</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <h3 className="text-sea-light/60 text-sm font-dm uppercase tracking-wider mb-2">Missions Totales</h3>
                <p className="text-4xl font-mono font-bold text-sea-green">0</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <h3 className="text-sea-light/60 text-sm font-dm uppercase tracking-wider mb-2">Utilisateurs</h3>
                <p className="text-4xl font-mono font-bold text-white">0</p>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    return (
        <Layout role="admin">
            <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/drones" element={<DroneManagement />} />
                <Route path="/users" element={<UserManagement />} />
            </Routes>
        </Layout>
    );
};

export default AdminDashboard;
