import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiAdapter from '../../services/apiAdapter';

const ActionsList = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActions();
    }, []);

    const fetchActions = async () => {
        try {
            const data = await apiAdapter.getActions();
            setActions(data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des actions:', error);
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

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-noir-fonce mb-2">Liste des Actions</h1>
                    <p className="text-noir-leger">{actions.length} action(s) au total</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        to="/actions/creer"
                        className="px-4 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors inline-block"
                    >
                        <i className="fas fa-plus mr-2"></i>Nouvelle Action
                    </Link>
                </div>
            </div>

            {/* Liste des actions */}
            <div className="space-y-3">
                {actions.length > 0 ? (
                    actions.map((action) => (
                        <div
                            key={action.id}
                            className="bg-white rounded shadow overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    {/* Informations de l'action */}
                                    <div className="flex items-start mb-4 lg:mb-0">
                                        <div className="bg-jaune p-4 rounded-md mr-4">
                                            <i className="fas fa-bolt text-2xl text-noir-fonce"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-noir-fonce">{action.type_action}</h3>
                                            <p className="text-sm text-noir-leger mt-1">
                                                <i className="far fa-calendar-alt mr-1"></i>
                                                Date d'application : {formatDate(action.date_application)}
                                            </p>
                                            {action.description && (
                                                <p className="text-sm text-noir-leger mt-2">{action.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Montant et statistiques */}
                                    <div className="flex flex-col items-end">
                                        <p className="text-2xl font-bold text-noir-fonce">
                                            {formatNumber(action.montant)} FCFA
                                        </p>
                                        <p className="text-sm text-noir-leger mt-1">
                                            <i className="fas fa-users mr-1"></i>
                                            {action.adherents?.length || 0} adhérent(s)
                                        </p>
                                    </div>
                                </div>

                                {/* Liste des adhérents concernés */}
                                {action.adherents && action.adherents.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gris">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-noir-leger uppercase">
                                                <i className="fas fa-users mr-2"></i>Adhérents Concernés
                                            </h4>
                                            <Link
                                                to={`/actions/${action.id}`}
                                                className="text-sm text-jaune-fonce hover:text-jaune"
                                            >
                                                Voir détails <i className="fas fa-chevron-right ml-1"></i>
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {action.adherents.slice(0, 6).map((adherent) => (
                                                <div
                                                    key={adherent.id}
                                                    className="flex items-center p-3 bg-gris-clair rounded-md hover:bg-jaune-clair transition-colors"
                                                >
                                                    {adherent.photo ? (
                                                        <img
                                                            src={adherent.photo}
                                                            alt={adherent.nom_complet}
                                                            className="w-8 h-8 rounded-full object-cover mr-2"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-jaune rounded-full flex items-center justify-center mr-2">
                                                            <span className="text-noir-fonce font-bold text-xs">
                                                                {adherent.prenom?.charAt(0)}{adherent.nom?.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-noir-fonce truncate">
                                                            {adherent.nom_complet}
                                                        </p>
                                                        <p className="text-xs text-noir-leger truncate">
                                                            {adherent.matricule}
                                                        </p>
                                                    </div>
                                                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-sm bg-green-100 text-green-800">
                                                        Appliquée
                                                    </span>
                                                </div>
                                            ))}

                                            {action.adherents.length > 6 && (
                                                <div className="flex items-center justify-center p-3 bg-gris-clair rounded-md">
                                                    <Link
                                                        to={`/actions/${action.id}`}
                                                        className="text-sm text-jaune-fonce hover:text-jaune font-medium"
                                                    >
                                                        +{action.adherents.length - 6} autre(s)
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-md shadow-md p-12 text-center">
                        <i className="fas fa-bolt text-6xl text-gris mb-4"></i>
                        <p className="text-noir-leger text-lg mb-4">Aucune action créée</p>
                        <Link
                            to="/actions/creer"
                            className="inline-block px-6 py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors"
                        >
                            <i className="fas fa-plus mr-2"></i>Créer une action
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionsList;
