const DEFAULT_API_URL =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://zcode-fullstack.onrender.com';

const API = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export default API;