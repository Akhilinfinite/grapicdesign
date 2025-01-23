// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "../slices/sampleSlice";
import authSlice from "../slices/authSlice";
import clientSlice from "../slices/clientSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    sample: sampleSlice,
    client: clientSlice,
  },
});

export default store;
