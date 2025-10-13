import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OtpVerify from './pages/Auth/OtpVerify';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdherentsList from './pages/Adherents/AdherentsList';
import AdherentsCreate from './pages/Adherents/AdherentsCreate';
import AdherentsShow from './pages/Adherents/AdherentsShow';
import AdherentsEdit from './pages/Adherents/AdherentsEdit';
import ActionsList from './pages/Actions/ActionsList';
import ActionsCreate from './pages/Actions/ActionsCreate';
import ActionsShow from './pages/Actions/ActionsShow';
import Profile from './pages/Profile';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
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
    
    return user ? children : <Navigate to="/connexion" replace />;
};

// Guest Route Component (pour les routes comme login)
const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
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
    
    return user ? <Navigate to="/dashboard" replace /> : children;
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
                path="/actions"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ActionsList />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/actions/creer"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ActionsCreate />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/actions/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ActionsShow />
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
