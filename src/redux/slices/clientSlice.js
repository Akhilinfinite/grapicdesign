// src/redux/slices/clientSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedClientName = localStorage.getItem("clientname") || null;

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clientname: savedClientName,
  },
  reducers: {
    setClientName: (state, action) => {
      state.clientname = action.payload;
      localStorage.setItem("clientname", action.payload); // Persist client name
    },
  },
});

export const { setClientName } = clientSlice.actions;
export default clientSlice.reducer;
