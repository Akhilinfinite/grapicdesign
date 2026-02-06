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
    sendEmail: false,
  },

  footerOptions: {
    showPublic: true,
    showMaster: true,
    appendToExisting: false,
    generateWorkOrder: false, // intentionally ignored
  },

  /* =======================
     NEW: LAYOUT STATE
     ======================= */
  layout: {
    enabled: false,
    email: "",
    timeSetupBegins: "Midnight",
    partitionStatus: "Open",
    requestedLayout: "NA",

    chairs: "",
    chairInstructions: "", // ✅ ADD
    tables: "",
    tableInstructions: "", // ✅ ADD

    equipment: "", // ✅ single select
    equipmentInstructions: "", // ✅ ADD

    specialInstructions: "",
    cateringRequired: "No",
  },
};

const eventNotesSlice = createSlice({
  name: "eventNotes",
  initialState,
  reducers: {
    // ----------------------------------
    // Generic field updates
    // ----------------------------------
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
    /* =======================
       NEW: Layout reducers
       ======================= */
    updateLayoutField: (state, action) => {
      const { field, value } = action.payload;
      state.layout[field] = value;
    },

    setLayoutEnabled: (state, action) => {
      state.layout.enabled = action.payload;
    },

    clearEventNotes: () => initialState,
    hydrateEventNotesFromDefaults: (state, action) => {
      const d = action.payload || {};

      // -------------------------------
      // Email / Reminder defaults
      // -------------------------------
      if (typeof d.send_loc_level_emails === "boolean") {
        state.emailOptions.sendReminder = d.send_loc_level_emails;
      }

      if (typeof d.send_new_event_notice === "boolean") {
        state.emailOptions.sendEventNoticeCustomer = d.send_new_event_notice;
      }

      if (typeof d.send_school_admin_notice === "boolean") {
        state.emailOptions.sendEventNoticeAdmin = d.send_school_admin_notice;
      }

      if (typeof d.send_custodian_notice === "boolean") {
        state.emailOptions.sendEventNoticeCustodian = d.send_custodian_notice;
      }

      if (typeof d.send_changedelete_notice === "boolean") {
        state.emailOptions.sendChangeDeleteNotice = d.send_changedelete_notice;
      }

      if (typeof d.send_copy_scheduler === "boolean") {
        state.emailOptions.copyYourself = d.send_copy_scheduler;
      }

      // -------------------------------
      // Footer defaults
      // -------------------------------
      if (typeof d.show_on_cal === "boolean") {
        state.footerOptions.showPublic = d.show_on_cal;
      }

      if (typeof d.show_on_master === "boolean") {
        state.footerOptions.showMaster = d.show_on_master;
      }

      if (typeof d.append_event === "boolean") {
        state.footerOptions.appendToExisting = d.append_event;
      }

      // 🚫 Generate Work Order intentionally skipped
    },
  },
});

export const {
  updateEventField,
  updateEmailOption,
  updateFooterOption,
  updateLayoutField,
  setLayoutEnabled,
  clearEventNotes,
  hydrateEventNotesFromDefaults,
} = eventNotesSlice.actions;

export default eventNotesSlice.reducer;
