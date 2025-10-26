import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OtpVerify from './pages/Auth/OtpVerify';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdherentsList from './pages/Adherents/AdherentsList';
import AdherentsCreate from './pages/Adherents/AdherentsCreate';
import AdherentsShow from './pages/Adherents/AdherentsShow';
import AdherentsEdit from './pages/Adherents/AdherentsEdit';
import PrestationsList from './pages/Prestations/PrestationsList';
import PrestationsCreate from './pages/Prestations/PrestationsCreate';
import PrestationsShow from './pages/Prestations/PrestationsShow';
import Profile from './pages/Profile';
import Layout from './components/Layout';

// Fonction simple pour vérifier l'authentification
const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    return !!(token && user);
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated());
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gris-clair">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-jaune mb-4"></i>
                    <p className="text-noir-leger">Chargement...</p>
                </div>
            </div>
        );
    }
    
    return authenticated ? children : <Navigate to="/connexion" replace />;
};

// Guest Route Component (pour les routes comme login)
const GuestRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated());
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gris-clair">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-jaune mb-4"></i>
                    <p className="text-noir-leger">Chargement...</p>
                </div>
            </div>
        );
    }
    
    return authenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route
                path="/connexion"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />
            <Route
                path="/mot-de-passe-oublie"
                element={
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                }
            />
            <Route
                path="/verification-otp"
                element={
                    <GuestRoute>
                        <OtpVerify />
                    </GuestRoute>
                }
            />
            <Route
                path="/reinitialiser-mot-de-passe"
                element={
                    <GuestRoute>
                        <ResetPassword />
                    </GuestRoute>
                }
            />
            
            {/* Routes protégées */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/adherents"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AdherentsList />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/adherents/creer"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AdherentsCreate />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/adherents/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AdherentsShow />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/adherents/:id/modifier"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AdherentsEdit />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/prestations"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <PrestationsList />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/prestations/creer"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <PrestationsCreate />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/prestations/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <PrestationsShow />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/connexion" replace />} />
            <Route path="*" element={<Navigate to="/connexion" replace />} />
        </Routes>
    );
}

export default App;
