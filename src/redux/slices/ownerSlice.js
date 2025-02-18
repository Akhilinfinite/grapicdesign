import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch owner data dynamically
export const fetchOwnerData = createAsyncThunk(
  "owner/fetchOwnerData",
  async (_, { getState }) => {
    const clientname = getState().client.clientname;
    if (!clientname) throw new Error("Client name is missing");

    const response = await axios.post(
      "http://192.168.0.65:8500/rest/gvRestApi/schedule/getOwners/",
      { clientname: clientname }
    );

    const columns = response.data.COLUMNS;
    const data = response.data.DATA.map((e) => ({
      id: e[columns.indexOf("OWNER_ID")],
      value: e[columns.indexOf("OWNER_ID")],
      label: e[columns.indexOf("CUSTOMER")],
      end: e[columns.indexOf("DEF_ENDTIME")],
      start: e[columns.indexOf("DEF_STARTTIME")],
      EVENTSLOTTIME: e[columns.indexOf("EVENTSLOTTIME")],
    }));

    return data;
  }
);

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    ownerID: null,
    owner: [],
    loading: false,
    error: null,
  },
  reducers: {
    setownerID: (state, action) => {
      state.ownerID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerData.fulfilled, (state, action) => {
        state.owner = action.payload;
        state.ownerID = action.payload.length > 0 ? action.payload[0].id : null;
        state.loading = false;
      })
      .addCase(fetchOwnerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setownerID } = ownerSlice.actions;
export default ownerSlice.reducer;
