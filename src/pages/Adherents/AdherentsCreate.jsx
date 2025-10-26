import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdherentsCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        photo: null,
        situation_matrimoniale: '',
        email: '',
        numero_telephone: '',
        matricule: '',
        direction: '',
        entite: '',
        grade: '',
        fonction: ''
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Fonction simple pour créer un adhérent avec fake data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // Simulation délai
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Récupérer les adhérents existants
            const adherents = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            
            // Générer un nouvel ID
            const newId = adherents.length > 0 ? Math.max(...adherents.map(a => a.id)) + 1 : 1;
            
            // Créer le nouvel adhérent
            const newAdherent = {
                ...formData,
                id: newId,
                nom_complet: `${formData.prenom} ${formData.nom}`,
                est_actif: true,
                montant_total_cotisations: 0,
                montant_total_avantages: 0,
                created_at: new Date().toISOString().split('T')[0]
            };

            // Ajouter au localStorage
            adherents.push(newAdherent);
            localStorage.setItem('fake_adherents', JSON.stringify(adherents));

            navigate('/adherents');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Bouton retour et breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-4 py-2 text-noir-leger hover:text-jaune hover:bg-jaune-clair rounded transition-colors"
                >
                    <i className="fas fa-arrow-left mr-2"></i>Retour
                </button>
                <div className="hidden md:block">
                    <div className="flex items-center text-sm text-noir-leger">
                        <Link to="/adherents" className="hover:text-jaune">
                            <i className="fas fa-users mr-2"></i>Adhérents
                        </Link>
                        <i className="fas fa-chevron-right mx-2"></i>
                        <span className="text-noir">Nouvel adhérent</span>
                    </div>
                </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 md:p-5">
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Veuillez corriger les erreurs dans le formulaire.
                    </div>
                )}

                {/* Informations personnelles */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-noir-fonce mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-user mr-2"></i>Informations Personnelles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-noir mb-2">
                                Nom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-noir mb-2">
                                Prénom <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom[0]}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="photo" className="block text-sm font-medium text-noir mb-2">
                                Photo de profil
                            </label>
                            <input
                                type="file"
                                name="photo"
                                id="photo"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="situation_matrimoniale" className="block text-sm font-medium text-noir mb-2">
                                Situation Matrimoniale <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="situation_matrimoniale"
                                id="situation_matrimoniale"
                                value={formData.situation_matrimoniale}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié(e)">Marié(e)</option>
                                <option value="Divorcé(e)">Divorcé(e)</option>
                                <option value="Veuf(ve)">Veuf(ve)</option>
                            </select>
                            {errors.situation_matrimoniale && <p className="text-red-500 text-xs mt-1">{errors.situation_matrimoniale[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Coordonnées */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-noir-fonce mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-address-book mr-2"></i>Coordonnées
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-noir mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="numero_telephone" className="block text-sm font-medium text-noir mb-2">
                                Numéro de Téléphone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="numero_telephone"
                                id="numero_telephone"
                                value={formData.numero_telephone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.numero_telephone && <p className="text-red-500 text-xs mt-1">{errors.numero_telephone[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Informations professionnelles */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-noir-fonce mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-briefcase mr-2"></i>Informations Professionnelles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="matricule" className="block text-sm font-medium text-noir mb-2">
                                Matricule <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="matricule"
                                id="matricule"
                                value={formData.matricule}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.matricule && <p className="text-red-500 text-xs mt-1">{errors.matricule[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="direction" className="block text-sm font-medium text-noir mb-2">
                                Direction <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="direction"
                                id="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.direction && <p className="text-red-500 text-xs mt-1">{errors.direction[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="entite" className="block text-sm font-medium text-noir mb-2">
                                Entité <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="entite"
                                id="entite"
                                value={formData.entite}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.entite && <p className="text-red-500 text-xs mt-1">{errors.entite[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-noir mb-2">
                                Grade <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="grade"
                                id="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade[0]}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="fonction" className="block text-sm font-medium text-noir mb-2">
                                Fonction <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fonction"
                                id="fonction"
                                value={formData.fonction}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.fonction && <p className="text-red-500 text-xs mt-1">{errors.fonction[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gris">
                    <Link
                        to="/adherents"
                        className="px-6 py-2 border border-gris text-noir-leger rounded-md hover:bg-gris-clair transition-colors text-center"
                    >
                        <i className="fas fa-times mr-2"></i>Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>Enregistrement...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>Enregistrer l'Adhérent
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdherentsCreate;
