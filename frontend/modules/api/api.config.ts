// src/config/api.config.ts
export const API_BASE_URL="http://localhost:5000";

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
    POS: "/pos",
    ADMIN: "/admin",
    ADMIN_OWNERS: "/admin/owners"
    // ...
};