import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for auth token if needed later
api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const jobsApi = {
    create: (data) => api.post('/jobs/query', data),
    getStatus: (jobId) => api.get(`/jobs/${jobId}/status`),
    getResults: (jobId) => api.get(`/jobs/${jobId}/results`),
};

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
