import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { email: string; first_name: string; last_name: string; password: string; confirm_password: string }) =>
    api.post('/auth/register/', data),
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: Partial<{ first_name: string; last_name: string; phone: string }>) =>
    api.patch('/auth/profile/', data),
  logout: (refresh: string) => api.post('/auth/logout/', { refresh }),
};

// ── Products ─────────────────────────────────────────────────────────
export const productsAPI = {
  list: (params?: Record<string, string | number | boolean>) =>
    api.get('/products/', { params }),
  detail: (id: string | number) => api.get(`/products/${id}/`),
  categories: () => api.get('/products/categories/'),
};

// ── Cart ─────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart/'),
  add: (product_id: number, quantity = 1) =>
    api.post('/cart/add/', { product_id, quantity }),
  update: (item_id: number, quantity: number) =>
    api.put(`/cart/items/${item_id}/`, { quantity }),
  remove: (item_id: number) => api.delete(`/cart/items/${item_id}/remove/`),
  clear: () => api.delete('/cart/clear/'),
};

// ── Orders ───────────────────────────────────────────────────────────
export const ordersAPI = {
  create: (data: {
    full_name: string; email: string; phone: string;
    address: string; city: string; state: string;
    zip_code: string; country: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post('/orders/create/', data),
  checkout: (data: {
    full_name: string; email: string; phone: string;
    address: string; city: string; state: string;
    zip_code: string; country: string;
    items: { product_id: number; quantity: number }[];
    coupon_code?: string;
  }) => api.post('/orders/checkout/', data),
  list: () => api.get('/orders/'),
  detail: (id: number) => api.get(`/orders/${id}/`),
};

// ── Coupons ──────────────────────────────────────────────────────────
export const couponsAPI = {
  apply: (code: string, cart_total: number) =>
    api.post('/coupons/apply/', { code, cart_total }),
};

// ── Contact ──────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact/', data),
};

// ── Addresses ────────────────────────────────────────────────────────
export interface AddressPayload {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  is_default?: boolean;
}

export const addressesAPI = {
  list: () => api.get('/orders/addresses/'),
  create: (data: AddressPayload) => api.post('/orders/addresses/', data),
  update: (id: number, data: Partial<AddressPayload>) =>
    api.patch(`/orders/addresses/${id}/`, data),
  remove: (id: number) => api.delete(`/orders/addresses/${id}/`),
};

// ── Reviews ──────────────────────────────────────────────────────────
export const reviewsAPI = {
  list: (productId: number | string) =>
    api.get(`/products/${productId}/reviews/`),
  create: (productId: number | string, data: { rating: number; comment?: string }) =>
    api.post(`/products/${productId}/reviews/`, data),
  rating: (productId: number | string) =>
    api.get(`/products/${productId}/rating/`),
};

// ── Wishlist ─────────────────────────────────────────────────────────
export const wishlistAPI = {
  list: () => api.get('/wishlist/'),
  toggle: (productId: number | string) =>
    api.post(`/wishlist/toggle/${productId}/`),
  clear: () => api.delete('/wishlist/clear/'),
};
