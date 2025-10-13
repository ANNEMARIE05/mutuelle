import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const ActionsShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAction();
    }, [id]);

    const fetchAction = async () => {
        try {
            const data = await apiAdapter.getAction(id);
            setAction(data);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'action:', error);
            navigate('/actions');
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

    if (!action) {
        return (
            <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-6xl text-gris mb-4"></i>
                <p className="text-noir-leger text-lg">Action non trouvée</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 md:space-y-6">
            {/* Bouton retour */}
            <div className="flex items-center justify-between mb-3 md:mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-3 py-1.5 md:px-4 md:py-2 text-noir-leger hover:text-jaune hover:bg-jaune-clair rounded transition-colors text-xs md:text-sm"
                >
                    <i className="fas fa-arrow-left mr-1 md:mr-2"></i>Retour
                </button>
                <div className="hidden md:block">
                    <div className="flex items-center text-sm text-noir-leger">
                        <Link to="/actions" className="hover:text-jaune">
                            <i className="fas fa-bolt mr-2"></i>Actions
                        </Link>
                        <i className="fas fa-chevron-right mx-2"></i>
                        <span className="text-noir">{action.type_action}</span>
                    </div>
                </div>
            </div>

            {/* Carte principale */}
            <div className="bg-white rounded shadow p-3 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col md:flex-row items-center md:items-start mb-3 lg:mb-0">
                        <div className="bg-jaune p-3 md:p-4 rounded-full mb-2 md:mb-0 md:mr-3">
                            <i className="fas fa-bolt text-xl md:text-2xl text-noir-fonce"></i>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-lg md:text-2xl font-bold text-noir-fonce mb-2">{action.type_action}</h1>
                            <div className="bg-gris-clair p-2 rounded mb-2">
                                <p className="text-xs text-noir-leger mb-1">
                                    <i className="far fa-calendar-alt mr-1 text-jaune"></i>
                                    Date d'application
                                </p>
                                <p className="text-sm font-semibold text-noir-fonce">{formatDate(action.date_application)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center lg:text-right mt-3 lg:mt-0">
                        <div className="bg-jaune p-3 rounded">
                            <p className="text-xs text-noir-leger mb-1">Montant</p>
                            <p className="text-xl md:text-2xl font-bold text-noir-fonce">{formatNumber(action.montant)} FCFA</p>
                        </div>
                        <div className="mt-2 bg-green-50 p-2 rounded">
                            <p className="text-xs text-green-800 font-medium">
                                <i className="fas fa-users mr-1"></i>
                                {action.adherents?.length || 0} adhérent(s) concerné(s)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des adhérents */}
            <div className="bg-white rounded shadow p-3 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-noir-fonce mb-3 md:mb-4">
                    <i className="fas fa-users mr-1 md:mr-2"></i>Adhérents Concernés
                </h2>

                {action.adherents && action.adherents.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {action.adherents.map((adherent) => (
                            <div
                                key={adherent.id}
                                className="border border-gris rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                            >
                                {/* En-tête de la carte */}
                                <div className="flex items-start justify-between mb-2 md:mb-3">
                                    <div className="flex items-center">
                                        {adherent.photo ? (
                                            <img
                                                src={adherent.photo}
                                                alt={adherent.nom_complet}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-2 md:mr-3"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-jaune rounded-full flex items-center justify-center mr-2 md:mr-3">
                                                <span className="text-noir-fonce font-bold text-sm md:text-xl">
                                                    {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-noir-fonce text-sm md:text-base">{adherent.nom_complet}</h3>
                                            <p className="text-xs md:text-sm text-noir-leger">{adherent.matricule}</p>
                                        </div>
                                    </div>
                                    <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">
                                        Appliquée
                                    </span>
                                </div>

                                {/* Informations détaillées */}
                                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm border-t border-gris pt-2 md:pt-3">
                                    <div className="flex items-center">
                                        <i className="fas fa-envelope text-jaune w-4 md:w-5 mr-1.5 md:mr-2 text-xs"></i>
                                        <span className="text-noir-leger truncate">{adherent.email || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-phone text-jaune w-4 md:w-5 mr-1.5 md:mr-2 text-xs"></i>
                                        <span className="text-noir-leger">{adherent.numero_telephone || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-building text-jaune w-4 md:w-5 mr-1.5 md:mr-2 text-xs"></i>
                                        <span className="text-noir-leger truncate">{adherent.direction || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-briefcase text-jaune w-4 md:w-5 mr-1.5 md:mr-2 text-xs"></i>
                                        <span className="text-noir-leger truncate">{adherent.fonction || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-certificate text-jaune w-4 md:w-5 mr-1.5 md:mr-2 text-xs"></i>
                                        <span className="text-noir-leger truncate">{adherent.grade || 'Non renseigné'}</span>
                                    </div>
                                </div>

                                {/* Bouton voir plus */}
                                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gris">
                                    <Link
                                        to={`/adherents/${adherent.id}`}
                                        className="text-jaune hover:text-jaune-fonce text-xs md:text-sm font-medium flex items-center"
                                    >
                                        Voir le profil complet
                                        <i className="fas fa-arrow-right ml-1 md:ml-2"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-6 md:py-8">
                        <i className="fas fa-inbox text-3xl md:text-4xl mb-2"></i>
                        <br />
                        <span className="text-xs md:text-sm">Aucun adhérent concerné</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActionsShow;
