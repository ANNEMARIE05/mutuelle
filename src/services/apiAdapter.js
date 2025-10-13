// Adaptateur API qui utilise le mock API au lieu de Laravel
import { mockApi } from './mockApi';

// Helper pour simuler un délai de 3 secondes
const delay = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));

export const apiAdapter = {
    // Auth
    async login(email, password, remember) {
        return mockApi.login(email, password);
    },

    async logout() {
        return Promise.resolve();
    },

    // Dashboard
    async getDashboard() {
        return mockApi.getDashboard();
    },

    // Adhérents
    async getAdherents(params) {
        return mockApi.getAdherents(params);
    },

    async getAdherent(id) {
        return mockApi.getAdherent(id);
    },

    async createAdherent(data) {
        return mockApi.createAdherent(data);
    },

    async updateAdherent(id, data) {
        return mockApi.updateAdherent(id, data);
    },

    async deleteAdherent(id) {
        return mockApi.deleteAdherent(id);
    },

    async exportAdherents() {
        await delay(3000); // Délai de 3 secondes
        const { data } = await mockApi.getAdherents();
        
        // Créer CSV
        const headers = ['Matricule', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Direction', 'Entité', 'Grade', 'Fonction', 'Situation Matrimoniale', 'Statut'];
        const rows = data.map(a => [
            a.matricule,
            a.nom,
            a.prenom,
            a.email,
            a.numero_telephone,
            a.direction,
            a.entite,
            a.grade,
            a.fonction,
            a.situation_matrimoniale,
            a.est_actif ? 'Actif' : 'Inactif'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        // Créer et télécharger le fichier
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `adherents_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return Promise.resolve({ data: csvContent });
    },

    // Actions
    async getActions() {
        return mockApi.getActions();
    },

    async getAction(id) {
        return mockApi.getAction(id);
    },

    async createAction(data) {
        return mockApi.createAction(data);
    },

    // Profil
    async updatePassword(data) {
        await delay(3000); // Délai de 3 secondes
        // Simuler la mise à jour du mot de passe
        return Promise.resolve({ message: 'Mot de passe mis à jour avec succès' });
    }
};

export default apiAdapter;

