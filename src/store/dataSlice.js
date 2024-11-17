import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        currentSubDomain: "ladykartel",
        subDomains: ["ladykartel", "anmol"],
    },
    reducers: {
        setData: (state, action) => {
            const { name, data, loading, error } = action.payload;
            if (!state[name]) {
                state[name] = {};
            }
            state[name].data = data || null;
            state[name].loading = loading || false;
            state[name].error = error || null;
        },
    },
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;
