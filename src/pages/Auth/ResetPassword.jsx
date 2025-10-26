import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, code } = location.state || {};
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        if (!email || !code) {
            navigate('/mot-de-passe-oublie');
        }
    }, [email, code, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !code) return;
        setError('');
        setInfo('');
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (password !== passwordConfirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        try {
            // Simulation délai
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Vérifier que le code est toujours valide
            const storedOtp = JSON.parse(localStorage.getItem('fake_otp') || '{}');
            if (!storedOtp.code || storedOtp.email !== email || storedOtp.code !== code) {
                throw new Error('Code invalide ou expiré.');
            }
            
            // Simuler la réinitialisation du mot de passe
            setInfo('Mot de passe réinitialisé. Redirection...');
            
            // Nettoyer le code OTP
            localStorage.removeItem('fake_otp');
            
            setTimeout(() => navigate('/connexion'), 1500);
        } catch (err) {
            setError(err.message || 'Impossible de réinitialiser le mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gris-clair px-4">
            <div className="w-full max-w-md bg-white rounded shadow p-4 md:p-6">
                <div className="mb-4 md:mb-6 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-noir-fonce">Nouveau mot de passe</h1>
                    <p className="text-xs md:text-sm text-noir-leger mt-1">Veuillez définir votre nouveau mot de passe</p>
                </div>

                {error && (
                    <div className="mb-3 bg-red-50 border-l-4 border-red-500 text-red-800 px-3 py-2 rounded">
                        <p className="text-xs">{error}</p>
                    </div>
                )}
                {info && (
                    <div className="mb-3 bg-green-50 border-l-4 border-green-500 text-green-800 px-3 py-2 rounded">
                        <p className="text-xs">{info}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 md:px-4 md:py-2.5 pr-10 border border-gris rounded focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-noir-leger">
                                <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">Confirmer le mot de passe</label>
                        <input
                            type={show ? 'text' : 'password'}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gris rounded focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-2 md:py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Réinitialisation...</> : 'Réinitialiser'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/connexion" className="text-xs md:text-sm text-noir-leger hover:text-jaune">Retour à la connexion</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;


