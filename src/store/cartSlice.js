import { createSlice } from '@reduxjs/toolkit';

const cartLineKey = (productId, selectedOptions = {}) => {
    const sortedOptions = Object.keys(selectedOptions)
        .sort()
        .map((k) => `${k}:${selectedOptions[k]}`)
        .join('|');
    return `${productId}__${sortedOptions}`;
};

const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const match = String(price).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        pincode: null,
    },
    reducers: {
        addToCart: (state, action) => {
            if (!Array.isArray(state.items)) state.items = [];
            const {
                productId,
                name,
                subtitle,
                image,
                price,
                listPrice,
                selectedOptions = {},
                quantity = 1,
            } = action.payload;
            const key = cartLineKey(productId, selectedOptions);
            const existing = state.items.find((i) => i.key === key);
            if (existing) {
                existing.quantity += quantity;
            } else {
                const priceValue = parsePrice(price);
                const listPriceValue = listPrice ? parsePrice(listPrice) : 0;
                state.items.push({
                    key,
                    productId,
                    name,
                    subtitle: subtitle ?? null,
                    image,
                    price,
                    priceValue,
                    listPrice: listPrice ?? null,
                    listPriceValue: listPriceValue > priceValue ? listPriceValue : 0,
                    selectedOptions,
                    quantity,
                });
            }
        },
        updateQuantity: (state, action) => {
            if (!Array.isArray(state.items)) state.items = [];
            const { key, quantity } = action.payload;
            const item = state.items.find((i) => i.key === key);
            if (!item) return;
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.key !== key);
            } else {
                item.quantity = quantity;
            }
        },
        removeFromCart: (state, action) => {
            if (!Array.isArray(state.items)) state.items = [];
            state.items = state.items.filter((i) => i.key !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
        setPincode: (state, action) => {
            state.pincode = action.payload || null;
        },
    },
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setPincode,
} = cartSlice.actions;

export const selectCartCount = (state) =>
    (state.cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0);

export const selectCartSubtotal = (state) =>
    (state.cart?.items ?? []).reduce((sum, i) => sum + i.priceValue * i.quantity, 0);

export const selectCartListTotal = (state) =>
    (state.cart?.items ?? []).reduce(
        (sum, i) => sum + (i.listPriceValue || i.priceValue) * i.quantity,
        0
    );

export const selectCartSavings = (state) => {
    const list = selectCartListTotal(state);
    const sub = selectCartSubtotal(state);
    return Math.max(0, list - sub);
};

export default cartSlice.reducer;
