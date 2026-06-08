import { createSlice } from '@reduxjs/toolkit';

export const AVAILABLE_COUPONS = [
    {
        code: 'GETCASH10',
        type: 'percent',
        value: 10,
        maxDiscount: 200,
        minOrder: 499,
        title: 'Get EXTRA 10% Cashback',
        description: 'On all App orders above ₹499. Max ₹200.',
    },
    {
        code: 'FLAT100',
        type: 'flat',
        value: 100,
        minOrder: 999,
        title: 'Flat ₹100 OFF',
        description: 'On orders above ₹999.',
    },
    {
        code: 'WELCOME50',
        type: 'flat',
        value: 50,
        minOrder: 0,
        title: 'Welcome Gift – ₹50 OFF',
        description: 'First order discount.',
    },
];

export const FEATURED_COUPON = AVAILABLE_COUPONS[0];

const couponSlice = createSlice({
    name: 'coupon',
    initialState: {
        applied: null,
        error: null,
    },
    reducers: {
        applyCoupon: (state, action) => {
            state.applied = action.payload;
            state.error = null;
        },
        removeCoupon: (state) => {
            state.applied = null;
            state.error = null;
        },
        setCouponError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { applyCoupon, removeCoupon, setCouponError } = couponSlice.actions;

export const selectAppliedCoupon = (state) => state.coupon?.applied ?? null;

const cartSubtotal = (state) =>
    (state.cart?.items ?? []).reduce((sum, i) => sum + i.priceValue * i.quantity, 0);

export const selectCouponDiscount = (state) => {
    const applied = selectAppliedCoupon(state);
    if (!applied) return 0;
    const subtotal = cartSubtotal(state);
    if (subtotal < (applied.minOrder || 0)) return 0;
    if (applied.type === 'percent') {
        const raw = subtotal * (applied.value / 100);
        const capped = applied.maxDiscount ? Math.min(raw, applied.maxDiscount) : raw;
        return Math.round(capped);
    }
    if (applied.type === 'flat') {
        return Math.min(applied.value, subtotal);
    }
    return 0;
};

export const selectCouponEligible = (coupon) => (state) => {
    if (!coupon) return false;
    return cartSubtotal(state) >= (coupon.minOrder || 0);
};

export default couponSlice.reducer;
