import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, remember);
            navigate('/dashboard');
        } catch (err) {
            // Gestion détaillée des erreurs
            if (err.message === 'Network Error') {
                setError('Erreur de connexion. Veuillez vérifier votre connexion internet.');
            } else if (err.response) {
                // Erreurs avec réponse du serveur
                switch (err.response.status) {
                    case 401:
                        setError('Email ou mot de passe incorrect. Veuillez réessayer.');
                        break;
                    case 422:
                        setError('Les données saisies sont invalides. Veuillez vérifier vos informations.');
                        break;
                    case 429:
                        setError('Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.');
                        break;
                    case 500:
                        setError('Erreur serveur. Veuillez réessayer plus tard.');
                        break;
                    default:
                        setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
                }
            } else if (err.request) {
                // Requête envoyée mais pas de réponse
                setError('Aucune réponse du serveur. Veuillez vérifier votre connexion.');
            } else {
                // Autre type d'erreur
                setError('Une erreur inattendue est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Section gauche avec image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/login-bg.jpg')" }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-jaune/80 to-noir-fonce/60"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
                    <div className="mb-8">
                        <div className="inline-block bg-white/20 backdrop-blur-sm p-3 rounded mb-6">
                            <i className="fas fa-hospital text-4xl text-white"></i>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Bienvenue !</h1>
                        <p className="text-white/90 text-lg">
                            Connectez-vous à votre espace de gestion de mutuelle
                        </p>
                    </div>
                </div>
            </div>

            {/* Section droite avec formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-6 md:px-8 md:py-12 bg-white">
                <div className="max-w-md w-full">
                    {/* Logo pour mobile */}
                    <div className="lg:hidden text-center mb-6 md:mb-8">
                        <div className="inline-block bg-jaune text-noir-fonce p-3 md:p-4 rounded-full mb-4">
                            <i className="fas fa-hospital text-3xl md:text-4xl"></i>
                        </div>
                    </div>

                    {/* Titre du formulaire */}
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-noir-fonce mb-2">Connexion</h2>
                        <p className="text-sm md:text-base text-noir-leger">Veuillez vous connecter à votre compte</p>
                    </div>

                    {/* Messages d'erreur */}
                    {error && (
                        <div className="mb-4 md:mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-3 py-2 md:px-4 md:py-3 rounded shadow-sm animate-shake">
                            <div className="flex items-start">
                                <i className="fas fa-exclamation-circle mr-2 md:mr-3 mt-0.5 text-red-600 text-sm"></i>
                                <div>
                                    <p className="font-medium text-xs md:text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs md:text-sm font-medium text-noir-leger mb-1 md:mb-2">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gris rounded shadow-sm focus:ring-2 focus:ring-jaune focus:border-jaune transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="admin@mutuelle.com"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-xs md:text-sm font-medium text-noir-leger mb-1 md:mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    required
                                    disabled={loading}
                                    className="w-full px-3 py-2 md:px-4 md:py-3 pr-10 md:pr-12 border border-gris rounded shadow-sm focus:ring-2 focus:ring-jaune focus:border-jaune transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-noir-leger hover:text-noir-fonce focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    id="remember"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 text-jaune border-gris rounded focus:ring-jaune"
                                />
                                <label htmlFor="remember" className="ml-2 text-xs md:text-sm text-noir-leger">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a href="#" className="text-xs md:text-sm text-noir-leger hover:text-jaune">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-2.5 md:py-3 px-4 rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>
                                    <span className="hidden sm:inline">Connexion en cours...</span>
                                    <span className="sm:hidden">Connexion...</span>
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
