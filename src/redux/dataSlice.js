// dataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null, // You can later store user-specific data here
  sessionToken: null, // For storing tokens or session info
  // Add other small pieces of data as needed
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;
