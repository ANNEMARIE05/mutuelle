import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiAdapter from '../services/apiAdapter';

const Dashboard = () => {
    const { user } = useAuth();
    const [statistiques, setStatistiques] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        fetchStatistiques();
        
        // Afficher la popup de bienvenue
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setTimeout(() => {
                setShowWelcomeModal(true);
                sessionStorage.setItem('hasSeenWelcome', 'true');
            }, 500);
        }
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
        <div className="space-y-3 md:space-y-6">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
                <div>
                    <p className="text-sm md:text-base text-noir-leger">Vue d'ensemble de la mutuelle</p>
                </div>
                <div className="mt-2 md:mt-0">
                    <span className="text-xs md:text-sm text-noir-leger">
                        <i className="far fa-calendar-alt mr-1 md:mr-2"></i>
                        {new Date().toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {/* Total Adhérents */}
                <div className="bg-white rounded shadow p-3 md:p-4 border-l-4 border-jaune hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-noir-leger font-medium">Total Adhérents</p>
                            <p className="text-2xl md:text-3xl font-bold text-noir-fonce mt-1 md:mt-2">
                                {statistiques?.total_adherents || 0}
                            </p>
                        </div>
                        <div className="bg-jaune-clair p-2 md:p-3 rounded-md">
                            <i className="fas fa-users text-xl md:text-2xl text-jaune-fonce"></i>
                        </div>
                    </div>
                </div>

                {/* Adhérents Actifs */}
                <div className="bg-white rounded shadow p-3 md:p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-noir-leger font-medium">Adhérents Actifs</p>
                            <p className="text-2xl md:text-3xl font-bold text-noir-fonce mt-1 md:mt-2">
                                {statistiques?.adherents_actifs || 0}
                            </p>
                        </div>
                        <div className="bg-green-100 p-2 md:p-3 rounded-md">
                            <i className="fas fa-user-check text-xl md:text-2xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                {/* Total Cotisations */}
                <div className="bg-white rounded shadow p-3 md:p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-noir-leger font-medium">Total Cotisations</p>
                            <p className="text-xl md:text-3xl font-bold text-noir-fonce mt-1 md:mt-2">
                                {formatNumber(statistiques?.total_cotisations || 0)} <span className="text-sm md:text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-blue-100 p-2 md:p-3 rounded-md">
                            <i className="fas fa-coins text-xl md:text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                {/* Total Avantages */}
                <div className="bg-white rounded shadow p-3 md:p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-noir-leger font-medium">Total Avantages</p>
                            <p className="text-xl md:text-3xl font-bold text-noir-fonce mt-1 md:mt-2">
                                {formatNumber(statistiques?.total_avantages || 0)} <span className="text-sm md:text-lg">FCFA</span>
                            </p>
                        </div>
                        <div className="bg-purple-100 p-2 md:p-3 rounded-md">
                            <i className="fas fa-gift text-xl md:text-2xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded shadow p-3 md:p-4">
                <h2 className="text-base md:text-lg font-bold text-noir-fonce mb-2 md:mb-3">
                    <i className="fas fa-bolt text-jaune mr-1 md:mr-2"></i>Actions Rapides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                    <Link
                        to="/adherents/creer"
                        className="flex items-center p-2 md:p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-1.5 md:p-2 rounded mr-2 md:mr-3">
                            <i className="fas fa-user-plus text-noir-fonce text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce text-sm md:text-base">Nouvel Adhérent</p>
                            <p className="text-xs md:text-sm text-noir-leger">Enregistrer un adhérent</p>
                        </div>
                    </Link>

                    <Link
                        to="/adherents"
                        className="flex items-center p-2 md:p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-1.5 md:p-2 rounded mr-2 md:mr-3">
                            <i className="fas fa-list text-noir-fonce text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce text-sm md:text-base">Liste Adhérents</p>
                            <p className="text-xs md:text-sm text-noir-leger">Voir tous les adhérents</p>
                        </div>
                    </Link>

                    <Link
                        to="/actions/creer"
                        className="flex items-center p-2 md:p-3 border-2 border-gris rounded hover:border-jaune hover:bg-jaune-clair transition-all"
                    >
                        <div className="bg-jaune p-1.5 md:p-2 rounded mr-2 md:mr-3">
                            <i className="fas fa-plus-circle text-noir-fonce text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p className="font-semibold text-noir-fonce text-sm md:text-base">Nouvelle Action</p>
                            <p className="text-xs md:text-sm text-noir-leger">Créer une action</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Deux colonnes : Cotisations récentes et Adhérents récents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
                {/* Cotisations récentes */}
                <div className="bg-white rounded shadow p-3 md:p-4">
                    <h2 className="text-base md:text-lg font-bold text-noir-fonce mb-2 md:mb-3">
                        <i className="fas fa-clock text-jaune mr-1 md:mr-2"></i>Cotisations Récentes
                    </h2>
                    <div className="space-y-1.5 md:space-y-2">
                        {statistiques?.cotisations_recentes?.length > 0 ? (
                            statistiques.cotisations_recentes.map((cotisation) => (
                                <div
                                    key={cotisation.id}
                                    className="flex items-center justify-between p-1.5 md:p-2 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-jaune p-1.5 md:p-2 rounded mr-1.5 md:mr-2">
                                            <i className="fas fa-money-bill-wave text-noir-fonce text-xs md:text-base"></i>
                                        </div>
                                        <div>
                                            <p className="font-medium text-noir-fonce text-xs md:text-sm">
                                                {cotisation.adherent?.nom_complet}
                                            </p>
                                            <p className="text-xs md:text-sm text-noir-leger">{cotisation.periode}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-noir-fonce text-xs md:text-sm">
                                            {formatNumber(cotisation.montant)} <span className="hidden md:inline">FCFA</span>
                                        </p>
                                        <span
                                            className={`text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm ${
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
                            <p className="text-center text-noir-leger py-6 md:py-8">
                                <i className="fas fa-inbox text-3xl md:text-4xl mb-2"></i>
                                <br />
                                <span className="text-xs md:text-sm">Aucune cotisation récente</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Adhérents récents */}
                <div className="bg-white rounded shadow p-3 md:p-4">
                    <h2 className="text-base md:text-lg font-bold text-noir-fonce mb-2 md:mb-3">
                        <i className="fas fa-user-plus text-jaune mr-1 md:mr-2"></i>Adhérents Récents
                    </h2>
                    <div className="space-y-1.5 md:space-y-2">
                        {statistiques?.adherents_recents?.length > 0 ? (
                            statistiques.adherents_recents.map((adherent) => (
                                <Link
                                    key={adherent.id}
                                    to={`/adherents/${adherent.id}`}
                                    className="flex items-center justify-between p-1.5 md:p-2 bg-gris-clair rounded hover:bg-jaune-clair transition-colors"
                                >
                                    <div className="flex items-center">
                                        {adherent.photo ? (
                                            <img
                                                src={adherent.photo}
                                                alt={adherent.nom_complet}
                                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-jaune rounded-full flex items-center justify-center mr-2 md:mr-3">
                                                <span className="text-noir-fonce font-bold text-xs md:text-sm">
                                                    {adherent.prenom?.charAt(0)}
                                                    {adherent.nom?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-noir-fonce text-xs md:text-sm">{adherent.nom_complet}</p>
                                            <p className="text-xs md:text-sm text-noir-leger">{adherent.matricule}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <i className="fas fa-chevron-right text-noir-leger text-xs md:text-sm"></i>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center text-noir-leger py-6 md:py-8">
                                <i className="fas fa-inbox text-3xl md:text-4xl mb-2"></i>
                                <br />
                                <span className="text-xs md:text-sm">Aucun adhérent récent</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup de bienvenue */}
            {showWelcomeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                        {/* En-tête avec dégradé */}
                        <div className="bg-gradient-to-r from-jaune to-jaune-fonce p-4 md:p-6 text-center">
                            <div className="bg-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                                <i className="fas fa-hands-helping text-3xl md:text-4xl text-jaune"></i>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-noir-fonce">
                                Bienvenue {user?.name} ! 🎉
                            </h2>
                        </div>

                        {/* Contenu */}
                        <div className="p-4 md:p-6">
                            <p className="text-noir-leger text-center mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                                Nous sommes ravis de vous revoir ! Vous êtes maintenant connecté à votre espace de gestion de mutuelle.
                            </p>

                            {/* Informations rapides */}
                            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                                <div className="flex items-center p-2 md:p-3 bg-jaune-clair rounded-lg">
                                    <i className="fas fa-users text-jaune-fonce mr-2 md:mr-3 text-lg md:text-xl"></i>
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-noir-fonce">Gestion des adhérents</p>
                                        <p className="text-xs text-noir-leger">Consultez et gérez vos adhérents</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-2 md:p-3 bg-green-50 rounded-lg">
                                    <i className="fas fa-bolt text-green-600 mr-2 md:mr-3 text-lg md:text-xl"></i>
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-noir-fonce">Actions & Événements</p>
                                        <p className="text-xs text-noir-leger">Créez et suivez vos actions</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-2 md:p-3 bg-blue-50 rounded-lg">
                                    <i className="fas fa-chart-line text-blue-600 mr-2 md:mr-3 text-lg md:text-xl"></i>
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-noir-fonce">Statistiques en temps réel</p>
                                        <p className="text-xs text-noir-leger">Suivez vos performances</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton de fermeture */}
                            <button
                                onClick={() => setShowWelcomeModal(false)}
                                className="w-full bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-colors shadow-sm text-sm md:text-base"
                            >
                                Commencer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
