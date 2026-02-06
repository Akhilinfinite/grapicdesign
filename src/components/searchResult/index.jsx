import axios from "axios";
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
  updateLayoutField,
} from "../../redux/slices/eventNotesSlice";

import "./index.scss";
import ScheduleTable from "../internalComponents/scheduleTable";

export default function SearchResult() {
  const notesCardRef = useRef(null);
  const baseURL = "http://192.168.0.65/rest/gvRestApi/";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxClient = useSelector((state) => state.client.clientname);
  const clientname = reduxClient || localStorage.getItem("clientname");

  // ---------------- Redux Data ----------------
  const searchResults = useSelector((state) => state.schedule.searchResults);
  const AnyConflict = useSelector((state) => state.schedule.showConflict);
  const headingDetails = useSelector((state) => state.schedule.headingDetails);
  const eventNotes = useSelector((state) => state.eventNotes);
  const searchPayload = useSelector((state) => state.schedule.searchPayload);

  // ----------------Date count logic----------------
  const dateCount = useMemo(() => {
    if (!searchPayload?.start_dateList) return 1;

    return searchPayload.start_dateList.split(",").filter(Boolean).length;
  }, [searchPayload]);

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
  // Phase-1 Schedule View
  const [showScheduleTable, setShowScheduleTable] = useState(false);
  const [scheduleRows, setScheduleRows] = useState([]);
  const [scheduleHeading, setScheduleHeading] = useState(null);
  const [scheduleTotal, setScheduleTotal] = useState(0);

  const handleBackToSearch = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/${clientname}/SearchSchedule`);
  };

  useEffect(() => {
    if (showScheduleTable) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [showScheduleTable]);

  // ---------------- Column Definitions ----------------
  const LOCATION_RESULT_COLUMNS = [
    "LOC_ID",
    "LOC_NAME",
    "LOC_DESC",
    "LOC_CAP",
    "LOC_MIN",
    "LOC_RATE",
    "CHARGEPERDAY",
    "CONFLICT",
    "HOLIDAY",
  ];

  const SCHEDULE_RESULT_COLUMNS = [
    "SRNO",
    "STARTDATE",
    "DATEDAY",
    "AVAILABLE",
    "CONFLICT",
    "CONFLICTCUSTOMER",
    "CONFLICTFUNCTION",
    "CONFLICTHOURS",
    "CHARGES",
  ];

  const hasSameColumns = (cols = [], expected = []) => {
    if (!cols || cols.length !== expected.length) return false;

    const colSet = new Set(cols);
    return expected.every((col) => colSet.has(col));
  };

  const resultType = useMemo(() => {
    const cols = searchResults?.COLUMNS;
    if (!cols) return "UNKNOWN";

    if (hasSameColumns(cols, LOCATION_RESULT_COLUMNS)) {
      return "LOCATION";
    }

    if (hasSameColumns(cols, SCHEDULE_RESULT_COLUMNS)) {
      return "SCHEDULE";
    }

    return "UNKNOWN";
  }, [searchResults]);

  // ---------------- Redirect if missing ----------------
  const noData = !searchResults || !searchResults.DATA;

  useEffect(() => {
    if (noData) {
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate(`/${clientname}/SearchSchedule`);
    }
  }, [noData, clientname, navigate]);

  // ---------------- Column Index Helper ----------------
  const colIndex = (name) =>
    searchResults?.COLUMNS ? searchResults.COLUMNS.indexOf(name) : -1;

  // ---------------- Format Results ----------------
  const resultsData = useMemo(() => {
    if (!searchResults || !searchResults.DATA || resultType !== "LOCATION") {
      return [];
    }

    const cols = searchResults.COLUMNS;

    const idx = {
      LOC_ID: cols.indexOf("LOC_ID"),
      CONFLICT: cols.indexOf("CONFLICT"),
      LOC_NAME: cols.indexOf("LOC_NAME"),
      LOC_CAP: cols.indexOf("LOC_CAP"),
      LOC_DESC: cols.indexOf("LOC_DESC"),
      CHARGEPERDAY: cols.indexOf("CHARGEPERDAY"),
    };

    return searchResults.DATA.map((row, i) => {
      const perDayCharge = Number(row[idx.CHARGEPERDAY]) || 0;

      return {
        id: row[idx.LOC_ID] ?? i,
        conflict: (row[idx.CONFLICT] || "").trim(),
        location: row[idx.LOC_NAME] || "",
        capacity: row[idx.LOC_CAP] || "",
        description: row[idx.LOC_DESC] || "",
        perDayCharge,
        charge: perDayCharge * dateCount,
      };
    });
  }, [searchResults, dateCount, resultType]);

  useEffect(() => {
    if (resultType === "SCHEDULE") {
      setShowScheduleTable(true);
      setScheduleRows(searchResults?.DATA || []);
      setScheduleHeading(headingDetails?.DATA?.[0] || null);
    }

    if (resultType === "LOCATION") {
      setScheduleHeading(headingDetails?.DATA?.[0] || null);
    }
  }, [resultType, searchResults, headingDetails]);

  if (resultType === "UNKNOWN") {
    console.warn("Unknown search result columns:", searchResults?.COLUMNS);
  }

  const resultsMap = useMemo(() => {
    const map = {};
    resultsData.forEach((r) => {
      map[String(r.id)] = r;
    });
    return map;
  }, [resultsData]);

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

  const totalCharge = selectedIds.reduce(
    (sum, id) => sum + (resultsMap[id]?.charge || 0),
    0,
  );

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

    // ✅ Layout Options (NEW)
    if (data.layout) {
      Object.entries(data.layout).forEach(([field, value]) => {
        dispatch(updateLayoutField({ field, value }));
      });
    }

    setShowNotesModal(false);
  };

  // ==============================================================
  //                        CONTINUE LOGIC
  // ==============================================================
  const continueDisabled = isAnyConflict
    ? selectedIds.length !== 1 || !eventNotes.functionType?.id
    : selectedIds.length === 0;

  const handleContinue = () => {
    if (continueDisabled) return;

    const updatedPayload = {
      ...searchPayload,
      loclist: selectedIds.join(","),
      function_id: String(eventNotes.functionType?.id || "0"),
    };
    console.log("Updated Payload for Scheduling:", updatedPayload);

    axios
      .post(`${baseURL}schedule/searchSchedules/`, updatedPayload)
      .then(function (response) {
        console.log("Schedule API Response:", response.data);

        setScheduleRows(response.data?.RSSEARCHRESULT?.DATA || []);
        setScheduleHeading(response.data?.RSHEADINGDETAILS?.DATA?.[0] || null);
        setShowScheduleTable(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // ==============================================================
  //                 HANDLE SCHEDULE and SAVE REQUEST
  // ==============================================================
  const handleSchedule = () => {
    if (selectedIds.length === 0) return;
    // navigate(`/${clientname}/ScheduleConfirmation`);
    alert("Schedule logic (to be implemented)");
  };

  const handleSaveRequest = () => {
    if (selectedIds.length === 0) return;
    // navigate(`/${clientname}/ScheduleConfirmation`);
    alert("Save Request logic (to be implemented)");
  };

  // ---------------- DateTime Helpers ----------------

  const getStartDateTime = () => {
    return (
      headingDetails?.DATA?.[0]?.[colIndex("STARTTIME")] ||
      formatDateTime(intervalState.startDate)
    );
  };

  const getEndDateTime = () => {
    return (
      headingDetails?.DATA?.[0]?.[colIndex("ENDTIME")] ||
      formatDateTime(intervalState.endDate)
    );
  };

  // --------------------------- RENDER ---------------------------
  return (
    <div className="searchResultContainer">
      <div className="sr-header">
        <h2>Search Results</h2>
        <div className="sr-header-buttons">
          <button className="modifyBtn button">Modify/Cancel</button>
          <button className="backBtn button" onClick={handleBackToSearch}> 
            Back to Search
          </button>
        </div>
      </div>

      <hr className="sr-divider" />
      {!showScheduleTable && (
        <>
          {/* HEADER */}

          {/* SUB HEADER */}
          <div className="sr-subheader">
            <p>
              <strong>Start Date & Time :</strong>
              {getStartDateTime()}
            </p>
            <p>
              <strong>End Date & Time :</strong>
              {getEndDateTime()}
            </p>
            <p>
              {/* Reoccurring  */}
              <strong>Reoccurring :</strong> {AnyConflict ? "Yes" : "No"}
            </p>
          </div>

          {/* TABLE */}
          <div className="tableWrapper">
            <table className="scheduleTable1">
              <thead>
                <tr>
                  <th scope="col">
                    {!isAnyConflict && (
                      <input
                        type="checkbox"
                        className="searchResultsCheck1"
                        checked={pageAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all schedules on this page"
                      />
                    )}
                    <span>Schedule</span>
                  </th>
                  <th scope="col">Conflict</th>
                  <th scope="col">Location</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Description</th>
                  <th scope="col">Charge</th>
                  <th scope="col" className="text-center">
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
                          aria-label={`Select searchResultsCheck row for ${item.location}`}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          className="searchResultsCheck1"
                          checked={!!selectedRows[item.id]}
                          onChange={() => handleRowSelect(item.id)}
                          aria-label={`Select conflicting location row for ${item.location}`}
                        />
                      )}
                    </td>

                    <td
                      aria-label={
                        item.conflict === "Yes"
                          ? "Conflict exists for this location"
                          : "No conflict"
                      }
                      style={{ color: item.conflict === "Yes" ? "red" : "" }}
                    >
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
                <span className="summaryValue">$ {totalCharge}</span>
              </div>

              <div className="summaryRow">
                <span className="summaryLabel">Estimated Request Charge</span>
                <span className="summaryValue">$ {totalCharge}</span>
              </div>
            </div>
          )}

          {/* --- CONTINUE VALIDATION WARNING --- */}

          {continueDisabled && (
            <div className="continue-warning" role="alert">
              {isAnyConflict && selectedIds.length !== 1 && (
                <p>• Please select exactly one schedule row to continue.</p>
              )}
              {!eventNotes.functionType?.id && (
                <p>• Function Required - Please choose Additions/Notes.</p>
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

            {isAnyConflict ? (
              // 🔘 RADIO BUTTON FLOW
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
            ) : (
              // ☑️ CHECKBOX FLOW
              <>
                <button
                  className="btn continueBtn"
                  disabled={selectedIds.length === 0}
                  onClick={handleSchedule}
                >
                  Schedule
                </button>

                <button
                  className="btn continueBtn"
                  disabled={selectedIds.length === 0}
                  onClick={handleSaveRequest}
                >
                  Save Request
                </button>
              </>
            )}
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
        </>
      )}
      {showScheduleTable && scheduleHeading && (
        <div className="scheduleHeader">
          <div className="scheduleHeaderRow">
            <div className="headerItem">
              <span className="label">Customer :</span>
              <span className="value">{scheduleHeading[0]}</span>
            </div>

            <div className="headerItem">
              <span className="label">Location :</span>
              <span className="value">{scheduleHeading[1]}</span>
            </div>

            <div className="headerItem">
              <span className="label">Start :</span>
              <span className="value">{scheduleHeading[2]}</span>
            </div>

            <div className="headerItem">
              <span className="label">End :</span>
              <span className="value">{scheduleHeading[3]}</span>
            </div>

            <div className="headerItem">
              <span className="label">Hours :</span>
              <span className="value">2.00/day</span>
            </div>
          </div>
        </div>
      )}

      {showScheduleTable && (
        <>
          <div className="scheduleTableSection">
            <ScheduleTable
              rows={scheduleRows}
              baseOverrideCharge={45}
              onTotalChange={(total) => setScheduleTotal(total)}
            />
          </div>
        </>
      )}
    </div>
  );
}
