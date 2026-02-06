import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ownerDefaultsApplied: false,
  schedulerLoaded: false,
  customerLoaded: false,
  contactLoaded: false,
  locationLabelsLoaded: false,
  defaultsLoaded: false,
};

const scheduleInitSlice = createSlice({
  name: "scheduleInit",
  initialState,
  reducers: {
    markOwnerDefaultsApplied(state) {
      state.ownerDefaultsApplied = true;
    },
    markSchedulerLoaded(state) {
      state.schedulerLoaded = true;
    },
    markCustomerLoaded(state) {
      state.customerLoaded = true;
    },
    markContactLoaded(state) {
      state.contactLoaded = true;
    },
    markLocationLabelsLoaded(state) {
      state.locationLabelsLoaded = true;
    },
    markLocationLabelsLoaded(state) {
      state.locationLabelsLoaded = true;
    },
    markDefaultsLoaded(state) {
      state.defaultsLoaded = true;
    },
    resetScheduleInit() {
      return initialState;
    },
  },
});

export const {
  markOwnerDefaultsApplied,
  markSchedulerLoaded,
  markCustomerLoaded,
  markContactLoaded,
  markLocationLabelsLoaded,
  resetScheduleInit,
  markDefaultsLoaded,
} = scheduleInitSlice.actions;

export default scheduleInitSlice.reducer;
