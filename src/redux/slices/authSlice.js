// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to handle login
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { getState, rejectWithValue }) => {
    try {
      const clientname = getState().client.clientname;
      const apiUrl = `http://192.168.0.65:8500/rest/gvRestApi/master/chkLogin`;
      const response = await axios.post(apiUrl, {
        frmUserID: username,
        frmPassword: password,
        clientname: clientname,
      });
      if (response.data.RESULT === 1) {
        return response.data;
      } else {
        return rejectWithValue("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login API error:", error);
      return rejectWithValue("Server error. Please try again later.");
    }
  }
);

// Check if session data exists and parse it, or default to null
const savedSessionData = localStorage.getItem("sessionData");
const initialSessionData = savedSessionData
  ? JSON.parse(savedSessionData)
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    sessionData: initialSessionData,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.sessionData = null;
      localStorage.removeItem("sessionData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionData = action.payload;
        localStorage.setItem("sessionData", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
