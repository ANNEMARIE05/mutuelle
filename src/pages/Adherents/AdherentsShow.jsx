import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AdherentsShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [adherent, setAdherent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdherent();
    }, [id]);

    // Fonction simple pour récupérer un adhérent avec fake data
    const fetchAdherent = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const adherents = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            const adherent = adherents.find(a => a.id === parseInt(id));
            
            if (!adherent) {
                navigate('/adherents');
                return;
            }

            // Récupérer les prestations liées à cet adhérent
            const prestations = JSON.parse(localStorage.getItem('fake_prestations') || '[]');
            const adherentPrestations = prestations.filter(p => p.adherents.includes(adherent.id));
            
            // Ajouter des données mock pour cotisations, avantages, etc.
            const adherentWithExtra = {
                ...adherent,
                cotisations: [],
                avantages: [],
                prestations: adherentPrestations
            };

            setAdherent(adherentWithExtra);
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
        <div className="space-y-3 md:space-y-6">
            {/* Bouton retour et breadcrumb */}
            <div className="flex items-center justify-between mb-3 md:mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-noir-leger hover:text-jaune hover:bg-jaune-clair rounded transition-colors text-xs md:text-sm"
                >
                    <i className="fas fa-arrow-left mr-1 md:mr-2"></i>Retour
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
                <div className="bg-gradient-to-r from-noir-fonce to-noir p-3 md:p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start">
                        {adherent.photo ? (
                            <img
                                src={adherent.photo}
                                alt={adherent.nom_complet}
                                className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover border-2 md:border-4 border-jaune"
                            />
                        ) : (
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-jaune rounded-full flex items-center justify-center border-2 md:border-4 border-white">
                                <span className="text-noir-fonce font-bold text-lg md:text-3xl">
                                    {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div className="ml-0 md:ml-6 text-white text-center md:text-left mt-3 md:mt-0">
                            <h2 className="text-lg md:text-2xl font-bold">{adherent.nom_complet}</h2>
                            <p className="text-jaune-clair mt-1 text-sm md:text-base">{adherent.matricule}</p>
                            <div className="mt-2">
                                {adherent.est_actif ? (
                                    <span className="px-2 py-1 md:px-3 text-xs md:text-sm font-semibold rounded-sm bg-green-500 text-white">
                                        <i className="fas fa-check-circle mr-1"></i>Actif
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 md:px-3 text-xs md:text-sm font-semibold rounded-sm bg-red-500 text-white">
                                        <i className="fas fa-times-circle mr-1"></i>Inactif
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="p-3 md:p-6 space-y-4 md:space-y-6">
                    {/* Informations Personnelles */}
                    <div className="bg-white rounded border border-jaune-clair p-4 md:p-6">
                        <div className="flex items-center mb-4 md:mb-6">
                            <div className="bg-jaune p-2 md:p-3 rounded mr-3 md:mr-4">
                                <i className="fas fa-user text-noir-fonce text-sm md:text-lg"></i>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-noir-fonce">
                                Informations Personnelles
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-id-card text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Nom</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.nom}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-signature text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Prénom</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.prenom}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-heart text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Situation Matrimoniale</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.situation_matrimoniale}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="bg-white rounded border border-jaune-clair p-4 md:p-6">
                        <div className="flex items-center mb-4 md:mb-6">
                            <div className="bg-jaune p-2 md:p-3 rounded mr-3 md:mr-4">
                                <i className="fas fa-address-book text-noir-fonce text-sm md:text-lg"></i>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-noir-fonce">
                                Coordonnées
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-envelope text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Email</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7 break-all">{adherent.email}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-phone text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Téléphone</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.numero_telephone}</dd>
                            </div>
                        </div>
                    </div>

                    {/* Informations Professionnelles */}
                    <div className="bg-white rounded border border-jaune-clair p-4 md:p-6">
                        <div className="flex items-center mb-4 md:mb-6">
                            <div className="bg-jaune p-2 md:p-3 rounded mr-3 md:mr-4">
                                <i className="fas fa-briefcase text-noir-fonce text-sm md:text-lg"></i>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-noir-fonce">
                                Informations Professionnelles
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-building text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Direction</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.direction}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-sitemap text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Entité</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.entite}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-award text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Grade</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.grade}</dd>
                            </div>

                            <div className="bg-gris-clair rounded p-3 md:p-4 border border-gris hover:bg-jaune-clair transition-colors sm:col-span-2 lg:col-span-1 xl:col-span-1">
                                <div className="flex items-center mb-2">
                                    <i className="fas fa-user-tie text-jaune mr-2 text-xs md:text-sm"></i>
                                    <dt className="text-xs md:text-sm font-medium text-noir-leger uppercase tracking-wide">Fonction</dt>
                                </div>
                                <dd className="text-sm md:text-base font-semibold text-noir-fonce ml-6 md:ml-7">{adherent.fonction}</dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Cotisations Récentes */}
            <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-noir-fonce">
                        <i className="fas fa-money-bill-wave text-jaune mr-2"></i>Cotisations Récentes
                    </h2>
                </div>

                {adherent.cotisations?.length > 0 ? (
                    <div className="space-y-3">
                        {adherent.cotisations.slice(-5).reverse().map((cotisation) => (
                            <div
                                key={cotisation.id}
                                className="flex items-center justify-between p-4 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-jaune p-3 rounded mr-4">
                                        <i className="fas fa-money-bill-wave text-noir-fonce"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-noir-fonce">{cotisation.periode}</p>
                                        <p className="text-sm text-noir-leger">
                                            {formatDate(cotisation.date_paiement || cotisation.created_at)}
                                        </p>
                                        {cotisation.description && (
                                            <p className="text-xs text-noir-leger mt-1">{cotisation.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-noir-fonce">{formatNumber(cotisation.montant)} FCFA</p>
                                    <span
                                        className={`text-xs px-2 py-1 font-semibold rounded-sm ${
                                            cotisation.statut === 'Payée'
                                                ? 'bg-green-100 text-green-800'
                                                : cotisation.statut === 'En attente'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {cotisation.statut || 'Payée'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <br />
                        Aucune cotisation enregistrée
                    </p>
                )}
            </div>

            {/* Prestations appliquées */}
            <div className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-noir-fonce">
                        <i className="fas fa-bolt text-jaune mr-2"></i>Prestations Appliquées
                    </h2>
                </div>

                {adherent.prestations?.length > 0 ? (
                    <div className="space-y-3">
                        {adherent.prestations.map((prestation) => (
                            <div
                                key={prestation.id}
                                className="flex items-center justify-between p-4 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="bg-jaune p-3 rounded mr-4">
                                        <i className="fas fa-bolt text-noir-fonce"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-noir-fonce">{prestation.type_prestation}</p>
                                        <p className="text-sm text-noir-leger">
                                            {formatDate(prestation.date_application)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-noir-fonce">{formatNumber(prestation.montant)} FCFA</p>
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
                        Aucune prestation appliquée
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdherentsShow;
