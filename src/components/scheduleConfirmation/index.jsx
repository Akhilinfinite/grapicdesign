import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import EventNotesCard from "../internalComponents/eventNotesCard";

import attachmentIcon from "../../asserts/images/Icons/attachment-check.svg";
import arrowUp from "../../asserts/images/Icons/arrow-up.svg";
import settingsIcon from "../../asserts/images/Icons/settings.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateEventField,
  updateEmailOption,
  updateFooterOption,
} from "../../redux/slices/eventNotesSlice";
import BillingCard from "../internalComponents/billingCard";

export default function ScheduleConfirmation() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);

  // CORRECT DATA SOURCE FROM REDUX
  const searchResults = useSelector((state) => state.schedule.searchResults);
  const headingDetails = useSelector((state) => state.schedule.headingDetails);

  const notes = useSelector((state) => state.eventNotes);
  const notesCardRef = useRef(null);
  const navigate = useNavigate();
  const reduxClient = useSelector((state) => state.client.clientname);
  const clientname = reduxClient || localStorage.getItem("clientname");

  const dispatch = useDispatch();

  // ---------------- Redirect if missing ----------------
  const noData = !searchResults || !searchResults.DATA;

  useEffect(() => {
    if (noData) {
      navigate(`/${clientname}/SearchSchedule`);
    }
  }, [noData, clientname, navigate]);

  /* -------------------------------------
        EXTRACT HEADING DETAILS
  -------------------------------------- */
  const heading = headingDetails?.DATA?.[0] || [];

  const [CUSTOMERNAME, LOCATIONNAME, STARTTIME, ENDTIME] = heading;

  /* -------------------------------------
        TABLE ROWS FROM API
  -------------------------------------- */
  const tableRows = searchResults?.DATA || [];

  /* -------------------------------------
        SAVE NOTES
  -------------------------------------- */
  const handleNotesSave = () => {
    if (!notesCardRef.current) return;

    const data = notesCardRef.current.saveNotes();
    console.log("Saved Notes Data:", data);

    const simpleFields = [
      "functionType",
      "eventTitle",
      "publicNotes",
      "privateNotes",
      "internalNotes",
      "attendees",
      "image",
      "documentType",
      "uploadDocument",
    ];

    simpleFields.forEach((field) => {
      if (data[field] !== undefined) {
        dispatch(updateEventField({ field, value: data[field] }));
      }
    });

    Object.entries(data.reminders || {}).forEach(([field, value]) => {
      const emailFieldMap = {
        sendReminder: "sendReminder",
        sendCustomer: "sendEventNoticeCustomer",
        sendAdmin: "sendEventNoticeAdmin",
        sendCustodian: "sendEventNoticeCustodian",
        sendChangeNotice: "sendChangeDeleteNotice",
        sendEmail: "copyYourself",
        copyYourself: "copyYourself",
      };

      if (emailFieldMap[field]) {
        dispatch(updateEmailOption({ field: emailFieldMap[field], value }));
      }
    });

    Object.entries(data.footerOptions || {}).forEach(([field, value]) => {
      const footerFieldMap = {
        showPublic: "showPublic",
        showMaster: "showMaster",
        appendExisting: "appendToExisting",
        generateWorkOrder: "generateWorkOrder",
      };

      if (footerFieldMap[field]) {
        dispatch(updateFooterOption({ field: footerFieldMap[field], value }));
      }
    });

    setShowNotesModal(false);
  };

  const handleNotesCancel = () => {
    notesCardRef.current?.cancelNotes();
    setShowNotesModal(false);
  };

  const totalCharges = tableRows.reduce((sum, row) => {
    const charge = row?.[8];
    return charge != null ? sum + parseFloat(charge) : sum;
  }, 0);

  const hasBookedConflict = tableRows.some(
    (row) => row?.[4]?.trim() === "Booked"
  );
  return (
    <div className="scheduleConfirmationContainer">
      {/* Header */}
      <div className="headerRow">
        <h2 className="pageTitle">Schedule Confirmation</h2>
        <button type="button" className="backButton">
          Back to Search
        </button>
      </div>

      {/* Sub Header */}
      <div className="detailsHeaderRow">
        <h3 className="detailsTitle">Request Number &gt; - Schedule Details</h3>

        <div className="checkboxGroup">
          <label className="checkboxLabel">
            <input type="checkbox" className="checkboxInput" />
            Display on public calendars?
          </label>

          <label className="checkboxLabel">
            <input type="checkbox" className="checkboxInput" />
            Show on Master
          </label>
        </div>
      </div>

      {/* Top Details */}
      <div className="scheduleDetails">
        {/* LEFT */}
        <div className="leftSection">
          <div className="detailsBox">
            <div>
              <h4>Customer</h4>
              <p>{CUSTOMERNAME || "N/A"}</p>
            </div>

            <div>
              <h4>Location</h4>
              <p>{LOCATIONNAME || "N/A"}</p>
            </div>

            <div>
              <h4>Start Time</h4>
              <p>{STARTTIME?.trim() || "N/A"}</p>
            </div>

            <div>
              <h4>End Time</h4>
              <p>{ENDTIME?.trim() || "N/A"}</p>
            </div>

            <div>
              <h4>No. of Attendees</h4>
              <p>{notes?.attendees || 0}</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rightSection">
          <div className="detailsBox">
            <div>
              <h4>Function</h4>
              <p>{notes.functionType?.name || "N/A"}</p>
            </div>

            <div>
              <h4>Event Title</h4>
              <p>{notes.eventTitle || "N/A"}</p>
            </div>

            <div>
              <h4>Public Notes</h4>
              <p>{notes.publicNotes || "N/A"}</p>
            </div>

            <div>
              <h4>Private Notes</h4>
              <p>{notes.privateNotes || "N/A"}</p>
            </div>

            <div>
              <h4>Internal Notes</h4>
              <p>{notes.internalNotes || "N/A"}</p>
            </div>

            <div className="fileSection">
              {!notes?.file && !notes?.image ? (
                <p>No documents uploaded</p>
              ) : (
                <img src={attachmentIcon} alt="" className="fileIcon" />
              )}

              {notes?.uploadDocument && (
                <div className="fileRow">
                  <a
                    href={URL.createObjectURL(notes.uploadDocument)}
                    download={notes.uploadDocument.name}
                    className="fileName"
                  >
                    Uploaded Document
                  </a>
                </div>
              )}

              {notes?.image && (
                <div className="fileRow">
                  <a
                    href={URL.createObjectURL(notes.image)}
                    download={notes.image.name}
                    className="fileName"
                  >
                    {notes.image.name}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="scheduleTableSection">
        <div className="table-responsive">
          <table className="table table-striped scheduleTable">
            <thead className="tableHeader">
              <tr>
                <th>
                  <input type="checkbox" className="searchResultsCheck1" />
                  Skip Date <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Date <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Available? <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Conflict <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Conflict Customer{" "}
                  <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Conflict Function{" "}
                  <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                {/* NEW COLUMN */}
                <th>
                  Conflict Hours{" "}
                  <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th>
                  Override <img src={arrowUp} alt="" className="sortIcon" />
                </th>

                <th className="chargeHeader">
                  Charge
                  <img src={arrowUp} alt="" className="sortIcon" />
                  <button className="tableSettingBtn">
                    <img src={settingsIcon} className="settingsIcon" alt="" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableRows.map((row, idx) => {
                const [
                  ,
                  ,
                  DATEDAY,
                  AVAILABLE,
                  CONFLICT,
                  CONFLICTCUSTOMER,
                  CONFLICTFUNCTION,
                  CONFLICTHOURS,
                  CHARGES,
                ] = row;

                const available = AVAILABLE?.trim();
                const conflict = CONFLICT?.trim();

                const isAvailable = available === "Yes";
                const isConflict = conflict !== "None";

                return (
                  <tr key={idx}>
                    {/* Skip Date */}
                    <td>
                      <input type="checkbox" className="searchResultsCheck1" />
                    </td>

                    {/* Date */}
                    <td>{DATEDAY || "N/A"}</td>

                    {/* Available */}
                    <td className={isAvailable ? "text-success fw-bold" : ""}>
                      {available || "N/A"}
                    </td>

                    {/* Conflict */}
                    <td className={isConflict ? "text-danger fw-bold" : ""}>
                      {conflict || "None"}
                    </td>

                    {/* Conflict Customer */}
                    <td>{CONFLICTCUSTOMER?.trim() || "---"}</td>

                    {/* Conflict Function */}
                    <td>{CONFLICTFUNCTION?.trim() || "---"}</td>

                    {/* Conflict Hours */}
                    <td>{CONFLICTHOURS?.trim() || "---"}</td>

                    {/* Override */}
                    <td>---</td>
 
                    {/* Charge */}
                    <td>
                      {CHARGES != null
                        ? `$ ${parseFloat(CHARGES).toFixed(2)}`
                        : "---"}
                    </td>
                  </tr>
                );
              })}

              {/* Summary Row */}
              <tr>
                <td colSpan="8" className="estimated_Charge">
                  Estimated Facility Charge
                </td>
                <td>{`$ ${totalCharges.toFixed(2)}`}</td>
              </tr>

              {/* Button Row */}
              <tr className="buttonSection">
                <td colSpan="5"></td>

                <td>
                  <button
                    className="btn additionBtn"
                    style={
                      hasBookedConflict
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}
                    }
                    onClick={() => setShowBillingModal(true)}
                  >
                    Billing Items
                  </button>
                </td>

                <td>
                  <button
                    className="btn additionBtn"
                    onClick={() => setShowNotesModal(true)}
                    style={
                      hasBookedConflict
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}
                    }
                  >
                    Addition/Notes
                  </button>
                </td>

                <td>
                  <button className="btn printBtn">Print</button>
                </td>

                <td>
                  <button
                    className="btn blueBtn"
                    style={
                      hasBookedConflict
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : {}
                    }
                  >
                    Save Request
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTES MODAL */}
      <Modal
        show={showNotesModal}
        onHide={() => setShowNotesModal(false)}
        centered
        dialogClassName="notesModalWrapper"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Addition Notes</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EventNotesCard ref={notesCardRef} isModal={true} />
        </Modal.Body>

        <Modal.Footer className="notesModalFooter">
          <Button className="cancelBtn" onClick={handleNotesCancel}>
            Cancel
          </Button>

          <Button className="saveBtn" onClick={handleNotesSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* BILLING MODAL */}
      <Modal
        show={showBillingModal}
        onHide={() => setShowBillingModal(false)}
        centered
        dialogClassName="notesModalWrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Billing Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BillingCard isModal={true} />
        </Modal.Body>
        <Modal.Footer className="notesModalFooter">
          <Button
            className="cancelBtn"
            onClick={() => setShowBillingModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
