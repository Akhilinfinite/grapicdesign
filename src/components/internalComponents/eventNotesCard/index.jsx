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
  const sessionData = useSelector((state) => state.auth.sessionData);
  const selectedContact = useSelector(
    (state) => state.interval?.selectedContact?.[0],
  );
  const schAdminValue = selectedContact?.SCH_ADMIN;

  // normalize + safety
  const pageLevel = Number(sessionData?.PAGE ?? 0);
  const canShowAdvancedCheckboxes = pageLevel >= 2;

  const canShowAdminEmailCheckboxes =
    canShowAdvancedCheckboxes && schAdminValue === "N";
  const reduxNotes = useSelector((state) => state.eventNotes);
  const data = useSelector((state) => state.sample.data);
  const customCodeRow = data.find((row) => row[3] === "custom_code");

  const isLayoutEnabledByConfig = customCodeRow?.[4] === "Layout";

  const [functionList, setFunctionList] = useState([]);

  /* ================= Layout values ================= */
  const REQUESTED_LAYOUT_OPTIONS = [
    "NA",
    "Banquet",
    "Chevron",
    "Classroom",
    "Meeting",
    "Small Table Groups",
    "Special",
    "Square",
    "Theater",
    "U-Shape",
  ];
  const generateTimeOptions = (interval = 15) => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += interval) {
        const hour12 = String(h % 12 || 12).padStart(2, "0");
        const ampm = h < 12 ? "AM" : "PM";
        const minute = String(m).padStart(2, "0");
        times.push(`${hour12}:${minute} ${ampm}`);
      }
    }
    return times;
  };

  const TIME_OPTIONS = generateTimeOptions(15);

  const [formData, setFormData] = useState({
    functionType: { id: "", name: "" },
    eventTitle: "",
    publicNotes: "",
    privateNotes: "",
    internalNotes: "",
    attendees: 0,
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
    workOrder: {
      description: "",
      sendNotification: false,
      notificationEmails: "",
    },
    layout: {
      enabled: false,
      email: "",
      timeSetupBegins: "Midnight",
      partitionStatus: "Open",
      requestedLayout: "NA",
      chairs: "",
      chairInstructions: "",
      tables: "",
      tableInstructions: "",
      equipment: "",
      equipmentInstructions: "",
      specialInstructions: "",
      cateringRequired: "No",
    },
  });

  /* ================= Fetch Function Types ================= */
  useEffect(() => {
    axios
      .post("http://192.168.0.65/rest/gvRestApi/master/getFunction", {
        clientname: "dps",
      })
      .then((res) => {
        const data = res.data;
        if (data?.COLUMNS && data?.DATA) {
          const idx = {};
          data.COLUMNS.forEach((c, i) => (idx[c] = i));
          setFunctionList(
            data.DATA.map((r) => ({
              id: r[idx.FUNCTION_ID],
              name: r[idx.FUNCTION_NAME],
            })),
          );
        }
      });
  }, []);

  /* ================= Restore Redux ================= */
  useEffect(() => {
    if (!reduxNotes) return;

    setFormData((prev) => ({
      ...prev,
      functionType: reduxNotes.functionType || { id: "", name: "" },
      eventTitle: reduxNotes.eventTitle,
      publicNotes: reduxNotes.publicNotes,
      privateNotes: reduxNotes.privateNotes,
      internalNotes: reduxNotes.internalNotes,
      attendees: reduxNotes.attendees,
      image: reduxNotes.image,
      documentType: reduxNotes.documentType,
      uploadDocument: reduxNotes.uploadDocument,

      reminders: {
        sendReminder: reduxNotes.emailOptions.sendReminder,
        sendCustomer: reduxNotes.emailOptions.sendEventNoticeCustomer,
        sendAdmin: reduxNotes.emailOptions.sendEventNoticeAdmin,
        sendCustodian: reduxNotes.emailOptions.sendEventNoticeCustodian,
        sendChangeNotice: reduxNotes.emailOptions.sendChangeDeleteNotice,
        sendEmail: reduxNotes.emailOptions.sendEmail,
        copyYourself: reduxNotes.emailOptions.copyYourself,
      },

      footerOptions: {
        showPublic: reduxNotes.footerOptions.showPublic,
        showMaster: reduxNotes.footerOptions.showMaster,
        appendExisting: reduxNotes.footerOptions.appendToExisting,
        generateWorkOrder: reduxNotes.footerOptions.generateWorkOrder,
      },
      workOrder: {
        description: reduxNotes.workOrder?.description || "",
        sendNotification: reduxNotes.workOrder?.sendNotification || false,
        notificationEmails: reduxNotes.workOrder?.notificationEmails || "",
      },

      layout: {
        ...prev.layout,
        ...(reduxNotes.layout || {}),
      },
    }));
  }, [reduxNotes]);

  useEffect(() => {
    if (!canShowAdminEmailCheckboxes) {
      setFormData((p) => ({
        ...p,
        reminders: {
          ...p.reminders,
          sendAdmin: false,
          sendCustodian: false,
        },
      }));
    }
  }, [canShowAdminEmailCheckboxes]);

  useEffect(() => {
    if (!canShowAdvancedCheckboxes) {
      setFormData((p) => ({
        ...p,
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
          ...p.footerOptions,
          showMaster: false,
          appendExisting: false,
          generateWorkOrder: false,
        },
      }));
    }
  }, [canShowAdvancedCheckboxes]);

  useEffect(() => {
    if (!formData.footerOptions.generateWorkOrder) {
      setFormData((p) => ({
        ...p,
        workOrder: {
          description: "",
          sendNotification: false,
          notificationEmails: "",
        },
      }));
    }
  }, [formData.footerOptions.generateWorkOrder]);

  /* ================= Helpers ================= */
  const updateField = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const updateCheckbox = (group, key) => {
    setFormData((p) => ({
      ...p,
      [group]: { ...p[group], [key]: !p[group][key] },
    }));
  };

  const updateLayout = (key, value) => {
    setFormData((p) => ({
      ...p,
      layout: { ...p.layout, [key]: value },
    }));
  };

  const updateFile = (e, key) => {
    setFormData((p) => ({
      ...p,
      [key]: e.target.files[0],
    }));
  };

  useImperativeHandle(ref, () => ({
    saveNotes: () => formData,
    cancelNotes: () => true,
  }));

  /* ================= UI ================= */
  return (
    <div className={`event-form ${isModal ? "modal-version" : "page-version"}`}>
      <h3 className='event-form__availability'>
        SPH-Classroom(1360) is available for 10/31/2023 between 3:00pm and
        4:00pm – <strong>Function</strong> is required to continue
      </h3>

      <form className='event-form-body'>
        {/* ================= EXISTING FIELDS ================= */}
        {/* Function */}
        <div className='row two-col'>
          <div className='form-group full-width'>
            <label>Function</label>

            <div className='function-inline'>
              <select
                name='functionType'
                value={formData.functionType.id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const fn = functionList.find(
                    (item) => String(item.id) === String(selectedId),
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
                <option value=''>Select a function title</option>
                {functionList.map((fn) => (
                  <option key={fn.id} value={fn.id}>
                    {fn.name}
                  </option>
                ))}
              </select>

              <button type='button' className='add-type-btn'>
                <img src={addIcon} alt='add' />
                Add New Type
              </button>
            </div>
          </div>
        </div>

        {/* TITLE + ATTENDEES */}
        <div className='row three-col'>
          <div className='form-group'>
            <label>Event Title</label>
            <input
              type='text'
              name='eventTitle'
              value={formData.eventTitle}
              placeholder='Place holder text'
              onChange={updateField}
            />
          </div>

          <div className='form-group'>
            <label>No. of Attendees</label>
            <input
              type='number'
              name='attendees'
              min='0'
              value={formData.attendees}
              placeholder='Place holder text'
              onChange={updateField}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className='form-group'></div>
        </div>

        {/* TEXTAREA FIELDS */}
        <div className='form-group'>
          <label>Public Notes</label>
          <textarea
            name='publicNotes'
            value={formData.publicNotes}
            onChange={updateField}
          />
        </div>

        <div className='form-group'>
          <label>Private Notes</label>
          <textarea
            name='privateNotes'
            value={formData.privateNotes}
            onChange={updateField}
          />
        </div>

        <div className='form-group'>
          <label>Internal Notes</label>
          <textarea
            name='internalNotes'
            value={formData.internalNotes}
            onChange={updateField}
          />
        </div>

        {/* FILE ROW */}
        <div className='row three-col file-row'>
          <div className='form-group'>
            <label>Select Image & Upload</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => updateFile(e, "image")}
            />
            {formData.image && <p>{formData.image.name}</p>}
          </div>

          <div className='form-group'>
            <label>Select Document Type</label>
            <select
              name='documentType'
              value={formData.documentType}
              onChange={updateField}
            >
              <option value=''>select a value</option>
            </select>
          </div>

          <div className='form-group'>
            <label>Upload Document</label>
            <input
              type='file'
              onChange={(e) => updateFile(e, "uploadDocument")}
            />
            {formData.uploadDocument && <p>{formData.uploadDocument.name}</p>}
          </div>
        </div>

        {/* Uploads */}
        {canShowAdvancedCheckboxes && (
          <>
            <div className='checkbox-grid'>
              {/* Reminders */}
              <label>
                <input
                  type='checkbox'
                  checked={formData.reminders.sendReminder}
                  onChange={() => updateCheckbox("reminders", "sendReminder")}
                />
                Send Reminder Email
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.reminders.sendCustomer}
                  onChange={() => updateCheckbox("reminders", "sendCustomer")}
                />
                Send New Event Notice to Customer/Contact
              </label>
              {canShowAdminEmailCheckboxes && (
                <>
                  <label>
                    <input
                      type='checkbox'
                      checked={formData.reminders.sendAdmin}
                      onChange={() => updateCheckbox("reminders", "sendAdmin")}
                    />
                    Send New Event Notice to School Admin
                  </label>

                  <label>
                    <input
                      type='checkbox'
                      checked={formData.reminders.sendCustodian}
                      onChange={() =>
                        updateCheckbox("reminders", "sendCustodian")
                      }
                    />
                    Send New Event Notice to Custodian
                  </label>
                </>
              )}
              <label className='change-notice-row'>
                <input
                  type='checkbox'
                  checked={formData.reminders.sendChangeNotice}
                  onChange={() =>
                    updateCheckbox("reminders", "sendChangeNotice")
                  }
                />
                Send Change/ Delete Notice
                <button
                  type='button'
                  className='add-emails-btn'
                  aria-label='Add email addresses'
                  onClick={(e) => e.preventDefault()}
                >
                  Add Email Addresses
                </button>
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.reminders.sendEmail}
                  onChange={() => updateCheckbox("reminders", "sendEmail")}
                />
                Send Email
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.reminders.copyYourself}
                  onChange={() => updateCheckbox("reminders", "copyYourself")}
                />
                Copy Yourself
              </label>

              {/* Footer */}
              <label>
                <input
                  type='checkbox'
                  checked={formData.footerOptions.showPublic}
                  onChange={() => updateCheckbox("footerOptions", "showPublic")}
                />
                Show on Public
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.footerOptions.showMaster}
                  onChange={() => updateCheckbox("footerOptions", "showMaster")}
                />
                Show on Master
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.footerOptions.appendExisting}
                  onChange={() =>
                    updateCheckbox("footerOptions", "appendExisting")
                  }
                />
                Append this event to an existing one
              </label>

              <label>
                <input
                  type='checkbox'
                  checked={formData.footerOptions.generateWorkOrder}
                  onChange={() =>
                    updateCheckbox("footerOptions", "generateWorkOrder")
                  }
                />
                Generate Work Order
              </label>
            </div>
            {formData.footerOptions.generateWorkOrder && (
              <div className='workorder-section mt-3'>
                {/* Description */}
                <div className='form-group'>
                  <label>Work Order Description</label>
                  <textarea
                    value={formData.workOrder.description}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        workOrder: {
                          ...p.workOrder,
                          description: e.target.value,
                        },
                      }))
                    }
                    placeholder='Enter work order description'
                  />
                </div>

                {/* Send Notification */}
                <label className='checkbox-row'>
                  <input
                    type='checkbox'
                    checked={formData.workOrder.sendNotification}
                    onChange={() =>
                      setFormData((p) => ({
                        ...p,
                        workOrder: {
                          ...p.workOrder,
                          sendNotification: !p.workOrder.sendNotification,
                        },
                      }))
                    }
                  />
                  Send Work Order Notification
                  <span className='helper-text'>
                    (multiple emails can be entered using ; or ,)
                  </span>
                </label>

                {/* Notification Emails */}
                <div className='form-group'>
                  <input
                    type='text'
                    value={formData.workOrder.notificationEmails}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        workOrder: {
                          ...p.workOrder,
                          notificationEmails: e.target.value,
                        },
                      }))
                    }
                    disabled={!formData.workOrder.sendNotification}
                    placeholder='example@school.org; admin@school.org'
                  />
                </div>
              </div>
            )}
          </>
          //433
        )}

        {/* ======================= LAYOUT SECTION ======================= */}
        {isLayoutEnabledByConfig && (
          <div className='row layout-section'>
            {/* Layout Setup + Email */}
            <div className='row'>
              <div className='form-group layout-col-1'>
                <label>Layout Setup</label>
                <div className='layout-radio'>
                  <label>
                    <input
                      type='radio'
                      name='layoutSetup'
                      checked={!formData.layout.enabled}
                      onChange={() => updateLayout("enabled", false)}
                    />
                    No
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='layoutSetup'
                      checked={formData.layout.enabled}
                      onChange={() => updateLayout("enabled", true)}
                    />
                    Yes
                  </label>
                </div>
              </div>

              <div className='form-group layout-col-2'>
                <label>Email</label>
                <input
                  type='email'
                  value={formData.layout.email}
                  readOnly={!formData.layout.enabled}
                  onChange={(e) => updateLayout("email", e.target.value)}
                />
              </div>
            </div>

            {formData.layout.enabled && (
              <>
                {/* Time / Partition / Requested Layout */}
                <div className='row three-col'>
                  <div className='form-group'>
                    <label>Time Setup Begins?</label>
                    <select
                      value={formData.layout.timeSetupBegins}
                      onChange={(e) =>
                        updateLayout("timeSetupBegins", e.target.value)
                      }
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Partition Open or Closed?</label>
                    <select
                      value={formData.layout.partitionStatus}
                      onChange={(e) =>
                        updateLayout("partitionStatus", e.target.value)
                      }
                    >
                      <option>Open</option>
                      <option>Closed</option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Requested Layout</label>
                    <select
                      value={formData.layout.requestedLayout}
                      onChange={(e) =>
                        updateLayout("requestedLayout", e.target.value)
                      }
                    >
                      {REQUESTED_LAYOUT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chairs / Tables / Equipment */}
                <div className='row three-col'>
                  {/* ================= CHAIRS ================= */}
                  <div className='row layout-row'>
                    <div className='form-group layout-col-1'>
                      <label># of Chairs</label>
                      <input
                        type='text'
                        inputMode='numeric'
                        value={formData.layout.chairs}
                        onChange={(e) => updateLayout("chairs", e.target.value)}
                      />
                    </div>

                    <div className='form-group layout-col-2'>
                      <textarea
                        value={formData.layout.chairInstructions || ""}
                        onChange={(e) =>
                          updateLayout("chairInstructions", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* ================= TABLES ================= */}
                  <div className='row layout-row'>
                    <div className='form-group layout-col-1'>
                      <label># of Tables</label>
                      <input
                        type='text'
                        inputMode='numeric'
                        value={formData.layout.tables}
                        onChange={(e) => updateLayout("tables", e.target.value)}
                      />
                    </div>

                    <div className='form-group layout-col-2'>
                      <textarea
                        value={formData.layout.tableInstructions || ""}
                        onChange={(e) =>
                          updateLayout("tableInstructions", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* ================= EQUIPMENT ================= */}
                  <div className='row layout-row'>
                    <div className='form-group layout-col-1'>
                      <label>Select Equipment</label>
                      <select
                        value={formData.layout.equipment}
                        onChange={(e) =>
                          updateLayout("equipment", e.target.value)
                        }
                      >
                        <option value='Computer'>Computer</option>
                        <option value='Flip Chart'>Flip Chart</option>
                        <option value='LCD Projector'>LCD Projector</option>
                        <option value='LCD w/VCR'>LCD w/VCR</option>
                        <option value='LCD w/DVD'>LCD w/DVD</option>
                        <option value='Markers'>Markers</option>
                        <option value='Microphone'>Microphone</option>
                        <option value='Overhead Projector'>
                          Overhead Projector
                        </option>
                        <option value='Printer'>Printer</option>
                      </select>
                    </div>

                    <div className='form-group layout-col-2'>
                      <textarea
                        value={formData.layout.equipmentInstructions || ""}
                        onChange={(e) =>
                          updateLayout("equipmentInstructions", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Special Instructions + Image */}
                <div className='form-group'>
                  <label>Special Instructions</label>
                  <textarea
                    value={formData.layout.specialInstructions}
                    onChange={(e) =>
                      updateLayout("specialInstructions", e.target.value)
                    }
                  />
                </div>

                {/* Catering */}

                <div className='layout-row'>
                  <label>Event require catering?</label>
                  <div className='layout-radio'>
                    <label>
                      <input
                        type='radio'
                        checked={formData.layout.cateringRequired === "No"}
                        onChange={() => updateLayout("cateringRequired", "No")}
                      />
                      No
                    </label>
                    <label>
                      <input
                        type='radio'
                        checked={formData.layout.cateringRequired === "Yes"}
                        onChange={() => updateLayout("cateringRequired", "Yes")}
                      />
                      Yes
                    </label>
                  </div>
                  <div className='layout-col-2 layout-note'>
                    Please put catering info in Private Notes area.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {/* ======================= END LAYOUT ======================= */}
      </form>
    </div>
  );
});

export default EventNotesCard;
