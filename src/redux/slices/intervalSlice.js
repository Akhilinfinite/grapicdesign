import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // =======================
  // Interval (DO NOT TOUCH)
  // =======================
  generatedDates: [], // generated dates (array of { start, end })
  intervalConfig: null, // weekly / monthly / random config object

  // =======================
  // People (NO OWNER HERE)
  // =======================
  schedulerOptions: [],
  selectedScheduler: [],

  customerOptions: [],
  selectedCustomer: [],

  contactOptions: [],
  selectedContact: [],

  // =======================
  // Date & Time
  // =======================
  startDate: "", // ISO string
  endDate: "", // ISO string
};

const intervalSlice = createSlice({
  name: "interval",
  initialState,
  reducers: {
    // =======================
    // Interval
    // =======================
    setGeneratedDatesF: (state, action) => {
  state.generatedDates = action.payload;
},

    setIntervalConfigF: (state, action) => {
      state.intervalConfig = action.payload;
    },

    // =======================
    // Scheduler
    // =======================
    setSchedulerOptionsF: (state, action) => {
      state.schedulerOptions = action.payload;
    },

    setSelectedSchedulerF: (state, action) => {
      state.selectedScheduler = action.payload;
    },

    // =======================
    // Customer
    // =======================
    setCustomerOptionsF: (state, action) => {
      state.customerOptions = action.payload;
    },

    setSelectedCustomerF: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    // =======================
    // Contact
    // =======================
    setContactOptionsF: (state, action) => {
      state.contactOptions = action.payload;
    },

    setSelectedContactF: (state, action) => {
      state.selectedContact = action.payload;
    },

    // =======================
    // Date & Time
    // =======================
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

    // =======================
    // Reset
    // =======================
    resetIntervalState: () => initialState,
  },
});

export const {
  setGeneratedDatesF,
  setIntervalConfigF,

  setSchedulerOptionsF,
  setSelectedSchedulerF,

  setCustomerOptionsF,
  setSelectedCustomerF,

  setContactOptionsF,
  setSelectedContactF,

  setStartDateF,
  setEndDateF,
  resetIntervalState,
} = intervalSlice.actions;

export default intervalSlice.reducer;
