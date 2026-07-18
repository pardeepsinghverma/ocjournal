import { createSlice } from '@reduxjs/toolkit';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        addresses: [],
        orders: [],

        // --- Cookie-based auth (active when AUTH_MODE = 'cookie' in authProvider.js) ---
        sessionCookie: null,   // 'PHPSESSID=abc123' — attached as Cookie header on every request
        customerId: null,      // OpenCart customer_id (int)
        customerToken: null,   // 26-char OC token returned on login

        // --- JWT fields (unused now; activate by setting AUTH_MODE = 'jwt' in authProvider.js) ---
        // Backend must return { access_token, refresh_token, expires_in } from mobile/auth.login
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,     // Unix ms timestamp — check against Date.now() before each request
    },
    reducers: {
        /**
         * Called after successful login or register from the real API.
         * Merges whichever credential fields are present in the payload;
         * works for both cookie mode (sessionCookie) and JWT mode (accessToken).
         */
        setSession: (state, action) => {
            const {
                user,
                sessionCookie, customerId, customerToken,
                accessToken, refreshToken, tokenExpiry,
            } = action.payload;
            state.isAuthenticated = true;
            if (user) state.user = { ...(state.user || {}), ...user };
            // cookie fields
            if (sessionCookie != null) state.sessionCookie = sessionCookie;
            if (customerId != null)    state.customerId    = customerId;
            if (customerToken != null) state.customerToken = customerToken;
            // JWT fields
            if (accessToken != null)  state.accessToken  = accessToken;
            if (refreshToken != null) state.refreshToken = refreshToken;
            if (tokenExpiry != null)  state.tokenExpiry  = tokenExpiry;
        },

        /**
         * Refreshes the session cookie string without touching anything else.
         * Called by the apiclient response interceptor whenever Set-Cookie arrives.
         * (Cookie mode only — no-op once AUTH_MODE switches to 'jwt'.)
         */
        setSessionCookie: (state, action) => {
            state.sessionCookie = action.payload;
        },

        /**
         * Full wipe — called on explicit logout OR when the server reports
         * that the session / token has expired (detected by isAuthExpired()).
         */
        clearSession: (state) => {
            state.isAuthenticated = false;
            state.user        = null;
            state.customerId  = null;
            state.customerToken = null;
            state.sessionCookie = null;
            state.accessToken   = null;
            state.refreshToken  = null;
            state.tokenExpiry   = null;
            state.addresses     = [];
            state.orders        = [];
        },

        // --- Legacy actions kept for backward compat with screens not yet migrated ---
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        updateUser: (state, action) => {
            state.user = { ...(state.user || {}), ...action.payload };
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.addresses  = [];
            state.orders     = [];
            state.sessionCookie = null;
            state.customerId    = null;
            state.customerToken = null;
            state.accessToken   = null;
            state.refreshToken  = null;
            state.tokenExpiry   = null;
        },

        // --- Local-only order / address actions (used until checkout is wired to real API) ---
        placeOrder: (state, action) => {
            if (!Array.isArray(state.orders)) state.orders = [];
            state.orders.unshift({
                id: genId(),
                createdAt: Date.now(),
                status: 'Placed',
                ...action.payload,
            });
        },
        addAddress: (state, action) => {
            if (!Array.isArray(state.addresses)) state.addresses = [];
            const address = {
                id: genId(),
                isDefault: state.addresses.length === 0,
                ...action.payload,
            };
            if (address.isDefault) {
                state.addresses.forEach((a) => { a.isDefault = false; });
            }
            state.addresses.push(address);
        },
        updateAddress: (state, action) => {
            if (!Array.isArray(state.addresses)) state.addresses = [];
            const { id, ...changes } = action.payload;
            const idx = state.addresses.findIndex((a) => a.id === id);
            if (idx !== -1) state.addresses[idx] = { ...state.addresses[idx], ...changes };
        },
        deleteAddress: (state, action) => {
            if (!Array.isArray(state.addresses)) state.addresses = [];
            const id = action.payload;
            const removed = state.addresses.find((a) => a.id === id);
            state.addresses = state.addresses.filter((a) => a.id !== id);
            if (removed?.isDefault && state.addresses.length > 0) {
                state.addresses[0].isDefault = true;
            }
        },
        setDefaultAddress: (state, action) => {
            if (!Array.isArray(state.addresses)) state.addresses = [];
            const id = action.payload;
            state.addresses.forEach((a) => { a.isDefault = a.id === id; });
        },
    },
});

export const {
    setSession,
    setSessionCookie,
    clearSession,
    setUser,
    updateUser,
    logout,
    placeOrder,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = authSlice.actions;

export default authSlice.reducer;
