import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwords, setPasswords] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        // Récupérer les informations utilisateur
        const userData = localStorage.getItem('auth_user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validation
        if (passwords.password !== passwords.password_confirmation) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            setLoading(false);
            return;
        }

        if (passwords.password.length < 8) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
            setLoading(false);
            return;
        }

        try {
            // Simulation délai
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simuler la mise à jour du mot de passe
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès!' });
            setPasswords({
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: 'Une erreur est survenue lors de la modification du mot de passe' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-6">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-noir-fonce mb-2">Mon Profil</h1>
                <p className="text-sm md:text-base text-noir-leger">Gérez vos informations personnelles et votre mot de passe</p>
            </div>

            {/* Informations du profil */}
            <div className="bg-white rounded shadow p-3 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-noir-fonce mb-3 md:mb-4 pb-2 border-b-2 border-jaune">
                    <i className="fas fa-user mr-1 md:mr-2"></i>Informations Personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-noir-leger mb-1">Nom</label>
                        <div className="px-3 py-2 md:px-4 bg-gris-clair rounded-md text-noir-fonce text-sm md:text-base">{user?.name}</div>
                    </div>

                    <div>
                        <label className="block text-xs md:text-sm font-medium text-noir-leger mb-1">Email</label>
                        <div className="px-3 py-2 md:px-4 bg-gris-clair rounded-md text-noir-fonce text-sm md:text-base">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Modifier le mot de passe */}
            <div className="bg-white rounded shadow p-3 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-noir-fonce mb-3 md:mb-4 pb-2 border-b-2 border-jaune">
                    <i className="fas fa-lock mr-1 md:mr-2"></i>Modifier le Mot de Passe
                </h2>

                {message.text && (
                    <div
                        className={`mb-4 md:mb-6 px-3 py-2 md:px-4 md:py-3 rounded-md flex items-center text-xs md:text-sm ${
                            message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}
                    >
                        <i
                            className={`fas ${
                                message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                            } mr-1 md:mr-2`}
                        ></i>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-3 md:space-y-6">
                    <div>
                        <label htmlFor="current_password" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                            Mot de passe actuel <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="current_password"
                            id="current_password"
                            value={passwords.current_password}
                            onChange={handlePasswordChange}
                            required
                            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                            Nouveau mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={passwords.password}
                            onChange={handlePasswordChange}
                            required
                            minLength="8"
                            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                        />
                        <p className="text-xs text-noir-leger mt-1">Minimum 8 caractères</p>
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                            Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            id="password_confirmation"
                            value={passwords.password_confirmation}
                            onChange={handlePasswordChange}
                            required
                            minLength="8"
                            className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-1.5 md:px-6 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>Modification...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save mr-1 md:mr-2"></i>Modifier le mot de passe
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
