// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "../slices/sampleSlice";
import authSlice from "../slices/authSlice";
import clientSlice from "../slices/clientSlice";
import ownerSlice from "../slices/ownerSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    sample: sampleSlice,
    client: clientSlice,
    owner: ownerSlice,
  },
});

export default store;
