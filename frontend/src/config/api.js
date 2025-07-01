import axios from 'axios';

// Configuración de la API
const isProduction = import.meta.env.PROD;
export const API_BASE_URL = isProduction 
  ? 'https://abitare-backend.onrender.com/api' 
  : 'http://localhost:5000/api';

console.log(`API Base URL: ${API_BASE_URL}`);

// Configuración de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
  withCredentials: true, // Importante para enviar cookies/tokens
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Configuración global de Axios para manejar CORS
document.axios = api; // Opcional: hacerlo accesible globalmente para depuración

// Interceptor para agregar el token de autenticación a las peticiones
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir a login solo si no estamos ya en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Algo pasó en la configuración de la solicitud que generó un error
      console.error('Error al configurar la solicitud:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
