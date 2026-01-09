import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  functionType: "",
  eventTitle: "",
  publicNotes: "",
  privateNotes: "",
  internalNotes: "",
  attendees: 0,
  image: null,
  documentType: "",
  uploadDocument: null,
  emailOptions: {
    sendReminder: false,
    sendEventNoticeCustomer: false,
    sendEventNoticeAdmin: false,
    sendEventNoticeCustodian: false,
    sendChangeDeleteNotice: false,
    copyYourself: false,
  },
  footerOptions: {
    showPublic: true,
    showMaster: true,
    appendToExisting: false,
    generateWorkOrder: false,
  },
};

const eventNotesSlice = createSlice({
  name: "eventNotes",
  initialState,
  reducers: {
    updateEventField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateEmailOption: (state, action) => {
      const { field, value } = action.payload;
      state.emailOptions[field] = value;
    },
    updateFooterOption: (state, action) => {
      const { field, value } = action.payload;
      state.footerOptions[field] = value;
    },
    clearEventNotes: () => initialState,
  },
});

export const {
  updateEventField,
  updateEmailOption,
  updateFooterOption,
  clearEventNotes,
} = eventNotesSlice.actions;

export default eventNotesSlice.reducer;
