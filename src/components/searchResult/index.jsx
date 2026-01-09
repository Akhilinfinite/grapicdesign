import "./index.scss";
import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import settingsIcon from "../../asserts/images/Icons/settings.svg";

import EventNotesCard from "../internalComponents/eventNotesCard";
import BillingItemsCard from "../internalComponents/billingCard";

import {
  updateEventField,
  updateEmailOption,
  updateFooterOption,
} from "../../redux/slices/eventNotesSlice";

export default function SearchResult() {
  const notesCardRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxClient = useSelector((state) => state.client.clientname);
  const clientname = reduxClient || localStorage.getItem("clientname");

  // ---------------- Redux Data ----------------
  const searchResults = useSelector((state) => state.schedule.searchResults);
  const AnyConflict = useSelector(
    (state) => state.schedule.showConflict
  );
  const headingDetails = useSelector((state) => state.schedule.headingDetails);
  const eventNotes = useSelector((state) => state.eventNotes);

  // ---------------- Date formating ----------------
  const intervalState = useSelector((state) => state.interval);
  const formatDateTime = (isoString) => {
    if (!isoString) return "";

    const [datePart, timePart] = isoString.split("T");
    const [hh, mm] = timePart.split(":");

    return `${datePart} ${hh}:${mm}`;
  };

  // ---------------- UI States ----------------
  const [selectedRows, setSelectedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modals
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);

  // ---------------- Redirect if missing ----------------
  const noData = !searchResults || !searchResults.DATA;

  useEffect(() => {
    if (noData) {
      navigate(`/${clientname}/SearchSchedule`);
    }
  }, [noData, clientname, navigate]);

  // ---------------- Column Index Helper ----------------
  const colIndex = (name) =>
    searchResults?.COLUMNS ? searchResults.COLUMNS.indexOf(name) : -1;

  // ---------------- Format Results ----------------
  const resultsData = useMemo(() => {
    if (!searchResults || !searchResults.DATA) return [];

    const cols = searchResults.COLUMNS;
    const idx = {
      LOC_ID: cols.indexOf("LOC_ID"),
      CONFLICT: cols.indexOf("CONFLICT"),
      LOC_NAME: cols.indexOf("LOC_NAME"),
      LOC_CAP: cols.indexOf("LOC_CAP"),
      LOC_DESC: cols.indexOf("LOC_DESC"),
      CHARGEPERDAY: cols.indexOf("CHARGEPERDAY"),
    };

    return searchResults.DATA.map((row, i) => ({
      id: row[idx.LOC_ID] || i,
      conflict: (row[idx.CONFLICT] || "").trim(),
      location: row[idx.LOC_NAME] || "",
      capacity: row[idx.LOC_CAP] || "",
      description: row[idx.LOC_DESC] || "",
      charge: row[idx.CHARGEPERDAY] ? `$ ${row[idx.CHARGEPERDAY]}` : "$ 0",
    }));
  }, [searchResults]);

  const isAnyConflict = AnyConflict;

  // ---------------- Pagination ----------------
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = resultsData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(resultsData.length / rowsPerPage);

  const goToPage = (p) => setCurrentPage(p);

  // ---------------- Selection Logic ----------------
  const handleRowSelect = (id) => {
    if (isAnyConflict) {
      setSelectedRows({ [id]: true });
      return;
    }

    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[id]) delete updated[id];
      else updated[id] = true;
      return updated;
    });
  };

  const handleSelectAll = () => {
    const allSelected = currentRows.every((row) => selectedRows[row.id]);

    setSelectedRows((prev) => {
      const updated = { ...prev };

      if (allSelected) {
        currentRows.forEach((r) => delete updated[r.id]);
      } else {
        currentRows.forEach((r) => (updated[r.id] = true));
      }

      return updated;
    });
  };

  const pageAllSelected = currentRows.every((r) => selectedRows[r.id]);

  // ---------------- Summary Logic ----------------
  const selectedIds = Object.keys(selectedRows);

  const totalCharge = selectedIds.reduce((sum, id) => {
    const row = resultsData.find((r) => String(r.id) === String(id));
    if (!row) return sum;

    const amt = parseFloat(row.charge.replace("$", "").trim());
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const showSummary = !isAnyConflict && selectedIds.length > 0;

  // ==============================================================
  //                 HANDLE SAVE NOTES MODAL
  // ==============================================================
  const handleShowNotesSave = () => {
    if (!notesCardRef.current) return;
    const data = notesCardRef.current.saveNotes();

    // Basic fields
    [
      "functionType",
      "eventTitle",
      "publicNotes",
      "privateNotes",
      "internalNotes",
      "attendees",
      "image",
      "documentType",
      "uploadDocument",
    ].forEach((f) => {
      if (data[f] !== undefined)
        dispatch(updateEventField({ field: f, value: data[f] }));
    });

    // Email Options
    Object.entries(data.reminders || {}).forEach(([field, value]) => {
      const map = {
        sendReminder: "sendReminder",
        sendCustomer: "sendEventNoticeCustomer",
        sendAdmin: "sendEventNoticeAdmin",
        sendCustodian: "sendEventNoticeCustodian",
        sendChangeNotice: "sendChangeDeleteNotice",
        sendEmail: "sendEmail",
        copyYourself: "copyYourself",
      };
      if (map[field]) dispatch(updateEmailOption({ field: map[field], value }));
    });

    // Footer Options
    Object.entries(data.footerOptions || {}).forEach(([field, value]) => {
      const map = {
        showPublic: "showPublic",
        showMaster: "showMaster",
        appendExisting: "appendToExisting",
        generateWorkOrder: "generateWorkOrder",
      };
      if (map[field])
        dispatch(updateFooterOption({ field: map[field], value }));
    });

    setShowNotesModal(false);
  };

  // ==============================================================
  //                        CONTINUE LOGIC
  // ==============================================================
  const continueDisabled =
    selectedIds.length === 0 || !eventNotes.functionType?.id;

  const handleContinue = () => {
    if (continueDisabled) return;
    // navigate(`/${clientname}/ScheduleConfirmation`);
    alert("Continues to Schedule Edit Page (not implemented)");
  };

  // --------------------------- RENDER ---------------------------
  return (
    <div className="searchResultContainer">
      {/* HEADER */}
      <div className="sr-header">
        <h2>Search Results</h2>
        <div className="sr-header-buttons">
          <button className="modifyBtn button">Modify/Cancel</button>
          <button className="backBtn button">Back to Search</button>
        </div>
      </div>

      <hr className="sr-divider" />

      {/* SUB HEADER */}
      <div className="sr-subheader">
        <p>
          <strong>Start Date & Time :</strong>
          {formatDateTime(intervalState.startDate)}
          {headingDetails?.DATA?.[0]?.[colIndex("STARTTIME")] || ""}
        </p>
        <p>
          <strong>End Date & Time :</strong>
          {formatDateTime(intervalState.endDate)}
          {headingDetails?.DATA?.[0]?.[colIndex("ENDTIME")] || ""}
        </p>
        <p>

        {/* Reoccurring  */}
          <strong>Reoccurring :</strong> {AnyConflict ? "Yes" : "No"} 
        </p>
      </div>

      {/* TABLE */}
      <div className="tableWrapper">
        <table className="scheduleTable">
          <thead>
            <tr>
              <th>
                {!isAnyConflict && (
                  <input
                    type="checkbox"
                    className="searchResultsCheck1"
                    checked={pageAllSelected}
                    onChange={handleSelectAll}
                  />
                )}
                <span>Schedule</span>
              </th>
              <th>Conflict</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Description</th>
              <th>Charge</th>
              <th className="text-center">
                <img src={settingsIcon} width="20" alt="settings" />
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((item) => (
              <tr key={item.id}>
                <td>
                  {isAnyConflict ? (
                    <input
                      type="radio"
                      name="conflictRadio"
                      checked={!!selectedRows[item.id]}
                      onChange={() => handleRowSelect(item.id)}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="searchResultsCheck1"
                      checked={!!selectedRows[item.id]}
                      onChange={() => handleRowSelect(item.id)}
                    />
                  )}
                </td>

                <td style={{ color: item.conflict === "Yes" ? "red" : "" }}>
                  {item.conflict}
                </td>

                <td>{item.location}</td>
                <td>{item.capacity}</td>
                <td>{item.description}</td>
                <td>{item.charge}</td>

                <td className="text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="paginationContainer">
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          ««
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          »»
        </button>
      </div>

      {/* SUMMARY */}
      {showSummary && (
        <div className="summarySection">
          <div className="summaryRow">
            <span className="summaryLabel">Estimated Facility Charge</span>
            <span className="summaryValue">$ {totalCharge.toFixed(2)}</span>
          </div>

          <div className="summaryRow">
            <span className="summaryLabel">Estimated Request Charge</span>
            <span className="summaryValue">$ {totalCharge.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* --- CONTINUE VALIDATION WARNING --- */}
      {continueDisabled && (
        <div className="continue-warning">
          {selectedIds.length === 0 && (
            <p>• Please select at least one schedule row before continuing.</p>
          )}
          {!eventNotes.functionType?.id && (
            <p>
              • Function is required. Open Addition/Notes and select a function.
            </p>
          )}
        </div>
      )}

      {/* FOOTER BUTTONS */}
      <div className="sr-footer-buttons">
        <button
          className="btn additionBtn"
          onClick={() => setShowNotesModal(true)}
        >
          Addition / Notes
        </button>

        <button
          className="btn additionBtn"
          onClick={() => setShowBillingModal(true)}
        >
          Billing Items
        </button>

        <button
          className="btn continueBtn"
          disabled={continueDisabled}
          onClick={handleContinue}
          style={{
            opacity: continueDisabled ? 0.5 : 1,
            cursor: continueDisabled ? "not-allowed" : "pointer",
          }}
        >
          Continue
        </button>
      </div>

      {/* NOTES MODAL */}
      <Modal
        show={showNotesModal}
        onHide={() => setShowNotesModal(false)}
        centered
        dialogClassName="notesModalWrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Addition Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventNotesCard ref={notesCardRef} isModal={true} />
        </Modal.Body>
        <Modal.Footer className="notesModalFooter">
          <Button
            className="cancelBtn"
            onClick={() => setShowNotesModal(false)}
          >
            Cancel
          </Button>

          <Button className="saveBtn" onClick={handleShowNotesSave}>
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
          <BillingItemsCard />
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
