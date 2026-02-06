import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { hydrateEventNotesFromDefaults } from "./eventNotesSlice";

const normalizeDefault = (value) => {
  if (value == null) return false;
  const v = String(value).toLowerCase();
  return v === "1" || v === "on" || v === "yes" || v === "true";
};

export const fetchDefaultValues = createAsyncThunk(
  "defaults/fetchDefaultValues",
  async (_, { getState, dispatch }) => {
    const clientname = getState().client.clientname;
    const ownerID = getState().owner.ownerID;

    if (!clientname || ownerID === null) {
      throw new Error("Client name or owner ID is missing");
    }

    const response = await axios.post(
      "http://192.168.0.65:8500/rest/gvRestApi/master/getAppVariable/",
      { clientname: clientname, owner_id: String(ownerID) }
    );

    const rows = response.data.DATA;

    // 🔑 Normalize + hydrate eventNotes immediately
    const map = {};
    rows.forEach((row) => {
      map[row[3]] = normalizeDefault(row[4]);
    });

    dispatch(hydrateEventNotesFromDefaults(map));

    return rows;
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
