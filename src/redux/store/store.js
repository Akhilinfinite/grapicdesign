// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "../slices/sampleSlice";
import authSlice from "../slices/authSlice";
import clientSlice from "../slices/clientSlice";
import ownerSlice from "../slices/ownerSlice";
import intervalSlice from "../slices/intervalSlice";
import eventNotesReducer from "../slices/eventNotesSlice";
import billingItemsSlice from "../slices/billingItemsSlice";
import scheduleReducer from "../slices/scheduleSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    sample: sampleSlice,
    client: clientSlice,
    owner: ownerSlice,
    interval: intervalSlice,
    eventNotes: eventNotesReducer,
    billingItems: billingItemsSlice,
    schedule: scheduleReducer,
  },
});

export default store;
