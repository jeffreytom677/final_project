import axios from 'axios';

// Base URL configured from frontend/.env: VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor to simplify data unwrapping or error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(errorMsg));
  }
);

export const recipeService = {
  // GET all recipes with optional query filters (search, category)
  getAll: (params = {}) => api.get('/recipes', { params }),

  // GET recipe by ID
  getById: (id) => api.get(`/recipes/${id}`),

  // POST create recipe
  create: (data) => api.post('/recipes', data),

  // PUT update recipe
  update: (id, data) => api.put(`/recipes/${id}`, data),

  // DELETE recipe
  delete: (id) => api.delete(`/recipes/${id}`)
};

export default api;
