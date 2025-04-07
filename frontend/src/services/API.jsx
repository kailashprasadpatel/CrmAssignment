import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Attach the Authorization header to every request if token is present
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// ========== Auth ==========
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);

// ========== Leads ==========
export const getLeads = () => API.get('/leads');
export const createLead = (leadData) => API.post('/leads', leadData);
export const updateLead = (id, leadData) => API.put(`/leads/${id}`, leadData);
export const deleteLead = (id) => API.delete(`/leads/${id}`);
export const updateLeadStatus = (id, statusData) => API.patch(`/leads/${id}/status`, statusData);

// ========== Admin Dashboard ==========
export const getDashboardStats = () => API.get('/dashboard/stats');
export const getConnectedCalls = () => API.get('/dashboard/connected-calls');
