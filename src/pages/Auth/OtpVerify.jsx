import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const OtpVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, devCode } = location.state || {};
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/mot-de-passe-oublie');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setError('');
        setInfo('');
        setLoading(true);
        try {
            await apiAdapter.verifyOtp(email, code);
            navigate('/reinitialiser-mot-de-passe', { state: { email, code } });
        } catch (err) {
            setError(err.response?.data?.message || 'Code invalide.');
        } finally {
            setLoading(false);
        }
    };

    const resend = async () => {
        if (!email) return;
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await apiAdapter.sendOtp(email);
            setInfo('Nouveau code envoyé.');
        } catch (err) {
            setError('Réenvoi impossible pour le moment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gris-clair px-4">
            <div className="w-full max-w-md bg-white rounded shadow p-4 md:p-6">
                <div className="mb-4 md:mb-6 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-noir-fonce">Vérification OTP</h1>
                    <p className="text-xs md:text-sm text-noir-leger mt-1">Entrez le code reçu par email</p>
                    {devCode && (
                        <p className="text-[11px] text-green-700 mt-2">Code (dev): {devCode}</p>
                    )}
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
                        <label htmlFor="code" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">Code OTP</label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gris rounded focus:ring-2 focus:ring-jaune focus:border-jaune text-sm tracking-widest text-center"
                            placeholder="000000"
                        />
                        <p className="text-[11px] text-noir-leger mt-1">Le code expire dans 5 minutes.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-2 md:py-2.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Vérification...</> : 'Vérifier'}
                    </button>
                </form>

                <div className="flex items-center justify-between mt-4">
                    <button onClick={resend} disabled={loading} className="text-xs md:text-sm text-noir-leger hover:text-jaune">
                        Renvoyer le code
                    </button>
                    <Link to="/mot-de-passe-oublie" className="text-xs md:text-sm text-noir-leger hover:text-jaune">Changer d'email</Link>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;


