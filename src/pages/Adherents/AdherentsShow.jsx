import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const AdherentsShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adherent, setAdherent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdherent();
    }, [id]);

    const fetchAdherent = async () => {
        try {
            const data = await apiAdapter.getAdherent(id);
            setAdherent(data);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'adhérent:', error);
            navigate('/adherents');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <i className="fas fa-spinner fa-spin text-4xl text-jaune"></i>
            </div>
        );
    }

    if (!adherent) {
        return (
            <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-6xl text-gris mb-4"></i>
                <p className="text-noir-leger text-lg">Adhérent non trouvé</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                        <span className="text-noir">{adherent.nom_complet}</span>
                    </div>
                </div>
            </div>

            {/* Carte d'informations principales */}
            <div className="bg-white rounded shadow overflow-hidden">
                <div className="bg-gradient-to-r from-noir-fonce to-noir p-6">
                    <div className="flex items-center">
                        {adherent.photo ? (
                            <img
                                src={adherent.photo}
                                alt={adherent.nom_complet}
                                className="w-24 h-24 rounded-full object-cover border-4 border-jaune"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-jaune rounded-full flex items-center justify-center border-4 border-white">
                                <span className="text-noir-fonce font-bold text-3xl">
                                    {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div className="ml-6 text-white">
                            <h2 className="text-2xl font-bold">{adherent.nom_complet}</h2>
                            <p className="text-jaune-clair mt-1">{adherent.matricule}</p>
                            <div className="mt-2">
                                {adherent.est_actif ? (
                                    <span className="px-3 py-1 text-sm font-semibold rounded-sm bg-green-500 text-white">
                                        <i className="fas fa-check-circle mr-1"></i>Actif
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 text-sm font-semibold rounded-sm bg-red-500 text-white">
                                        <i className="fas fa-times-circle mr-1"></i>Inactif
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Informations personnelles */}
                        <div>
                            <h3 className="text-sm font-semibold text-noir-leger mb-3 uppercase">
                                <i className="fas fa-user mr-2 text-jaune"></i>Informations Personnelles
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-xs text-noir-leger">Nom</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.nom}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Prénom</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.prenom}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Situation Matrimoniale</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.situation_matrimoniale}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Coordonnées */}
                        <div>
                            <h3 className="text-sm font-semibold text-noir-leger mb-3 uppercase">
                                <i className="fas fa-address-book mr-2 text-jaune"></i>Coordonnées
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-xs text-noir-leger">Email</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Téléphone</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.numero_telephone}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Informations professionnelles */}
                        <div>
                            <h3 className="text-sm font-semibold text-noir-leger mb-3 uppercase">
                                <i className="fas fa-briefcase mr-2 text-jaune"></i>Informations Professionnelles
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-xs text-noir-leger">Direction</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.direction}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Entité</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.entite}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Grade</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.grade}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-noir-leger">Fonction</dt>
                                    <dd className="text-sm font-medium text-noir-fonce">{adherent.fonction}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques financières */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Total Cotisations</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {formatNumber(adherent.montant_total_cotisations)} <span className="text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-md">
                            <i className="fas fa-coins text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Total Avantages</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {formatNumber(adherent.montant_total_avantages)} <span className="text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-md">
                            <i className="fas fa-gift text-2xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cotisations */}
            <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-noir-fonce">
                        <i className="fas fa-money-bill-wave text-jaune mr-2"></i>Cotisations
                    </h2>
                </div>

                {adherent.cotisations?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gris-clair border-b border-gris">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Période</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Montant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Date de Paiement</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gris">
                                {adherent.cotisations.map((cotisation) => (
                                    <tr key={cotisation.id} className="hover:bg-jaune-clair transition-colors">
                                        <td className="px-4 py-3 text-sm text-noir-fonce">{cotisation.periode}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-noir-fonce">
                                            {formatNumber(cotisation.montant)} FCFA
                                        </td>
                                        <td className="px-4 py-3 text-sm text-noir-leger">
                                            {formatDate(cotisation.date_paiement)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-sm ${
                                                    cotisation.statut === 'Payée'
                                                        ? 'bg-green-100 text-green-800'
                                                        : cotisation.statut === 'En attente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {cotisation.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <br />
                        Aucune cotisation enregistrée
                    </p>
                )}
            </div>

            {/* Avantages */}
            <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-noir-fonce">
                        <i className="fas fa-gift text-jaune mr-2"></i>Avantages
                    </h2>
                </div>

                {adherent.avantages?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gris-clair border-b border-gris">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Montant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Date d'Attribution</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Statut</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-noir-leger uppercase">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gris">
                                {adherent.avantages.map((avantage) => (
                                    <tr key={avantage.id} className="hover:bg-jaune-clair transition-colors">
                                        <td className="px-4 py-3 text-sm text-noir-fonce">{avantage.type_avantage}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-noir-fonce">
                                            {formatNumber(avantage.montant)} FCFA
                                        </td>
                                        <td className="px-4 py-3 text-sm text-noir-leger">
                                            {formatDate(avantage.date_attribution)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-sm ${
                                                    avantage.statut === 'Accordé'
                                                        ? 'bg-green-100 text-green-800'
                                                        : avantage.statut === 'En cours'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {avantage.statut}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-noir-leger">{avantage.description || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <br />
                        Aucun avantage enregistré
                    </p>
                )}
            </div>

            {/* Actions appliquées */}
            <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-noir-fonce">
                        <i className="fas fa-bolt text-jaune mr-2"></i>Actions Appliquées
                    </h2>
                </div>

                {adherent.actions?.length > 0 ? (
                    <div className="space-y-3">
                        {adherent.actions.map((action) => (
                            <div
                                key={action.id}
                                className="flex items-center justify-between p-4 bg-gris-clair rounded-md hover:bg-jaune-clair transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-jaune p-3 rounded-md mr-4">
                                        <i className="fas fa-bolt text-noir-fonce"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-noir-fonce">{action.type_action}</p>
                                        <p className="text-sm text-noir-leger">
                                            {formatDate(action.date_application)}
                                        </p>
                                        {action.description && (
                                            <p className="text-xs text-noir-leger mt-1">{action.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-noir-fonce">{formatNumber(action.montant)} FCFA</p>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">
                                        Appliquée
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <br />
                        Aucune action appliquée
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdherentsShow;
