import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    headingDetails: null,
    searchResults: null,

    // ✅ STORE CONFLICT FLAG
    showConflict: false,
    searchPayload: null,

    loading: false,
    error: null,
  },

  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload?.RSSEARCHRESULT || null;
      state.headingDetails = action.payload?.RSHEADINGDETAILS || null;
    },

    setShowConflict: (state, action) => {
      state.showConflict = action.payload; // true / false
    },
    setSearchPayload: (state, action) => {
      state.searchPayload = action.payload;
    },

    clearSearchResults: (state) => {
      state.searchResults = null;
      state.headingDetails = null;
      state.showConflict = false;
      state.searchPayload = null;
      state.error = null;
    },
  },
});

export const {
  setSearchResults,
  setShowConflict,
  setSearchPayload,
  clearSearchResults,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
