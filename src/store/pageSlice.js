import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
    name: 'page',
    initialState: {},
    reducers: {
        setPage: (state, action) => {
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

export const { setPage } = pageSlice.actions;
export default pageSlice.reducer;
