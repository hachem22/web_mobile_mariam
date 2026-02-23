import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import UserManagement from './UserManagement';
import DroneManagement from './DroneManagement';
import AdminStatistics from './AdminStatistics';
import DroneLiveView from './DroneLiveView';



const AdminDashboard = () => {
    return (
        <Layout role="admin">
            <Routes>
                <Route path="/" element={<AdminStatistics />} />
                <Route path="/drones" element={<DroneManagement />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/drones/:id/live" element={<DroneLiveView />} />
            </Routes>
        </Layout>
    );
};

export default AdminDashboard;
