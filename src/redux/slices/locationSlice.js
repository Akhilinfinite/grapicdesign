import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // =======================
  // Location Type
  // =======================
  selectedLocationType: "indoor", // indoor | outdoor | equip | people

  // =======================
  // Location Data (SAME AS LOCAL STATE)
  // =======================
  locationData: [
    /*
    {
      id,                // label id
      value,             // label name
      options: [],       // dropdown options
      selectedOption,    // selected option
      dropdownSelected,  // UI helper
    }
    */
  ],

  // =======================
  // Location Filters
  // =======================
  locationFilters: {
    levels: [],
    LFCapacity: null,
    LFHandicap: "",
    LFAmenities: [],
  },
  skipLocationInit: false,

  // =======================
  // Backend-Ready Selection
  // =======================
  selectedLocationDetails: {
    locationId: null,
    labelId: null,
  },

  // =======================
  // Search / Criteria Helpers
  // =======================
  searchScope: "0",
  Loctype: "0,0,0,0,0,0,0",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // =======================
    // Location Type
    // =======================
    setSelectedLocationType: (state, action) => {
      state.selectedLocationType = action.payload;
      state.locationData = [];
      state.selectedLocationDetails = { locationId: null, labelId: null };
      state.searchScope = "0";
      state.Loctype = "0,0,0,0,0,0,0";
    },

    // =======================
    // Location Data (Hierarchy)
    // =======================
    setLocationData: (state, action) => {
      state.locationData = action.payload;
    },

    updateLocationOptions: (state, action) => {
      const { labelId, options } = action.payload;
      const label = state.locationData.find((l) => l.id === labelId);
      if (label) {
        label.options = options;
      }
    },

    selectLocationOption: (state, action) => {
      const { labelId, selectedOption } = action.payload;

      state.locationData.forEach((location) => {
        if (location.id === labelId) {
          location.selectedOption = [selectedOption];
        } else if (location.id > labelId) {
          location.selectedOption = [];
          location.options = [];
        }
      });

      // 🔑 backend-ready
      state.selectedLocationDetails = {
        locationId: selectedOption?.id ?? null,
        labelId: labelId,
      };
    },
    setSkipLocationInit: (state, action) => {
      state.skipLocationInit = action.payload;
    },

    // =======================
    // Filters
    // =======================
    setLocationFilters: (state, action) => {
      state.locationFilters = action.payload;
    },

    resetLocationFilters: (state) => {
      state.locationFilters = initialState.locationFilters;
      state.Loctype = "0,0,0,0,0,0,0";
    },

    // =======================
    // Search / Criteria
    // =======================
    setSearchScope: (state, action) => {
      state.searchScope = action.payload;
    },

    setLoctype: (state, action) => {
      state.Loctype = action.payload;
    },

    // =======================
    // Direct Set (Escape Hatch)
    // =======================
    setSelectedLocationDetails: (state, action) => {
      const { locationId, labelId } = action.payload || {};
      state.selectedLocationDetails = {
        locationId: locationId ?? null,
        labelId: labelId ?? null,
      };
    },

    // =======================
    // Reset Entire Slice
    // =======================
    resetLocationState: () => initialState,
  },
});

export const {
  setSelectedLocationType,

  setLocationData,
  updateLocationOptions,
  selectLocationOption,

  setLocationFilters,
  resetLocationFilters,

  setSearchScope,
  setLoctype,

  setSelectedLocationDetails,
  setSkipLocationInit,

  resetLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
