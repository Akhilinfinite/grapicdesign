import { createSlice } from "@reduxjs/toolkit";

const savedClientName = localStorage.getItem("clientname") || null;
const savedUsername = null;

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clientname: savedClientName,
    username: savedUsername, // new property for selected contact username
  },
  reducers: {
    setClientName: (state, action) => {
      state.clientname = action.payload;
      localStorage.setItem("clientname", action.payload);
    },
    setUsername: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("username", action.payload); // persist username
    },
  },
});

export const { setClientName, setUsername } = clientSlice.actions;
export default clientSlice.reducer;
