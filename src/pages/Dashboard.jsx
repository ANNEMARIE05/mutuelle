import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiAdapter from '../services/apiAdapter';

const Dashboard = () => {
    const [statistiques, setStatistiques] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistiques();
    }, []);

    const fetchStatistiques = async () => {
        try {
            const data = await apiAdapter.getDashboard();
            setStatistiques(data);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
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
                    <h1 className="text-2xl font-bold text-noir-fonce mb-2">Dashboard</h1>
                    <p className="text-noir-leger">Vue d'ensemble de la mutuelle</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <span className="text-sm text-noir-leger">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {new Date().toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Adhérents */}
                <div className="bg-white rounded shadow p-4 border-l-4 border-jaune hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Total Adhérents</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {statistiques?.total_adherents || 0}
                            </p>
                        </div>
                        <div className="bg-jaune-clair p-3 rounded-md">
                            <i className="fas fa-users text-2xl text-jaune-fonce"></i>
                        </div>
                    </div>
                </div>

                {/* Adhérents Actifs */}
                <div className="bg-white rounded shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Adhérents Actifs</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {statistiques?.adherents_actifs || 0}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-md">
                            <i className="fas fa-user-check text-2xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                {/* Total Cotisations */}
                <div className="bg-white rounded shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Total Cotisations</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {formatNumber(statistiques?.total_cotisations || 0)} <span className="text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-md">
                            <i className="fas fa-coins text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                {/* Total Avantages */}
                <div className="bg-white rounded shadow p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-noir-leger font-medium">Total Avantages</p>
                            <p className="text-3xl font-bold text-noir-fonce mt-2">
                                {formatNumber(statistiques?.total_avantages || 0)} <span className="text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-md">
                            <i className="fas fa-gift text-2xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-bold text-noir-fonce mb-3">
                    <i className="fas fa-bolt text-jaune mr-2"></i>Actions Rapides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Link
                        to="/adherents/creer"
                        className="flex items-center p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-2 rounded mr-3">
                            <i className="fas fa-user-plus text-noir-fonce"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce">Nouvel Adhérent</p>
                            <p className="text-sm text-noir-leger">Enregistrer un adhérent</p>
                        </div>
                    </Link>

                    <Link
                        to="/adherents"
                        className="flex items-center p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-2 rounded mr-3">
                            <i className="fas fa-list text-noir-fonce"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce">Liste Adhérents</p>
                            <p className="text-sm text-noir-leger">Voir tous les adhérents</p>
                        </div>
                    </Link>

                    <Link
                        to="/actions/creer"
                        className="flex items-center p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-2 rounded mr-3">
                            <i className="fas fa-plus-circle text-noir-fonce"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce">Nouvelle Action</p>
                            <p className="text-sm text-noir-leger">Créer une action</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Deux colonnes : Cotisations récentes et Adhérents récents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Cotisations récentes */}
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-bold text-noir-fonce mb-3">
                        <i className="fas fa-clock text-jaune mr-2"></i>Cotisations Récentes
                    </h2>
                    <div className="space-y-2">
                        {statistiques?.cotisations_recentes?.length > 0 ? (
                            statistiques.cotisations_recentes.map((cotisation) => (
                                <div
                                    key={cotisation.id}
                                    className="flex items-center justify-between p-2 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-jaune p-2 rounded mr-2">
                                            <i className="fas fa-money-bill-wave text-noir-fonce"></i>
                                        </div>
                                        <div>
                                            <p className="font-medium text-noir-fonce">
                                                {cotisation.adherent?.nom_complet}
                                            </p>
                                            <p className="text-sm text-noir-leger">{cotisation.periode}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-noir-fonce">
                                            {formatNumber(cotisation.montant)} FCFA
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-sm ${
                                                cotisation.statut === 'Payée'
                                                    ? 'bg-green-100 text-green-800'
                                                    : cotisation.statut === 'En attente'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {cotisation.statut}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-noir-leger py-8">
                                <i className="fas fa-inbox text-4xl mb-2"></i>
                                <br />
                                Aucune cotisation récente
                            </p>
                        )}
                    </div>
                </div>

                {/* Adhérents récents */}
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-lg font-bold text-noir-fonce mb-3">
                        <i className="fas fa-user-plus text-jaune mr-2"></i>Adhérents Récents
                    </h2>
                    <div className="space-y-2">
                        {statistiques?.adherents_recents?.length > 0 ? (
                            statistiques.adherents_recents.map((adherent) => (
                                <Link
                                    key={adherent.id}
                                    to={`/adherents/${adherent.id}`}
                                    className="flex items-center justify-between p-2 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                                >
                                    <div className="flex items-center">
                                        {adherent.photo ? (
                                            <img
                                                src={adherent.photo}
                                                alt={adherent.nom_complet}
                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-jaune rounded-full flex items-center justify-center mr-3">
                                                <span className="text-noir-fonce font-bold">
                                                    {adherent.prenom?.charAt(0)}
                                                    {adherent.nom?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-noir-fonce">{adherent.nom_complet}</p>
                                            <p className="text-sm text-noir-leger">{adherent.matricule}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <i className="fas fa-chevron-right text-noir-leger"></i>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-noir-leger py-8">
                                <i className="fas fa-inbox text-4xl mb-2"></i>
                                <br />
                                Aucun adhérent récent
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
