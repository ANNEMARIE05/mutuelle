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
        <div className="space-y-6">
            {/* Bouton retour */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center px-4 py-2 text-noir-leger hover:text-jaune hover:bg-jaune-clair rounded transition-colors"
                >
                    <i className="fas fa-arrow-left mr-2"></i>Retour
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
            <div className="bg-white rounded shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start mb-4 lg:mb-0">
                        <div className="bg-jaune p-5 rounded-md mr-4">
                            <i className="fas fa-bolt text-3xl text-noir-fonce"></i>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-noir-fonce">{action.type_action}</h1>
                            <p className="text-sm text-noir-leger mt-2">
                                <i className="far fa-calendar-alt mr-1"></i>
                                Date d'application : {formatDate(action.date_application)}
                            </p>
                            {action.description && (
                                <p className="text-noir-leger mt-3">{action.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-noir-fonce">{formatNumber(action.montant)} FCFA</p>
                        <p className="text-sm text-noir-leger mt-2">
                            <i className="fas fa-users mr-1"></i>
                            {action.adherents?.length || 0} adhérent(s) concerné(s)
                        </p>
                    </div>
                </div>
            </div>

            {/* Liste des adhérents */}
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold text-noir-fonce mb-4">
                    <i className="fas fa-users mr-2"></i>Adhérents Concernés
                </h2>

                {action.adherents && action.adherents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {action.adherents.map((adherent) => (
                            <Link
                                key={adherent.id}
                                to={`/adherents/${adherent.id}`}
                                className="flex items-center p-3 bg-gris-clair rounded-md hover:bg-jaune-clair transition-colors"
                            >
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
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-noir-fonce truncate">{adherent.nom_complet}</p>
                                    <p className="text-xs text-noir-leger truncate">{adherent.matricule}</p>
                                </div>
                                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">
                                    Appliquée
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-noir-leger py-8">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <br />
                        Aucun adhérent concerné
                    </p>
                )}
            </div>
        </div>
    );
};

export default ActionsShow;
