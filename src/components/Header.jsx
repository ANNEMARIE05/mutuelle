import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setLogoutModalOpen(false);
        navigate('/connexion');
    };

    // Fonction pour obtenir le titre de la page
    const getPageTitle = () => {
        const path = location.pathname;
        
        if (path === '/dashboard') return 'Dashboard';
        if (path.startsWith('/adherents')) {
            if (path === '/adherents') return 'Liste des Adhérents';
            if (path.includes('/creer')) return 'Nouvel Adhérent';
            if (path.includes('/modifier')) return 'Modifier Adhérent';
            return 'Détails Adhérent';
        }
        if (path.startsWith('/actions')) {
            if (path === '/actions') return 'Liste des Actions';
            if (path.includes('/creer')) return 'Nouvelle Action';
            return 'Détails Action';
        }
        if (path === '/profile') return 'Mon Profil';
        
        return 'Dashboard';
    };

    return (
        <>
            <header className="bg-white border-b border-gris shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Logo mobile */}
                    <div className="lg:hidden">
                        <h1 className="text-xl font-bold text-noir-fonce">
                            <i className="fas fa-hospital text-jaune mr-2"></i>Mutuelle
                        </h1>
                    </div>
                    
                    {/* Titre page desktop */}
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-noir-fonce">
                            {getPageTitle()}
                        </h1>
                    </div>

                    {/* Bouton menu mobile */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-noir-leger focus:outline-none"
                    >
                        <i className="fas fa-bars text-2xl"></i>
                    </button>

                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 p-2 rounded-full bg-jaune hover:bg-jaune-fonce transition-colors"
                        >
                            <div className="w-8 h-8 bg-noir-fonce rounded-full flex items-center justify-center">
                                <i className="fas fa-user text-jaune text-sm"></i>
                            </div>
                            <span className="hidden md:block text-noir-fonce font-medium">
                                {user?.name}
                            </span>
                            <i className="fas fa-chevron-down text-noir-fonce text-xs"></i>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gris z-50">
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-noir-leger hover:bg-gris-clair"
                                    >
                                        <i className="fas fa-user mr-2"></i>Profil
                                    </Link>
                                    <hr className="my-1" />
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            setLogoutModalOpen(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {logoutModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg p-6 max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-2 rounded-full mr-3">
                                <i className="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-noir-fonce">
                                Confirmer la déconnexion
                            </h3>
                        </div>
                        <p className="text-noir-leger mb-6">
                            Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à nouveau à l'application.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setLogoutModalOpen(false)}
                                className="px-4 py-2 border border-gris text-noir-leger hover:bg-gris-clair rounded transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

