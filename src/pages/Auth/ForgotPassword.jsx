import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await apiAdapter.sendOtp(email);
            // Pass email (and code for dev) to next screen via state
            navigate('/verification-otp', { state: { email, devCode: res.code } });
        } catch (err) {
            setError(err.response?.data?.message || 'Impossible d\'envoyer le code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gris-clair px-4">
            <div className="w-full max-w-md bg-white rounded shadow p-4 md:p-6">
                <div className="mb-4 md:mb-6 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-noir-fonce">Mot de passe oublié</h1>
                    <p className="text-xs md:text-sm text-noir-leger mt-1">Entrez votre email pour recevoir un code OTP</p>
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
                        <label htmlFor="email" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">Adresse email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gris rounded focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            placeholder="ex: admin@mutuelle.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-2 md:py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Envoi...</> : 'Envoyer le code'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/connexion" className="text-xs md:text-sm text-noir-leger hover:text-jaune">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;


