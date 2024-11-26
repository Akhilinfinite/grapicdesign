// src/store/slices/sampleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDefaultValues = createAsyncThunk(
  "defaults/fetchDefaultValues",
  async () => {
    const response = await axios.post(
      "http://192.168.0.65:8500/rest/gvRestApi/master/getAppVariable/",
      {
        owner_id: "1",
      }
    );
    return response.data.DATA;
  }
);

const defaultsSlice = createSlice({
  name: "defaults",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDefaultValues.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchDefaultValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default defaultsSlice.reducer;
