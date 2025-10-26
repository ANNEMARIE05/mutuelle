import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Fake data pour les prestations
const initializeFakePrestations = () => {
    if (!localStorage.getItem('fake_prestations')) {
        const fakePrestations = [
            {
                id: 1,
                type_prestation: 'Prime de naissance',
                date_application: '2024-01-15',
                montant: 50000,
                adherents: [1, 2, 3],
                description: 'Prime accordée à la naissance d\'un enfant',
                statut: 'active'
            },
            {
                id: 2,
                type_prestation: 'Aide scolaire',
                date_application: '2024-02-01',
                montant: 25000,
                adherents: [1, 2],
                description: 'Aide pour les frais de scolarité des enfants',
                statut: 'active'
            },
            {
                id: 3,
                type_prestation: 'Prime de mariage',
                date_application: '2024-03-10',
                montant: 75000,
                adherents: [2, 3],
                description: 'Prime accordée lors du mariage d\'un adhérent',
                statut: 'active'
            }
        ];
        localStorage.setItem('fake_prestations', JSON.stringify(fakePrestations));
    }
};

initializeFakePrestations();

const PrestationsList = () => {
    const [prestations, setPrestations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrestations();
    }, []);

    // Fonction simple pour récupérer les prestations avec fake data
    const fetchPrestations = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai
            
            const data = JSON.parse(localStorage.getItem('fake_prestations') || '[]');
            // Récupérer les données complètes des adhérents pour chaque prestation
            const adherents = JSON.parse(localStorage.getItem('fake_adherents') || '[]');
            const prestationsWithAdherents = data.map(prestation => ({
                ...prestation,
                adherents: adherents.filter(a => prestation.adherents.includes(a.id))
            }));
            setPrestations(prestationsWithAdherents);
        } catch (error) {
            console.error('Erreur lors du chargement des prestations:', error);
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
        <div className="space-y-3 md:space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between mb-3 md:mb-6">
                <div>
                    <p className="text-sm md:text-base text-noir-leger">{prestations.length} prestation(s) au total</p>
                </div>
                <div>
                    <Link
                        to="/prestations/creer"
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors inline-block text-xs md:text-sm"
                    >
                        <i className="fas fa-plus mr-1 md:mr-2"></i>Nouvelle Prestation
                    </Link>
                </div>
            </div>

            {/* Liste des prestations */}
            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <i className="fas fa-spinner fa-spin text-4xl text-jaune"></i>
                    </div>
                ) : prestations.length > 0 ? (
                    <>
                        {/* Vue desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gris-clair border-b border-gris">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Type de Prestation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Date d'Application</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Adhérents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-noir-leger uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gris">
                                    {prestations.map((prestation) => (
                                        <tr key={prestation.id} className="hover:bg-jaune-clair transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-jaune p-2 rounded-md mr-3">
                                                        <i className="fas fa-bolt text-noir-fonce"></i>
                                                    </div>
                                                    <div className="text-sm font-medium text-noir-fonce">{prestation.type_prestation}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-noir-leger">
                                                    <i className="far fa-calendar-alt mr-1"></i>
                                                    {formatDate(prestation.date_application)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-noir-fonce">
                                                    {formatNumber(prestation.montant)} FCFA
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-blue-100 text-blue-800">
                                                    <i className="fas fa-users mr-1"></i>
                                                    {prestation.adherents?.length || 0} adhérent(s)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    to={`/prestations/${prestation.id}`}
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
                            {prestations.map((prestation) => (
                                <div key={prestation.id} className="p-2.5 hover:bg-jaune-clair transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="bg-jaune p-2 rounded-md mr-2">
                                                <i className="fas fa-bolt text-noir-fonce text-sm"></i>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-noir-fonce text-sm">{prestation.type_prestation}</p>
                                                <p className="text-xs text-noir-leger">
                                                    <i className="far fa-calendar-alt mr-1"></i>
                                                    {formatDate(prestation.date_application)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-1.5 py-0.5 text-xs font-semibold rounded-sm bg-blue-100 text-blue-800">
                                            <i className="fas fa-users mr-1"></i>
                                            {prestation.adherents?.length || 0}
                                        </span>
                                    </div>

                                    <div className="mb-2">
                                        <p className="text-base font-bold text-noir-fonce">
                                            {formatNumber(prestation.montant)} FCFA
                                        </p>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Link
                                            to={`/prestations/${prestation.id}`}
                                            className="flex-1 text-center px-2 py-1.5 bg-jaune text-noir-fonce rounded-md text-xs"
                                        >
                                            <i className="fas fa-eye mr-1"></i>Voir détails
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 md:py-12">
                        <i className="fas fa-bolt text-4xl md:text-6xl text-gris mb-3 md:mb-4"></i>
                        <p className="text-noir-leger text-sm md:text-lg mb-3 md:mb-4">Aucune prestation créée</p>
                        <Link
                            to="/prestations/creer"
                            className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-jaune hover:bg-jaune-fonce text-noir-fonce font-semibold rounded-md transition-colors text-xs md:text-sm"
                        >
                            <i className="fas fa-plus mr-1 md:mr-2"></i>Créer une prestation
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrestationsList;
