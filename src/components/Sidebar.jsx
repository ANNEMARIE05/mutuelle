import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ mobile = false, onClose }) => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const menuItems = [
        { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { path: '/adherents', icon: 'fa-users', label: 'Adhérents' },
        { path: '/actions', icon: 'fa-bolt', label: 'Actions' },
    ];

    return (
        <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-64 bg-noir-fonce text-white shadow-lg`}>
            <div className="p-6 border-b border-noir-leger">
                <h1 className="text-2xl font-bold text-jaune">
                    <i className="fas fa-hospital mr-2"></i>Mutuelle
                </h1>
                {mobile && (
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-jaune"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                )}
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={mobile ? onClose : undefined}
                        className={`flex items-center px-3 py-2 rounded transition-colors ${
                            isActive(item.path)
                                ? 'bg-jaune text-noir-fonce font-semibold'
                                : 'text-gray-300 hover:bg-noir-leger hover:text-white'
                        }`}
                    >
                        <i className={`fas ${item.icon} w-5 mr-3`}></i>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;

