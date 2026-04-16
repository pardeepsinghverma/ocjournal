import { createSlice } from '@reduxjs/toolkit';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        addresses: [],
        orders: [],
    },
    reducers: {
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
            state.addresses = [];
            state.orders = [];
        },
        placeOrder: (state, action) => {
            if (!Array.isArray(state.orders)) state.orders = [];
            const order = {
                id: genId(),
                createdAt: Date.now(),
                status: 'Placed',
                ...action.payload,
            };
            state.orders.unshift(order);
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
            if (idx !== -1) {
                state.addresses[idx] = { ...state.addresses[idx], ...changes };
            }
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
