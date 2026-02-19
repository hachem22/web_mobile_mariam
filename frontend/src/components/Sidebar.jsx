import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Plane, LogOut, Settings } from 'lucide-react';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Clear auth state
        navigate('/login');
    };

    const navItems = role === 'admin' ? [
        { icon: LayoutDashboard, label: 'Vue d\'ensemble', path: '/admin' },
        { icon: Plane, label: 'Gestion Drones', path: '/admin/drones' },
        { icon: Users, label: 'Gestion Utilisateurs', path: '/admin/users' },
    ] : [
        { icon: LayoutDashboard, label: 'Mission Control', path: '/manager' },
        { icon: Plane, label: 'Drones', path: '/manager/drones' },
    ];

    return (
        <div className="w-64 bg-sea-dark border-r border-white/5 flex flex-col h-screen">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 bg-sea-cyan rounded-lg flex items-center justify-center shadow-lg shadow-sea-cyan/30">
                    <span className="font-orbitron font-bold text-sea-dark">S</span>
                </div>
                <span className="font-orbitron font-bold text-xl text-white">SeaGuard</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin' || item.path === '/manager'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-sea-cyan/10 text-sea-cyan border-l-2 border-sea-cyan'
                                : 'text-sea-light/60 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sea-light/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
