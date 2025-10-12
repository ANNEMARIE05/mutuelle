import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const ActionsCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [adherents, setAdherents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdherents, setSelectedAdherents] = useState([]);
    const [formData, setFormData] = useState({
        type_action: '',
        montant: '',
        date_application: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        fetchAdherents();
    }, []);

    const fetchAdherents = async () => {
        try {
            const data = await apiAdapter.getAdherents({ per_page: 1000 });
            setAdherents(data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des adhérents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const toggleAdherent = (adherentId) => {
        setSelectedAdherents((prev) =>
            prev.includes(adherentId)
                ? prev.filter((id) => id !== adherentId)
                : [...prev, adherentId]
        );
    };

    const selectAll = () => {
        const filteredIds = filteredAdherents.map((a) => a.id);
        setSelectedAdherents(filteredIds);
    };

    const deselectAll = () => {
        setSelectedAdherents([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        if (selectedAdherents.length === 0) {
            setErrors({ adherents: ['Veuillez sélectionner au moins un adhérent'] });
            setSaving(false);
            return;
        }

        try {
            await apiAdapter.createAction({
                ...formData,
                adherents: selectedAdherents
            });
            navigate('/actions');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Une erreur est survenue lors de la création de l\'action');
            }
        } finally {
            setSaving(false);
        }
    };

    const filteredAdherents = adherents.filter((adherent) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            adherent.nom_complet?.toLowerCase().includes(searchLower) ||
            adherent.matricule?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="mb-6">
                <div className="flex items-center text-sm text-noir-leger mb-2">
                    <Link to="/actions" className="hover:text-jaune">
                        <i className="fas fa-bolt mr-2"></i>Actions
                    </Link>
                    <i className="fas fa-chevron-right mx-2"></i>
                    <span className="text-noir">Nouvelle action</span>
                </div>
                <h1 className="text-3xl font-bold text-noir-fonce">
                    <i className="fas fa-plus-circle text-jaune mr-2"></i>Créer une Action
                </h1>
                <p className="text-noir-leger mt-2">Appliquer une action sur un ou plusieurs adhérents</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 md:p-5">
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Veuillez corriger les erreurs dans le formulaire.
                    </div>
                )}

                {/* Informations de l'action */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-noir-fonce mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-info-circle mr-2"></i>Informations de l'Action
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="type_action" className="block text-sm font-medium text-noir mb-2">
                                Type d'Action <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="type_action"
                                id="type_action"
                                value={formData.type_action}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Bonus, Pénalité, Aide exceptionnelle..."
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.type_action && <p className="text-red-500 text-xs mt-1">{errors.type_action[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="montant" className="block text-sm font-medium text-noir mb-2">
                                Montant (FCFA) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="montant"
                                id="montant"
                                value={formData.montant}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="date_application" className="block text-sm font-medium text-noir mb-2">
                                Date d'Application <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date_application"
                                id="date_application"
                                value={formData.date_application}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                            {errors.date_application && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_application[0]}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-noir mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                                placeholder="Description détaillée de l'action..."
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                        </div>
                    </div>
                </div>

                {/* Sélection des adhérents */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-noir-fonce mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-users mr-2"></i>Adhérents Concernés{' '}
                        <span className="text-red-500">*</span>
                    </h2>

                    {/* Barre de recherche */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un adhérent..."
                            className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                        />
                    </div>

                    {/* Options de sélection */}
                    <div className="mb-4 flex gap-3">
                        <button
                            type="button"
                            onClick={selectAll}
                            className="px-4 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce rounded-md text-sm transition-colors"
                        >
                            <i className="fas fa-check-double mr-2"></i>Tout sélectionner
                        </button>
                        <button
                            type="button"
                            onClick={deselectAll}
                            className="px-4 py-2 border border-gris text-noir-leger hover:bg-gris-clair rounded-md text-sm transition-colors"
                        >
                            <i className="fas fa-times mr-2"></i>Tout désélectionner
                        </button>
                    </div>

                    {errors.adherents && <p className="text-red-500 text-sm mb-4">{errors.adherents[0]}</p>}

                    {/* Liste des adhérents */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <i className="fas fa-spinner fa-spin text-2xl text-jaune"></i>
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto border border-gris rounded-md">
                            {filteredAdherents.map((adherent) => (
                                <label
                                    key={adherent.id}
                                    className="flex items-center p-3 hover:bg-jaune-clair transition-colors cursor-pointer border-b border-gris last:border-b-0"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAdherents.includes(adherent.id)}
                                        onChange={() => toggleAdherent(adherent.id)}
                                        className="h-4 w-4 text-jaune border-gris rounded focus:ring-jaune"
                                    />
                                    <div className="ml-3 flex items-center flex-1">
                                        {adherent.photo ? (
                                            <img
                                                src={adherent.photo}
                                                alt={adherent.nom_complet}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-jaune rounded-full flex items-center justify-center mr-3">
                                                <span className="text-noir-fonce font-bold text-sm">
                                                    {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-noir-fonce">{adherent.nom_complet}</p>
                                            <p className="text-sm text-noir-leger">
                                                {adherent.matricule} - {adherent.direction}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    <p className="text-sm text-noir-leger mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        <span>{selectedAdherents.length}</span> adhérent(s) sélectionné(s)
                    </p>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gris">
                    <Link
                        to="/actions"
                        className="px-6 py-2 border border-gris text-noir-leger rounded-md hover:bg-gris-clair transition-colors text-center"
                    >
                        <i className="fas fa-times mr-2"></i>Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>Création...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>Créer l'Action
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActionsCreate;
