const DEFAULT_API_URL =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://zcode-fullstack.onrender.com';

const API = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');


export const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(`${API}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...options.headers,
        },
    });
};