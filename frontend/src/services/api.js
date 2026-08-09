const API_BASE = 'https://atc-geca.onrender.com/api';

export const api = {
    // Dashboard Stats
    getStats: async () => {
        const response = await fetch(`${API_BASE}/dashboard-stats/`);
        return response.json();
    },

    // Get all inquiries
    getInquiries: async () => {
        const response = await fetch(`${API_BASE}/inquiries/`);
        return response.json();
    },

    // Get all menu submissions
    getMenuSubmissions: async () => {
        const response = await fetch(`${API_BASE}/menu-submissions/`);
        return response.json();
    },

    // Update inquiry status
    updateInquiryStatus: async (id, status) => {
        const response = await fetch(`${API_BASE}/inquiries/${id}/update-status/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        return response.json();
    },
};