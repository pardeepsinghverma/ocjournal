// itemsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productList: [], // Array to store the list of products
  categories: [], // Array to store product categories
  cart: [], // Array to store items in the shopping cart
  // Other "big" data related to the store
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItem: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setItem } = itemsSlice.actions;
export default itemsSlice.reducer;
