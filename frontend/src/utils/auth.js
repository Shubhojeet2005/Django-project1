// Utility functions for handling JWT auth tokens and authenticated requests

// Save access and refresh tokens to localStorage
export const saveToken = (tokens) => {
    if (!tokens) return;

    if (tokens.access) {
        localStorage.setItem("access_token", tokens.access);
    }
    if (tokens.refresh) {
        localStorage.setItem("refresh_token", tokens.refresh);
    }
};

// Clear stored tokens
export const clearToken = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Read access token from storage
export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

// Helper to know if user is authenticated on the frontend
export const isAuthenticated = () => !!getAccessToken();

// Authenticated fetch wrapper that automatically adds Authorization header
export const authFetch = async (url, options = {}) => {
    const token = getAccessToken();
    const headers = options.headers ? { ...options.headers } : {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    headers["Content-Type"] = headers["Content-Type"] || "application/json";

    return fetch(url, {
        ...options,
        headers,
    });
};