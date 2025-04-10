import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  intervalState: [],
  owner: [],
  selectedScheduler: [],
  selectedCustomer: [],
  selectedContact: [],
  startDate: "",
  endDate: "",
  locationData: [], // Stores location label and selected value
};

const intervalSlice = createSlice({
  name: "interval",
  initialState,
  reducers: {
    setIntervalStateF: (state, action) => {
      state.intervalState = action.payload;
    },
    setOwnerF: (state, action) => {
      state.owner = action.payload;
    },
    setSelectedSchedulerF: (state, action) => {
      state.selectedScheduler = action.payload;
    },
    setSelectedCustomerF: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setSelectedContactF: (state, action) => {
      state.selectedContact = action.payload;
    },
    setStartDateF: (state, action) => {
      state.startDate =
        action.payload instanceof Date
          ? action.payload.toISOString()
          : action.payload;
    },
    setEndDateF: (state, action) => {
      state.endDate =
        action.payload instanceof Date
          ? action.payload.toISOString()
          : action.payload;
    },
    setLocationDataF: (state, action) => {
      state.locationData = action.payload;
    },
    resetIntervalState: () => initialState,
  },
});

export const {
  setIntervalStateF,
  setOwnerF,
  setSelectedSchedulerF,
  setSelectedCustomerF,
  setSelectedContactF,
  setStartDateF,
  setEndDateF,
  setLocationDataF,
  resetIntervalState,
} = intervalSlice.actions;

export default intervalSlice.reducer;
