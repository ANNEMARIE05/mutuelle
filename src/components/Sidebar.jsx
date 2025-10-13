import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ mobile = false, onClose, collapsed = false, onToggle }) => {
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
        <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col ${collapsed && !mobile ? 'w-20' : 'w-64'} bg-noir-fonce text-white shadow-lg transition-all duration-300`}>
            <div className={`${collapsed && !mobile ? 'p-4' : 'p-6'} border-b border-noir-leger relative`}>
                {collapsed && !mobile ? (
                    <div className="flex justify-center">
                        <i className="fas fa-hospital text-2xl text-jaune"></i>
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold text-jaune">
                        <i className="fas fa-hospital mr-2"></i>Mutuelle
                    </h1>
                )}
                {mobile && (
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-jaune"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                )}
                {!mobile && onToggle && (
                    <button 
                        onClick={onToggle}
                        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-jaune text-noir-fonce rounded-full w-6 h-6 flex items-center justify-center hover:bg-jaune-fonce transition-colors shadow-md"
                        title={collapsed ? "Déplier" : "Replier"}
                    >
                        <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
                    </button>
                )}
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={mobile ? onClose : undefined}
                        className={`flex items-center ${collapsed && !mobile ? 'justify-center px-3 py-3' : 'px-3 py-2'} rounded transition-colors group relative ${
                            isActive(item.path)
                                ? 'bg-jaune text-noir-fonce font-semibold'
                                : 'text-gray-300 hover:bg-noir-leger hover:text-white'
                        }`}
                        title={collapsed && !mobile ? item.label : ''}
                    >
                        <i className={`fas ${item.icon} ${collapsed && !mobile ? 'text-xl' : 'w-5 mr-3'}`}></i>
                        {(!collapsed || mobile) && item.label}
                        
                        {/* Tooltip pour mode collapsed */}
                        {collapsed && !mobile && (
                            <span className="absolute left-full ml-2 px-2 py-1 bg-noir-fonce text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;

