// store.js
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import itemsReducer from './itemsSlice';

const store = configureStore({
  reducer: {
    data: dataReducer,
    items: itemsReducer,
    // other existing reducers can go here...
  },
});

export default store;
