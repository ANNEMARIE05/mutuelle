import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            setError(err.response?.data?.message || 'Les identifiants ne correspondent pas.');
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
                        <h1 className="text-4xl font-bold mb-2">Bon retour !</h1>
                        <p className="text-white/90 text-lg">
                            Connectez-vous à votre espace de gestion de mutuelle
                        </p>
                    </div>
                </div>
            </div>

            {/* Section droite avec formulaire */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo pour mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-block bg-jaune text-noir-fonce p-3 rounded mb-4">
                            <i className="fas fa-hospital text-3xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-noir-fonce">Mutuelle</h1>
                    </div>

                    {/* Titre du formulaire */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-noir-fonce mb-2">Connexion</h2>
                        <p className="text-noir-leger">Veuillez vous connecter à votre compte.</p>
                    </div>

                    {/* Messages d'erreur */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Info box */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                        <p className="text-sm">
                            <i className="fas fa-info-circle mr-2"></i>
                            <strong>Identifiants de test:</strong><br/>
                            Email: admin@mutuelle.com<br/>
                            Password: password
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-noir-leger mb-2">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gris rounded shadow-sm focus:ring-2 focus:ring-jaune focus:border-jaune transition-colors"
                                placeholder="admin@mutuelle.com"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-noir-leger mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gris rounded shadow-sm focus:ring-2 focus:ring-jaune focus:border-jaune transition-colors"
                                placeholder="••••••••"
                            />
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
                                <label htmlFor="remember" className="ml-2 text-sm text-noir-leger">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a href="#" className="text-sm text-noir-leger hover:text-jaune">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-3 px-4 rounded shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Connexion en cours...
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
