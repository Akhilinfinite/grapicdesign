import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    headingDetails: null,
    searchResults: null,

    // ✅ STORE CONFLICT FLAG
    showConflict: false,

    loading: false,
    error: null,
  },

  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload?.RSSEARCHRESULT || null;
      state.headingDetails = action.payload?.RSHEADINGDETAILS || null;
    },

    // ✅ NEW REDUCER
    setShowConflict: (state, action) => {
      state.showConflict = action.payload; // true / false
    },

    clearSearchResults: (state) => {
      state.searchResults = null;
      state.headingDetails = null;
      state.showConflict = false;
      state.error = null;
    },
  },
});

export const {
  setSearchResults,
  setShowConflict,
  clearSearchResults,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
