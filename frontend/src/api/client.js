import API from '../config/api';

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
