// src/store/slices/dataSlice.js
import { createSlice, current } from '@reduxjs/toolkit';
import _ from 'lodash';

const dataSlice = createSlice({
  name: 'data',
    initialState: {
        currentSubDomain: "ladykartel",
        subDomains: [
            "ladykartel",
            "anmol"
        ],
    },
    reducers: {
        setData: (state, action) => {
            const { name, data, loading, error } = action.payload;
            _.set(state, name, data, error, loading);
        },
    },
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;