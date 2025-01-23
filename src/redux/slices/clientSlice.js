// src/redux/slices/clientSlice.js
import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clientname: null,
  },
  reducers: {
    setClientName: (state, action) => {
      state.clientname = action.payload;
    },
  },
});

export const { setClientName } = clientSlice.actions;
export default clientSlice.reducer;
