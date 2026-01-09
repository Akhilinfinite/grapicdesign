import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import addIcon from "../../../asserts/images/Icons/add.svg";
import "./index.scss";
import { useSelector } from "react-redux";

const EventNotesCard = forwardRef(({ isModal = false }, ref) => {
  const reduxNotes = useSelector((state) => state.eventNotes);

  const [functionList, setFunctionList] = useState([]);

  const [formData, setFormData] = useState({
    functionType: { id: "", name: "" }, // FIXED
    eventTitle: "",
    publicNotes: "",
    privateNotes: "",
    internalNotes: "",
    attendees: "",
    image: null,
    documentType: "",
    uploadDocument: null,

    reminders: {
      sendReminder: false,
      sendCustomer: false,
      sendAdmin: false,
      sendCustodian: false,
      sendChangeNotice: false,
      sendEmail: false,
      copyYourself: false,
    },

    footerOptions: {
      showPublic: true,
      showMaster: true,
      appendExisting: false,
      generateWorkOrder: false,
    },
  });

  // =========================================================
  // 1️⃣ Fetch Function Types
  // =========================================================
  useEffect(() => {
    const fetchFunctions = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.65/rest/gvRestApi/master/getFunction",
          { clientname: "dps" },
          { headers: { "Content-Type": "application/json" } }
        );

        const data = response.data;

        if (data?.COLUMNS && data?.DATA) {
          const colIndex = {};
          data.COLUMNS.forEach((col, i) => (colIndex[col] = i));

          const formatted = data.DATA.map((row) => ({
            id: row[colIndex["FUNCTION_ID"]],
            name: row[colIndex["FUNCTION_NAME"]],
          }));

          setFunctionList(formatted);
        }
      } catch (err) {
        console.error("Function API error:", err);
      }
    };

    fetchFunctions();
  }, []);

  // =========================================================
  // 2️⃣ Restore Redux → Local State
  // =========================================================
  useEffect(() => {
    if (!reduxNotes) return;

    setFormData((prev) => ({
      ...prev,

      // FIXED: ensure object shape remains {id, name}
      functionType: reduxNotes.functionType || { id: "", name: "" },

      eventTitle: reduxNotes.eventTitle,
      publicNotes: reduxNotes.publicNotes,
      privateNotes: reduxNotes.privateNotes,
      internalNotes: reduxNotes.internalNotes,
      attendees: reduxNotes.attendees,
      image: reduxNotes.image,
      documentType: prev.documentType,
      uploadDocument: prev.uploadDocument,

      reminders: {
        sendReminder: reduxNotes.emailOptions.sendReminder,
        sendCustomer: reduxNotes.emailOptions.sendEventNoticeCustomer,
        sendAdmin: reduxNotes.emailOptions.sendEventNoticeAdmin,
        sendCustodian: reduxNotes.emailOptions.sendEventNoticeCustodian,
        sendChangeNotice: reduxNotes.emailOptions.sendChangeDeleteNotice,
        sendEmail: reduxNotes.emailOptions.copyYourself,
        copyYourself: reduxNotes.emailOptions.copyYourself,
      },

      footerOptions: {
        showPublic: reduxNotes.footerOptions.showPublic,
        showMaster: reduxNotes.footerOptions.showMaster,
        appendExisting: reduxNotes.footerOptions.appendToExisting,
        generateWorkOrder: reduxNotes.footerOptions.generateWorkOrder,
      },
    }));
  }, [reduxNotes]);

  // =========================================================
  // 3️⃣ Update Field Handler
  // =========================================================
  const updateField = (e) => {
    const { name, value } = e.target;

    // Remove leading zeros for attendees
    if (name === "attendees") {
      const cleaned = value.replace(/^0+(?=\d)/, "");
      setFormData((p) => ({ ...p, attendees: cleaned }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  // =========================================================
  // 4️⃣ Checkbox & File Updates
  // =========================================================
  const updateCheckbox = (group, key) => {
    setFormData((p) => ({
      ...p,
      [group]: { ...p[group], [key]: !p[group][key] },
    }));
  };

  const updateFile = (e, key) => {
    setFormData((p) => ({
      ...p,
      [key]: e.target.files[0],
    }));
  };

  // =========================================================
  // 5️⃣ Expose saveNotes() to Parent
  // =========================================================
  useImperativeHandle(ref, () => ({
    saveNotes: () => formData,
    cancelNotes: () => true,
  }));

  // =========================================================
  // 6️⃣ Component UI
  // =========================================================
  return (
    <div className={`event-form ${isModal ? "modal-version" : "page-version"}`}>
      <h3 className="event-form__availability">
        SPH-Classroom(1360) is available for 10/31/2023 between 3:00pm and
        4:00pm – <strong>Function</strong> is required to continue
      </h3>

      <form className="event-form-body">
        {/* FUNCTION ROW */}
        <div className="row two-col">
          <div className="form-group full-width">
            <label>Function</label>

            <div className="function-inline">
              <select
                name="functionType"
                value={formData.functionType.id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const fn = functionList.find(
                    (item) => String(item.id) === String(selectedId)
                  );

                  setFormData((p) => ({
                    ...p,
                    functionType: {
                      id: selectedId,
                      name: fn?.name || "",
                    },
                  }));
                }}
              >
                <option value="">Select a function title</option>
                {functionList.map((fn) => (
                  <option key={fn.id} value={fn.id}>
                    {fn.name}
                  </option>
                ))}
              </select>

              <button type="button" className="add-type-btn">
                <img src={addIcon} alt="add" />
                Add New Type
              </button>
            </div>
          </div>
        </div>

        {/* TITLE + ATTENDEES */}
        <div className="row three-col">
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="eventTitle"
              value={formData.eventTitle}
              placeholder="Place holder text"
              onChange={updateField}
            />
          </div>

          <div className="form-group">
            <label>No. of Attendees</label>
            <input
              type="number"
              name="attendees"
              min="0"
              value={formData.attendees}
              placeholder="Place holder text"
              onChange={updateField}
            />
          </div>

          <div className="form-group"></div>
        </div>

        {/* TEXTAREA FIELDS */}
        <div className="form-group">
          <label>Public Notes</label>
          <textarea
            name="publicNotes"
            value={formData.publicNotes}
            onChange={updateField}
          />
        </div>

        <div className="form-group">
          <label>Private Notes</label>
          <textarea
            name="privateNotes"
            value={formData.privateNotes}
            onChange={updateField}
          />
        </div>

        <div className="form-group">
          <label>Internal Notes</label>
          <textarea
            name="internalNotes"
            value={formData.internalNotes}
            onChange={updateField}
          />
        </div>

        {/* FILE ROW */}
        <div className="row three-col file-row">
          <div className="form-group">
            <label>Select Image & Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateFile(e, "image")}
            />
            {formData.image && <p>{formData.image.name}</p>}
          </div>

          <div className="form-group">
            <label>Select Document Type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={updateField}
            >
              <option value="">select a value</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <input
              type="file"
              onChange={(e) => updateFile(e, "uploadDocument")}
            />
            {formData.uploadDocument && <p>{formData.uploadDocument.name}</p>}
          </div>

          {/* <div className="form-group">
            <label>Select Image & Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateFile(e, "image")}
            />
          </div>

          <div className="form-group">
            <label>Select Document Type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={updateField}
            >
              <option value="">select a value</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => updateFile(e, "uploadDocument")}
            />
          </div> */}
        </div>

        {/* CHECKBOX GRID */}
        <div className="checkbox-grid">
          {/* Reminders */}
          <label>
            <input
              type="checkbox"
              checked={formData.reminders.sendReminder}
              onChange={() => updateCheckbox("reminders", "sendReminder")}
            />
            Send Reminder Email
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.reminders.sendCustomer}
              onChange={() => updateCheckbox("reminders", "sendCustomer")}
            />
            Send New Event Notice to Customer/Contact
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.reminders.sendAdmin}
              onChange={() => updateCheckbox("reminders", "sendAdmin")}
            />
            Send New Event Notice to School Admin
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.reminders.sendCustodian}
              onChange={() => updateCheckbox("reminders", "sendCustodian")}
            />
            Send New Event Notice to Custodian
          </label>

          <label className="change-notice-row">
            <input
              type="checkbox"
              checked={formData.reminders.sendChangeNotice}
              onChange={() => updateCheckbox("reminders", "sendChangeNotice")}
            />
            Send Change/ Delete Notice
            <button
              type="button"
              className="add-emails-btn"
              aria-label="Add email addresses"
              onClick={(e) => e.preventDefault()}
            >
              Add Email Addresses
            </button>
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.reminders.sendEmail}
              onChange={() => updateCheckbox("reminders", "sendEmail")}
            />
            Send Email
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.reminders.copyYourself}
              onChange={() => updateCheckbox("reminders", "copyYourself")}
            />
            Copy Yourself
          </label>

          {/* Footer */}
          <label>
            <input
              type="checkbox"
              checked={formData.footerOptions.showPublic}
              onChange={() => updateCheckbox("footerOptions", "showPublic")}
            />
            Show on Public
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.footerOptions.showMaster}
              onChange={() => updateCheckbox("footerOptions", "showMaster")}
            />
            Show on Master
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.footerOptions.appendExisting}
              onChange={() => updateCheckbox("footerOptions", "appendExisting")}
            />
            Append this event to an existing one
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.footerOptions.generateWorkOrder}
              onChange={() =>
                updateCheckbox("footerOptions", "generateWorkOrder")
              }
            />
            Generate Work Order
          </label>
        </div>
      </form>
    </div>
  );
});

export default EventNotesCard;
