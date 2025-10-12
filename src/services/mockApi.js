// Mock API pour simuler les appels backend
// Utilise localStorage pour persister les données

const STORAGE_KEYS = {
    USERS: 'mutuelle_users',
    ADHERENTS: 'mutuelle_adherents',
    ACTIONS: 'mutuelle_actions',
    COTISATIONS: 'mutuelle_cotisations',
    AVANTAGES: 'mutuelle_avantages',
};

// Données initiales
const initialData = {
    users: [
        {
            id: 1,
            name: 'Admin',
            email: 'admin@mutuelle.com',
            password: 'password'
        }
    ],
    adherents: [
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
            montant_total_cotisations: 150000,
            montant_total_avantages: 50000,
            created_at: new Date('2024-01-15').toISOString()
        }
    ],
    actions: [],
    cotisations: [],
    avantages: []
};

// Initialiser les données si elles n'existent pas
const initializeData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADHERENTS)) {
        localStorage.setItem(STORAGE_KEYS.ADHERENTS, JSON.stringify(initialData.adherents));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIONS)) {
        localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(initialData.actions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COTISATIONS)) {
        localStorage.setItem(STORAGE_KEYS.COTISATIONS, JSON.stringify(initialData.cotisations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AVANTAGES)) {
        localStorage.setItem(STORAGE_KEYS.AVANTAGES, JSON.stringify(initialData.avantages));
    }
};

initializeData();

// Helper pour récupérer les données
const getData = (key) => {
    return JSON.parse(localStorage.getItem(key) || '[]');
};

// Helper pour sauvegarder les données
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const mockApi = {
    // Auth
    login: (email, password) => {
        const users = getData(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password, ...userData } = user;
            return Promise.resolve({
                user: userData,
                token: 'mock-jwt-token-' + Date.now()
            });
        }
        return Promise.reject({ response: { status: 401, data: { message: 'Identifiants incorrects' } } });
    },

    // Dashboard
    getDashboard: () => {
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        const cotisations = getData(STORAGE_KEYS.COTISATIONS);
        const avantages = getData(STORAGE_KEYS.AVANTAGES);

        return Promise.resolve({
            total_adherents: adherents.length,
            adherents_actifs: adherents.filter(a => a.est_actif).length,
            total_cotisations: cotisations.reduce((sum, c) => sum + c.montant, 0),
            total_avantages: avantages.reduce((sum, a) => sum + a.montant, 0),
            cotisations_recentes: cotisations.slice(-5).reverse().map(c => ({
                ...c,
                adherent: adherents.find(a => a.id === c.adherent_id)
            })),
            adherents_recents: adherents.slice(-5).reverse()
        });
    },

    // Adhérents
    getAdherents: (params = {}) => {
        let adherents = getData(STORAGE_KEYS.ADHERENTS);
        
        // Filtres
        if (params.recherche) {
            const search = params.recherche.toLowerCase();
            adherents = adherents.filter(a => 
                a.nom.toLowerCase().includes(search) ||
                a.prenom.toLowerCase().includes(search) ||
                a.matricule.toLowerCase().includes(search) ||
                a.email.toLowerCase().includes(search)
            );
        }
        
        if (params.statut) {
            adherents = adherents.filter(a => 
                params.statut === 'actif' ? a.est_actif : !a.est_actif
            );
        }
        
        if (params.direction) {
            adherents = adherents.filter(a => a.direction === params.direction);
        }
        
        if (params.situation_matrimoniale) {
            adherents = adherents.filter(a => a.situation_matrimoniale === params.situation_matrimoniale);
        }

        const directions = [...new Set(getData(STORAGE_KEYS.ADHERENTS).map(a => a.direction))];

        return Promise.resolve({
            data: adherents,
            total: adherents.length,
            directions
        });
    },

    getAdherent: (id) => {
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        const adherent = adherents.find(a => a.id === parseInt(id));
        
        if (adherent) {
            const cotisations = getData(STORAGE_KEYS.COTISATIONS).filter(c => c.adherent_id === adherent.id);
            const avantages = getData(STORAGE_KEYS.AVANTAGES).filter(a => a.adherent_id === adherent.id);
            const actions = getData(STORAGE_KEYS.ACTIONS).filter(act => act.adherents?.includes(adherent.id));
            
            return Promise.resolve({
                ...adherent,
                cotisations,
                avantages,
                actions
            });
        }
        
        return Promise.reject({ response: { status: 404 } });
    },

    createAdherent: (data) => {
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        const newId = Math.max(...adherents.map(a => a.id), 0) + 1;
        
        const newAdherent = {
            ...data,
            id: newId,
            nom_complet: `${data.prenom} ${data.nom}`,
            est_actif: true,
            montant_total_cotisations: 0,
            montant_total_avantages: 0,
            created_at: new Date().toISOString()
        };
        
        adherents.push(newAdherent);
        saveData(STORAGE_KEYS.ADHERENTS, adherents);
        
        return Promise.resolve(newAdherent);
    },

    updateAdherent: (id, data) => {
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        const index = adherents.findIndex(a => a.id === parseInt(id));
        
        if (index !== -1) {
            adherents[index] = {
                ...adherents[index],
                ...data,
                nom_complet: `${data.prenom} ${data.nom}`
            };
            saveData(STORAGE_KEYS.ADHERENTS, adherents);
            return Promise.resolve(adherents[index]);
        }
        
        return Promise.reject({ response: { status: 404 } });
    },

    deleteAdherent: (id) => {
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        const filtered = adherents.filter(a => a.id !== parseInt(id));
        saveData(STORAGE_KEYS.ADHERENTS, filtered);
        return Promise.resolve({ message: 'Adhérent supprimé' });
    },

    // Actions
    getActions: () => {
        const actions = getData(STORAGE_KEYS.ACTIONS);
        const adherents = getData(STORAGE_KEYS.ADHERENTS);
        
        return Promise.resolve({
            data: actions.map(action => ({
                ...action,
                adherents: adherents.filter(a => action.adherents?.includes(a.id))
            }))
        });
    },

    getAction: (id) => {
        const actions = getData(STORAGE_KEYS.ACTIONS);
        const action = actions.find(a => a.id === parseInt(id));
        
        if (action) {
            const adherents = getData(STORAGE_KEYS.ADHERENTS);
            return Promise.resolve({
                ...action,
                adherents: adherents.filter(a => action.adherents?.includes(a.id))
            });
        }
        
        return Promise.reject({ response: { status: 404 } });
    },

    createAction: (data) => {
        const actions = getData(STORAGE_KEYS.ACTIONS);
        const newId = Math.max(...actions.map(a => a.id), 0) + 1;
        
        const newAction = {
            ...data,
            id: newId,
            created_at: new Date().toISOString()
        };
        
        actions.push(newAction);
        saveData(STORAGE_KEYS.ACTIONS, actions);
        
        return Promise.resolve(newAction);
    },
};

