// Mock API pour simuler les appels backend
// Utilise localStorage pour persister les données

const STORAGE_KEYS = {
    USERS: 'mutuelle_users',
    OTP: 'mutuelle_otp',
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
    if (!localStorage.getItem(STORAGE_KEYS.OTP)) {
        localStorage.setItem(STORAGE_KEYS.OTP, JSON.stringify([]));
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

// Helper pour simuler un délai (loader de 3 secondes)
const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    // Auth
    login: async (email, password) => {
        await delay(3000); // Délai de 3 secondes
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

    // Forgot password flow (OTP)
    sendOtp: async (email) => {
        await delay(3000);
        const users = getData(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email === email);
        if (!user) {
            return Promise.reject({ response: { status: 404, data: { message: 'Utilisateur introuvable' } } });
        }
        const otpStore = getData(STORAGE_KEYS.OTP);
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        const filtered = otpStore.filter(o => o.email !== email);
        filtered.push({ email, code, expiresAt });
        saveData(STORAGE_KEYS.OTP, filtered);
        // Retourner le code pour debug (dans un vrai backend on enverrait par email)
        return Promise.resolve({ message: 'Code envoyé', code });
    },

    verifyOtp: async (email, code) => {
        await delay(2000);
        const otpStore = getData(STORAGE_KEYS.OTP);
        const entry = otpStore.find(o => o.email === email);
        if (!entry) {
            return Promise.reject({ response: { status: 404, data: { message: 'OTP non trouvé' } } });
        }
        if (Date.now() > entry.expiresAt) {
            return Promise.reject({ response: { status: 410, data: { message: 'OTP expiré' } } });
        }
        if (entry.code !== code) {
            return Promise.reject({ response: { status: 422, data: { message: 'Code OTP invalide' } } });
        }
        return Promise.resolve({ message: 'OTP valide' });
    },

    resetPassword: async (email, code, newPassword) => {
        await delay(3000);
        // Verify again for safety
        await mockApi.verifyOtp(email, code);
        const users = getData(STORAGE_KEYS.USERS);
        const index = users.findIndex(u => u.email === email);
        if (index === -1) {
            return Promise.reject({ response: { status: 404, data: { message: 'Utilisateur introuvable' } } });
        }
        users[index] = { ...users[index], password: newPassword };
        saveData(STORAGE_KEYS.USERS, users);
        // Clear OTP entry
        const otpStore = getData(STORAGE_KEYS.OTP).filter(o => o.email !== email);
        saveData(STORAGE_KEYS.OTP, otpStore);
        return Promise.resolve({ message: 'Mot de passe réinitialisé' });
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

    createAdherent: async (data) => {
        await delay(3000); // Délai de 3 secondes
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

    updateAdherent: async (id, data) => {
        await delay(3000); // Délai de 3 secondes
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

    deleteAdherent: async (id) => {
        await delay(3000); // Délai de 3 secondes
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

    createAction: async (data) => {
        await delay(3000); // Délai de 3 secondes
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

