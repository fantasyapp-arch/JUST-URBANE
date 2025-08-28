import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const articlesApi = {
  getAll: (params = {}) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  getFeatured: () => api.get('/articles?featured=true&limit=6'),
  getTrending: () => api.get('/articles?trending=true&limit=8'),
  getByCategory: (category, params = {}) => api.get('/articles', { params: { category, ...params } }),
  getFree: (params = {}) => api.get('/free-articles', { params }),
  getPremium: (params = {}) => api.get('/premium-articles', { params })
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data)
};

export const reviewsApi = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`)
};

export const issuesApi = {
  getAll: () => api.get('/issues')
};

export const destinationsApi = {
  getAll: () => api.get('/destinations')
};

export default api;