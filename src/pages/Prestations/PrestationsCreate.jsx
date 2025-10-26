import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Fake data pour les prestations
const initializeFakePrestations = () => {
    if (!localStorage.getItem('fake_prestations')) {
        const fakePrestations = [
            {
                id: 1,
                type_prestation: 'Prime de naissance',
                date_application: '2024-01-15',
                montant: 50000,
                adherents: [1, 2, 3],
                description: 'Prime accordée à la naissance d\'un enfant',
                statut: 'active'
            },
            {
                id: 2,
                type_prestation: 'Aide scolaire',
                date_application: '2024-02-01',
                montant: 25000,
                adherents: [1, 2],
                description: 'Aide pour les frais de scolarité des enfants',
                statut: 'active'
            },
            {
                id: 3,
                type_prestation: 'Prime de mariage',
                date_application: '2024-03-10',
                montant: 75000,
                adherents: [2, 3],
                description: 'Prime accordée lors du mariage d\'un adhérent',
                statut: 'active'
            }
        ];
        localStorage.setItem('fake_prestations', JSON.stringify(fakePrestations));
    }
};

initializeFakePrestations();

const PrestationsCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectingAll, setSelectingAll] = useState(false);
    const [deselectingAll, setDeselectingAll] = useState(false);
    const [errors, setErrors] = useState({});
    const [adherents, setAdherents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdherents, setSelectedAdherents] = useState([]);
    const [formData, setFormData] = useState({
        type_prestation: '',
        montant: '',
        date_application: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchAdherents();
    }, []);

    // Fonction simple pour récupérer les adhérents avec fake data
    const fetchAdherents = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const data = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            setAdherents(data);
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

    const selectAll = async () => {
        setSelectingAll(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Délai de 3 secondes
        const filteredIds = filteredAdherents.map((a) => a.id);
        setSelectedAdherents(filteredIds);
        setSelectingAll(false);
    };

    const deselectAll = async () => {
        setDeselectingAll(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Délai de 3 secondes
        setSelectedAdherents([]);
        setDeselectingAll(false);
    };

    // Fonction simple pour créer une prestation avec fake data
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
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation délai
            
            // Récupérer les prestations existantes
            const prestations = JSON.parse(localStorage.getItem('fake_prestations') || '[]');
            
            // Générer un nouvel ID
            const newId = prestations.length > 0 ? Math.max(...prestations.map(p => p.id)) + 1 : 1;
            
            // Créer la nouvelle prestation
            const newPrestation = {
                ...formData,
                id: newId,
                adherents: selectedAdherents, // Stocker seulement les IDs
                created_at: new Date().toISOString().split('T')[0]
            };

            // Ajouter au localStorage
            prestations.push(newPrestation);
            localStorage.setItem('fake_prestations', JSON.stringify(prestations));

            navigate('/prestations');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la création de la prestation');
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
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
            {/* Bouton retour et breadcrumb */}
            <div className="flex items-center justify-between mb-3 md:mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-2 py-1.5 md:px-4 md:py-2 text-noir-leger hover:text-jaune hover:bg-jaune-clair rounded transition-colors text-sm"
                >
                    <i className="fas fa-arrow-left mr-1 md:mr-2"></i>Retour
                </button>
                <div className="hidden md:block">
                    <div className="flex items-center text-sm text-noir-leger">
                        <Link to="/prestations" className="hover:text-jaune">
                            <i className="fas fa-bolt mr-2"></i>Prestations
                        </Link>
                        <i className="fas fa-chevron-right mx-2"></i>
                        <span className="text-noir">Nouvelle prestation</span>
                    </div>
                </div>
            </div>

            {/* En-tête */}
            <div className="mb-3 md:mb-6">
                <h1 className="text-xl md:text-3xl font-bold text-noir-fonce">
                    <i className="fas fa-plus-circle text-jaune mr-1 md:mr-2"></i>Créer une Prestation
                </h1>
                <p className="text-noir-leger mt-1 md:mt-2 text-sm md:text-base">Appliquer une prestation sur un ou plusieurs adhérents</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-3 md:p-5">
                {Object.keys(errors).length > 0 && (
                    <div className="mb-3 md:mb-6 bg-red-50 border border-red-200 text-red-800 px-3 md:px-4 py-2 md:py-3 rounded-md text-sm">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Veuillez corriger les erreurs dans le formulaire.
                    </div>
                )}

                {/* Informations de la prestation */}
                <div className="mb-4 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-noir-fonce mb-3 md:mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-info-circle mr-1 md:mr-2"></i>Informations de la Prestation
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="type_prestation" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                Type de Prestation <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="type_prestation"
                                id="type_prestation"
                                value={formData.type_prestation}
                                onChange={handleChange}
                                required
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm md:text-base"
                            >
                                <option value="">Sélectionner un type de prestation...</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Prime">Prime</option>
                                <option value="Aide exceptionnelle">Aide exceptionnelle</option>
                                <option value="Remboursement">Remboursement</option>
                                <option value="Cotisation">Cotisation</option>
                                <option value="Pénalité">Pénalité</option>
                                <option value="Ajustement">Ajustement</option>
                                <option value="Autre">Autre</option>
                            </select>
                            {errors.type_prestation && <p className="text-red-500 text-xs mt-1">{errors.type_prestation[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="montant" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
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
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm md:text-base"
                            />
                            {errors.montant && <p className="text-red-500 text-xs mt-1">{errors.montant[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="date_application" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                Date d'Application <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date_application"
                                id="date_application"
                                value={formData.date_application}
                                onChange={handleChange}
                                required
                                className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm md:text-base"
                            />
                            {errors.date_application && (
                                <p className="text-red-500 text-xs mt-1">{errors.date_application[0]}</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Sélection des adhérents */}
                <div className="mb-4 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-noir-fonce mb-3 md:mb-4 pb-2 border-b-2 border-jaune">
                        <i className="fas fa-users mr-1 md:mr-2"></i>Adhérents Concernés{' '}
                        <span className="text-red-500">*</span>
                    </h2>

                    {/* Barre de recherche */}
                    <div className="mb-3 md:mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un adhérent..."
                            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm md:text-base"
                        />
                    </div>

                    {/* Options de sélection */}
                    <div className="mb-3 md:mb-4 flex gap-2 md:gap-3">
                        <button
                            type="button"
                            onClick={selectAll}
                            disabled={selectingAll}
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce rounded-md text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {selectingAll ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>Sélection...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-double mr-1 md:mr-2"></i>Tout sélectionner
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={deselectAll}
                            disabled={deselectingAll}
                            className="px-3 md:px-4 py-1.5 md:py-2 border border-gris text-noir-leger hover:bg-gris-clair rounded-md text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deselectingAll ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>Désélection...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-times mr-1 md:mr-2"></i>Tout désélectionner
                                </>
                            )}
                        </button>
                    </div>

                    {errors.adherents && <p className="text-red-500 text-xs md:text-sm mb-3 md:mb-4">{errors.adherents[0]}</p>}

                    {/* Liste des adhérents */}
                    {loading ? (
                        <div className="flex items-center justify-center py-4 md:py-8">
                            <i className="fas fa-spinner fa-spin text-xl md:text-2xl text-jaune"></i>
                        </div>
                    ) : (
                        <div className="max-h-64 md:max-h-96 overflow-y-auto border border-gris rounded-md">
                            {filteredAdherents.map((adherent) => (
                                <label
                                    key={adherent.id}
                                    className="flex items-center p-2 md:p-3 hover:bg-jaune-clair transition-colors cursor-pointer border-b border-gris last:border-b-0"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedAdherents.includes(adherent.id)}
                                        onChange={() => toggleAdherent(adherent.id)}
                                        className="h-3 w-3 md:h-4 md:w-4 text-jaune border-gris rounded focus:ring-jaune"
                                    />
                                    <div className="ml-2 md:ml-3 flex items-center flex-1">
                                        {adherent.photo ? (
                                            <img
                                                src={adherent.photo}
                                                alt={adherent.nom_complet}
                                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-jaune rounded-full flex items-center justify-center mr-2 md:mr-3">
                                                <span className="text-noir-fonce font-bold text-xs md:text-sm">
                                                    {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-noir-fonce text-sm md:text-base">{adherent.nom_complet}</p>
                                            <p className="text-xs md:text-sm text-noir-leger">
                                                {adherent.matricule} - {adherent.direction}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    <p className="text-xs md:text-sm text-noir-leger mt-1 md:mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        <span>{selectedAdherents.length}</span> adhérent(s) sélectionné(s)
                    </p>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-end pt-4 md:pt-6 border-t border-gris">
                    <Link
                        to="/prestations"
                        className="px-4 md:px-6 py-1.5 md:py-2 border border-gris text-noir-leger rounded-md hover:bg-gris-clair transition-colors text-center text-sm md:text-base"
                    >
                        <i className="fas fa-times mr-1 md:mr-2"></i>Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 md:px-6 py-1.5 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>Création...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-1 md:mr-2"></i>Créer la Prestation
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrestationsCreate;
