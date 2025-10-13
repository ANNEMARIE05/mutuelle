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
            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <i className="fas fa-spinner fa-spin text-4xl text-jaune"></i>
                    </div>
                ) : actions.length > 0 ? (
                    <>
                        {/* Vue desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gris-clair border-b border-gris">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Type d'Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Date d'Application</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Adhérents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gris">
                                    {actions.map((action) => (
                                        <tr key={action.id} className="hover:bg-jaune-clair transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-jaune p-2 rounded-md mr-3">
                                                        <i className="fas fa-bolt text-noir-fonce"></i>
                                                    </div>
                                                    <div className="text-sm font-medium text-noir-fonce">{action.type_action}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-noir-leger">
                                                    <i className="far fa-calendar-alt mr-1"></i>
                                                    {formatDate(action.date_application)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-noir-fonce">
                                                    {formatNumber(action.montant)} FCFA
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-blue-100 text-blue-800">
                                                    <i className="fas fa-users mr-1"></i>
                                                    {action.adherents?.length || 0} adhérent(s)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-noir-leger max-w-xs truncate">
                                                    {action.description || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    to={`/actions/${action.id}`}
                                                    className="text-jaune-fonce hover:text-jaune"
                                                    title="Voir détails"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Vue mobile */}
                        <div className="md:hidden divide-y divide-gris">
                            {actions.map((action) => (
                                <div key={action.id} className="p-4 hover:bg-jaune-clair transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="bg-jaune p-3 rounded-md mr-3">
                                                <i className="fas fa-bolt text-noir-fonce"></i>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-noir-fonce">{action.type_action}</p>
                                                <p className="text-xs text-noir-leger">
                                                    <i className="far fa-calendar-alt mr-1"></i>
                                                    {formatDate(action.date_application)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-blue-100 text-blue-800">
                                            <i className="fas fa-users mr-1"></i>
                                            {action.adherents?.length || 0}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-lg font-bold text-noir-fonce">
                                            {formatNumber(action.montant)} FCFA
                                        </p>
                                        {action.description && (
                                            <p className="text-sm text-noir-leger mt-1">{action.description}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/actions/${action.id}`}
                                            className="flex-1 text-center px-3 py-2 bg-jaune text-noir-fonce rounded-md text-sm"
                                        >
                                            <i className="fas fa-eye mr-1"></i>Voir détails
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
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
