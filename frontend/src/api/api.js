const LOCAL_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = 'https://zcoderkeerthi-backend.onrender.com';

const isLocalhost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API = (
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? LOCAL_API_URL : PRODUCTION_API_URL)
).replace(/\/$/, '');

export default API;
