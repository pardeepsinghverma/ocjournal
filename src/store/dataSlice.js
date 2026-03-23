import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    currentSubDomain: "stylesphere",
    subDomains: ["stylesphere", "fashion"],
  },
  reducers: {
    setData: (state, action) => {
      const { name, data } = action.payload;
      state[name] = data;
    },
  },
});
console.log('Data slice initialized');

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;