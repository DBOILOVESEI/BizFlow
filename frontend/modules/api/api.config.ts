// src/config/api.config.ts
export const API_BASE_URL: string = "http://127.0.0.1:5000";

// Nếu bạn muốn chia nhỏ endpoints:
export const ENDPOINTS = {
    AUTH: '/auth',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    PRODUCTS: '/products',
    SIGNUP: "/signup",
    DASHBOARD: "/dashboard",
    INVENTORY: "/inventory",
    ORDER: "/order",
    // ...
};