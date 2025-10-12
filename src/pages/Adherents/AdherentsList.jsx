import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const AdherentsList = () => {
    const [adherents, setAdherents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [directions, setDirections] = useState([]);
    const [filters, setFilters] = useState({
        recherche: '',
        statut: '',
        direction: '',
        situation_matrimoniale: ''
    });

    useEffect(() => {
        fetchAdherents();
    }, []);

    const fetchAdherents = async () => {
        try {
            setLoading(true);
            const data = await apiAdapter.getAdherents(filters);
            setAdherents(data.data || []);
            setDirections(data.directions || []);
        } catch (error) {
            console.error('Erreur lors du chargement des adhérents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAdherents();
    };

    const handleReset = () => {
        setFilters({
            recherche: '',
            statut: '',
            direction: '',
            situation_matrimoniale: ''
        });
        setTimeout(() => fetchAdherents(), 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
            return;
        }

        try {
            await apiAdapter.deleteAdherent(id);
            fetchAdherents();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    };

    const handleExport = async () => {
        try {
            await apiAdapter.exportAdherents();
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-noir-fonce mb-2">Liste des Adhérents</h1>
                    <p className="text-noir-leger">{adherents.length} adhérent(s) au total</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                        <i className="fas fa-file-export mr-2"></i>Exporter CSV
                    </button>
                    <Link
                        to="/adherents/creer"
                        className="px-4 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i>Nouvel Adhérent
                    </Link>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded shadow p-4">
                <form onSubmit={handleSearch} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Recherche */}
                        <div className="lg:col-span-2">
                            <label htmlFor="recherche" className="block text-sm font-medium text-noir mb-2">
                                <i className="fas fa-search mr-2"></i>Recherche
                            </label>
                            <input
                                type="text"
                                name="recherche"
                                id="recherche"
                                value={filters.recherche}
                                onChange={handleFilterChange}
                                placeholder="Nom, prénom, matricule, email..."
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            />
                        </div>

                        {/* Filtre par statut */}
                        <div>
                            <label htmlFor="statut" className="block text-sm font-medium text-noir mb-2">
                                <i className="fas fa-filter mr-2"></i>Statut
                            </label>
                            <select
                                name="statut"
                                id="statut"
                                value={filters.statut}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            >
                                <option value="">Tous</option>
                                <option value="actif">Actifs</option>
                                <option value="inactif">Inactifs</option>
                            </select>
                        </div>

                        {/* Filtre par direction */}
                        <div>
                            <label htmlFor="direction" className="block text-sm font-medium text-noir mb-2">
                                <i className="fas fa-building mr-2"></i>Direction
                            </label>
                            <select
                                name="direction"
                                id="direction"
                                value={filters.direction}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            >
                                <option value="">Toutes</option>
                                {directions.map((dir, index) => (
                                    <option key={index} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre par situation matrimoniale */}
                        <div>
                            <label htmlFor="situation_matrimoniale" className="block text-sm font-medium text-noir mb-2">
                                <i className="fas fa-heart mr-2"></i>Situation
                            </label>
                            <select
                                name="situation_matrimoniale"
                                id="situation_matrimoniale"
                                value={filters.situation_matrimoniale}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune"
                            >
                                <option value="">Toutes</option>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié(e)">Marié(e)</option>
                                <option value="Divorcé(e)">Divorcé(e)</option>
                                <option value="Veuf(ve)">Veuf(ve)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors"
                        >
                            <i className="fas fa-search mr-2"></i>Rechercher
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-2 border border-gris text-noir-leger hover:bg-gris-clair rounded-md transition-colors"
                        >
                            <i className="fas fa-redo mr-2"></i>Réinitialiser
                        </button>
                    </div>
                </form>
            </div>

            {/* Liste des adhérents */}
            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <i className="fas fa-spinner fa-spin text-4xl text-jaune"></i>
                    </div>
                ) : adherents.length > 0 ? (
                    <>
                        {/* Vue desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gris-clair border-b border-gris">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Photo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Nom Complet</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Matricule</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Direction</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gris">
                                    {adherents.map((adherent) => (
                                        <tr key={adherent.id} className="hover:bg-jaune-clair transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {adherent.photo ? (
                                                    <img
                                                        src={adherent.photo}
                                                        alt={adherent.nom_complet}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-jaune rounded-full flex items-center justify-center">
                                                        <span className="text-noir-fonce font-bold text-sm">
                                                            {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-noir-fonce">{adherent.nom_complet}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-noir-leger">{adherent.matricule}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-noir-leger">{adherent.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-noir-leger">{adherent.direction}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {adherent.est_actif ? (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">
                                                        <i className="fas fa-check-circle mr-1"></i>Actif
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-red-100 text-red-800">
                                                        <i className="fas fa-times-circle mr-1"></i>Inactif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    to={`/adherents/${adherent.id}`}
                                                    className="text-jaune-fonce hover:text-jaune mr-3"
                                                    title="Voir"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                                <Link
                                                    to={`/adherents/${adherent.id}/modifier`}
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                    title="Modifier"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(adherent.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Supprimer"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Vue mobile */}
                        <div className="md:hidden divide-y divide-gris">
                            {adherents.map((adherent) => (
                                <div key={adherent.id} className="p-4 hover:bg-jaune-clair transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            {adherent.photo ? (
                                                <img
                                                    src={adherent.photo}
                                                    alt={adherent.nom_complet}
                                                    className="w-12 h-12 rounded-full object-cover mr-3"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-jaune rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-noir-fonce font-bold">
                                                        {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-noir-fonce">{adherent.nom_complet}</p>
                                                <p className="text-sm text-noir-leger">{adherent.matricule}</p>
                                            </div>
                                        </div>
                                        {adherent.est_actif ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">Actif</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-red-100 text-red-800">Inactif</span>
                                        )}
                                    </div>

                                    <div className="text-sm text-noir-leger mb-3 space-y-1">
                                        <p><i className="fas fa-envelope mr-2 text-jaune"></i>{adherent.email}</p>
                                        <p><i className="fas fa-building mr-2 text-jaune"></i>{adherent.direction}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/adherents/${adherent.id}`}
                                            className="flex-1 text-center px-3 py-2 bg-jaune text-noir-fonce rounded-md text-sm"
                                        >
                                            <i className="fas fa-eye mr-1"></i>Voir
                                        </Link>
                                        <Link
                                            to={`/adherents/${adherent.id}/modifier`}
                                            className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                                        >
                                            <i className="fas fa-edit mr-1"></i>Modifier
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-users text-6xl text-gris mb-4"></i>
                        <p className="text-noir-leger text-lg">Aucun adhérent trouvé</p>
                        <Link
                            to="/adherents/creer"
                            className="inline-block mt-4 px-6 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors"
                        >
                            <i className="fas fa-plus mr-2"></i>Ajouter un adhérent
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdherentsList;
