import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Pricing API
export const pricingApi = {
  // Get all sizing prices
  getAllSizingPrices: () => api.get('/pricing/sizing/all'),
  
  // Get sizing price by yarn type
  getSizingPrice: (slug) => api.get(`/pricing/sizing/${slug}`),
  
  // Get all weaving prices
  getAllWeavingPrices: () => api.get('/pricing/weaving/all'),
  
  // Get weaving price by fabric type
  getWeavingPrice: (slug) => api.get(`/pricing/weaving/${slug}`),
  
  // Calculate sizing cost
  calculateSizingCost: (slug, quantity) => 
    api.post('/pricing/calculate/sizing', { slug, quantity }),
  
  // Calculate weaving cost
  calculateWeavingCost: (slug, quantity) => 
    api.post('/pricing/calculate/weaving', { slug, quantity })
};

export default api;
