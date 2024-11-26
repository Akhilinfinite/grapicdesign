// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import defaultsReducer from '../slices/sampleSlice';
import authSlice from '../slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    sample: defaultsReducer,
  },
});

export default store;
