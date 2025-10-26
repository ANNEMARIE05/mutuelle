import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Fake data - stockées dans localStorage
const initializeFakeData = () => {
    if (!localStorage.getItem('fake_adherents')) {
        const fakeAdherents = [
            {
                id: 1,
                nom: 'DIOP',
                prenom: 'Amadou',
                nom_complet: 'Amadou DIOP',
                matricule: 'MAT001',
                email: 'amadou.diop@mutuelle.com',
                numero_telephone: '+221 77 123 45 67',
                direction: 'Direction Générale',
                entite: 'Département IT',
                grade: 'Cadre Supérieur',
                fonction: 'Directeur IT',
                situation_matrimoniale: 'Marié(e)',
                est_actif: true,
                photo: null,
                created_at: '2024-01-15'
            },
            {
                id: 2,
                nom: 'NDIAYE',
                prenom: 'Fatou',
                nom_complet: 'Fatou NDIAYE',
                matricule: 'MAT002',
                email: 'fatou.ndiaye@mutuelle.com',
                numero_telephone: '+221 77 234 56 78',
                direction: 'Ressources Humaines',
                entite: 'Service RH',
                grade: 'Cadre',
                fonction: 'Chef de Service',
                situation_matrimoniale: 'Célibataire',
                est_actif: true,
                photo: null,
                created_at: '2024-02-10'
            },
            {
                id: 3,
                nom: 'FALL',
                prenom: 'Moussa',
                nom_complet: 'Moussa FALL',
                matricule: 'MAT003',
                email: 'moussa.fall@mutuelle.com',
                numero_telephone: '+221 77 345 67 89',
                direction: 'Direction Financière',
                entite: 'Comptabilité',
                grade: 'Cadre Moyen',
                fonction: 'Comptable',
                situation_matrimoniale: 'Marié(e)',
                est_actif: true,
                photo: null,
                created_at: '2024-03-05'
            }
        ];
        localStorage.setItem('fake_adherents', JSON.stringify(fakeAdherents));
    }
};

initializeFakeData();

const AdherentsList = () => {
    const [adherents, setAdherents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
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

    // Fonction simple pour récupérer les adhérents
    const fetchAdherents = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const data = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            
            // Appliquer les filtres
            let filtered = [...data];
            
            if (filters.recherche) {
                const search = filters.recherche.toLowerCase();
                filtered = filtered.filter(a => 
                    a.nom.toLowerCase().includes(search) ||
                    a.prenom.toLowerCase().includes(search) ||
                    a.matricule.toLowerCase().includes(search) ||
                    a.email.toLowerCase().includes(search)
                );
            }
            
            if (filters.statut) {
                filtered = filtered.filter(a => 
                    filters.statut === 'actif' ? a.est_actif : !a.est_actif
                );
            }
            
            if (filters.direction) {
                filtered = filtered.filter(a => a.direction === filters.direction);
            }
            
            if (filters.situation_matrimoniale) {
                filtered = filtered.filter(a => a.situation_matrimoniale === filters.situation_matrimoniale);
            }
            
            setAdherents(filtered);
            
            // Extraire les directions uniques
            const allDirections = [...new Set(data.map(a => a.direction))];
            setDirections(allDirections);
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

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Délai de 3 secondes
        await fetchAdherents();
        setSearching(false);
    };

    const handleReset = async () => {
        setResetting(true);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Délai de 3 secondes
        setFilters({
            recherche: '',
            statut: '',
            direction: '',
            situation_matrimoniale: ''
        });
        setTimeout(async () => {
            await fetchAdherents();
            setResetting(false);
        }, 0);
    };

    // Fonction simple pour supprimer un adhérent
    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
            return;
        }

        try {
            setDeletingId(id);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const data = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            const filtered = data.filter(a => a.id !== id);
            localStorage.setItem('fake_adherents', JSON.stringify(filtered));
            
            await fetchAdherents();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Une erreur est survenue lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    };

    // Fonction simple pour exporter les adhérents en CSV
    const handleExport = async () => {
        try {
            setExporting(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const data = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            
            // Créer CSV
            const headers = ['Matricule', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Direction', 'Entité', 'Grade', 'Fonction', 'Situation Matrimoniale', 'Statut'];
            const rows = data.map(a => [
                a.matricule,
                a.nom,
                a.prenom,
                a.email,
                a.numero_telephone,
                a.direction,
                a.entite,
                a.grade,
                a.fonction,
                a.situation_matrimoniale,
                a.est_actif ? 'Actif' : 'Inactif'
            ]);

            const csvContent = [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            // Télécharger le fichier
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `adherents_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-3 md:space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-3 md:mb-6">
                {/* Compteur */}
                <div>
                    <p className="text-sm md:text-base text-noir-leger">
                        {adherents.length} adhérent(s)<span className="hidden md:inline"> au total</span>
                    </p>
                </div>
                
                {/* Boutons */}
                <div className="flex gap-2 md:gap-3">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                    >
                        {exporting ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i><span className="hidden sm:inline">Export...</span><span className="sm:hidden">...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-file-export mr-1 md:mr-2"></i><span className="hidden sm:inline">Exporter CSV</span><span className="sm:hidden">CSV</span>
                            </>
                        )}
                    </button>
                    <Link
                        to="/adherents/creer"
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors text-xs md:text-sm"
                    >
                        <i className="fas fa-plus mr-1 md:mr-2"></i><span className="hidden sm:inline">Nouvel Adhérent</span><span className="sm:hidden">Nouveau</span>
                    </Link>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded shadow p-3 md:p-4">
                <form onSubmit={handleSearch} className="space-y-2 md:space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                        {/* Recherche */}
                        <div className="lg:col-span-2">
                            <label htmlFor="recherche" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                <i className="fas fa-search mr-1 md:mr-2"></i>Recherche
                            </label>
                            <input
                                type="text"
                                name="recherche"
                                id="recherche"
                                value={filters.recherche}
                                onChange={handleFilterChange}
                                placeholder="Nom, prénom, matricule, email..."
                                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            />
                        </div>

                        {/* Filtre par statut */}
                        <div>
                            <label htmlFor="statut" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                <i className="fas fa-filter mr-1 md:mr-2"></i>Statut
                            </label>
                            <select
                                name="statut"
                                id="statut"
                                value={filters.statut}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            >
                                <option value="">Tous</option>
                                <option value="actif">Actifs</option>
                                <option value="inactif">Inactifs</option>
                            </select>
                        </div>

                        {/* Filtre par direction */}
                        <div>
                            <label htmlFor="direction" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                <i className="fas fa-building mr-1 md:mr-2"></i>Direction
                            </label>
                            <select
                                name="direction"
                                id="direction"
                                value={filters.direction}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            >
                                <option value="">Toutes</option>
                                {directions.map((dir, index) => (
                                    <option key={index} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre par situation matrimoniale */}
                        <div>
                            <label htmlFor="situation_matrimoniale" className="block text-xs md:text-sm font-medium text-noir mb-1 md:mb-2">
                                <i className="fas fa-heart mr-1 md:mr-2"></i>Situation
                            </label>
                            <select
                                name="situation_matrimoniale"
                                id="situation_matrimoniale"
                                value={filters.situation_matrimoniale}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gris rounded-md focus:ring-2 focus:ring-jaune focus:border-jaune text-sm"
                            >
                                <option value="">Toutes</option>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié(e)">Marié(e)</option>
                                <option value="Divorcé(e)">Divorcé(e)</option>
                                <option value="Veuf(ve)">Veuf(ve)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2 md:gap-3">
                        <button
                            type="submit"
                            disabled={searching}
                            className="px-4 py-1.5 md:px-6 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                        >
                            {searching ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i>Recherche...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-search mr-1 md:mr-2"></i>Rechercher
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={resetting}
                            className="px-4 py-1.5 md:px-6 md:py-2 border border-gris text-noir-leger hover:bg-gris-clair rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                        >
                            {resetting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1 md:mr-2"></i><span className="hidden sm:inline">Réinitialisation...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-redo mr-1 md:mr-2"></i><span className="hidden sm:inline">Réinitialiser</span><span className="sm:hidden">Reset</span>
                                </>
                            )}
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
                                                    disabled={deletingId === adherent.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === adherent.id ? (
                                                        <i className="fas fa-spinner fa-spin"></i>
                                                    ) : (
                                                        <i className="fas fa-trash"></i>
                                                    )}
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
                                <div key={adherent.id} className="p-2.5 hover:bg-jaune-clair transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center">
                                            {adherent.photo ? (
                                                <img
                                                    src={adherent.photo}
                                                    alt={adherent.nom_complet}
                                                    className="w-10 h-10 rounded-full object-cover mr-2"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-jaune rounded-full flex items-center justify-center mr-2">
                                                    <span className="text-noir-fonce font-bold text-xs">
                                                        {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-noir-fonce text-sm">{adherent.nom_complet}</p>
                                                <p className="text-xs text-noir-leger">{adherent.matricule}</p>
                                            </div>
                                        </div>
                                        {adherent.est_actif ? (
                                            <span className="px-1.5 py-0.5 text-xs font-semibold rounded-sm bg-green-100 text-green-800">Actif</span>
                                        ) : (
                                            <span className="px-1.5 py-0.5 text-xs font-semibold rounded-sm bg-red-100 text-red-800">Inactif</span>
                                        )}
                                    </div>

                                    <div className="text-xs text-noir-leger mb-2 space-y-0.5">
                                        <p><i className="fas fa-envelope mr-1.5 text-jaune text-xs"></i>{adherent.email}</p>
                                        <p><i className="fas fa-building mr-1.5 text-jaune text-xs"></i>{adherent.direction}</p>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Link
                                            to={`/adherents/${adherent.id}`}
                                            className="flex-1 text-center px-2 py-1.5 bg-jaune text-noir-fonce rounded-md text-xs"
                                        >
                                            <i className="fas fa-eye mr-1"></i>Voir
                                        </Link>
                                        <Link
                                            to={`/adherents/${adherent.id}/modifier`}
                                            className="flex-1 text-center px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs"
                                        >
                                            <i className="fas fa-edit mr-1"></i>Modifier
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 md:py-12">
                        <i className="fas fa-users text-4xl md:text-6xl text-gris mb-3 md:mb-4"></i>
                        <p className="text-noir-leger text-sm md:text-lg">Aucun adhérent trouvé</p>
                        <Link
                            to="/adherents/creer"
                            className="inline-block mt-3 md:mt-4 px-4 py-1.5 md:px-6 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors text-xs md:text-sm"
                        >
                            <i className="fas fa-plus mr-1 md:mr-2"></i>Ajouter un adhérent
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdherentsList;
