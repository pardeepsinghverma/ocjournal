// src/store/slices/pageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const pageSlice = createSlice({
  name: 'page',
  initialState: {
    // Initial state can be empty; properties will be set dynamically
  },
  reducers: {
    setPage: (state, action) => {
        const { name, data, loading, error } = action.payload;
        _.set(state, name, data, error, loading);
    },
  },
});

export const { setPage } = pageSlice.actions;
export default pageSlice.reducer;