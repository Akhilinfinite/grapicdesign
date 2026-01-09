import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  defaultFee: {
    billingItem: "Default Facility",
    itemType: "Default Facility",
    charge: 45,
    value: 45,
    changeFeeReason: "None",
  },
  list: [], // user-added billing items
};

const billingItemsSlice = createSlice({
  name: "billingItems",
  initialState,
  reducers: {
    addBillingItem: (state, action) => {
      state.list.push(action.payload);
    },
    clearBillingItems: (state) => {
      state.list = [];
    },
  },
});

export const { addBillingItem, clearBillingItems } =
  billingItemsSlice.actions;

export default billingItemsSlice.reducer;
