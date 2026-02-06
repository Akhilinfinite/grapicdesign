import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import EventNotesCard from "../eventNotesCard";
import BillingCard from "../billingCard";
// import arrowUp from "../../../asserts/images/Icons/arrow-up.svg";
import settingsIcon from "../../../asserts/images/Icons/settings.svg";
import { useDispatch , useSelector} from "react-redux";
import {
  updateEventField,
  updateEmailOption,
  updateFooterOption,
  updateLayoutField,
} from "../../../redux/slices/eventNotesSlice";

export default function ScheduleTable({
  rows = [],
  baseOverrideCharge = 45,
  onTotalChange,
}) {
  const [overrideMap, setOverrideMap] = useState({});
  const [rowChargeMap, setRowChargeMap] = useState({});
  const [globalCharge, setGlobalCharge] = useState(null);

  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeTarget, setChargeTarget] = useState(null); // "all" | rowIndex
  const [chargeInput, setChargeInput] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const notesCardRef = useRef(null);
  const dispatch = useDispatch();
  const billingItems = useSelector((state) => state.billingItems);

  /* -------------------------------------
   ROW SELECTABLE CHECK (⬅️ MOVE HERE)
-------------------------------------- */
  const isRowSelectable = (row, idx) => {
    const conflict = row?.[4]?.trim();
    const isBooked = conflict === "Booked";
    const isHoliday = conflict === "Holiday";
    const isOverride = !!overrideMap[idx];

    if (isBooked) return false;
    if (isHoliday && !isOverride) return false;

    return true;
  };

  /* -------------------------------------
        OVERRIDE
  -------------------------------------- */
  const handleOverrideToggle = (rowIndex) => {
    setOverrideMap((prev) => {
      const next = { ...prev, [rowIndex]: !prev[rowIndex] };

      // If override turned OFF, remove selection
      if (prev[rowIndex]) {
        setSelectedRows((sel) => {
          const updated = { ...sel };
          delete updated[rowIndex];
          return updated;
        });
      }

      return next;
    });
  };

  /* -------------------------------------
        CHARGE MODALS
  -------------------------------------- */
  const openRowChargeModal = (rowIndex, currentCharge) => {
    setChargeTarget(rowIndex);
    setChargeInput(currentCharge ?? "");
    setShowChargeModal(true);
  };

  const openGlobalChargeModal = () => {
    setChargeTarget("all");
    setChargeInput("");
    setShowChargeModal(true);
  };

  const handleChargeSave = () => {
    const value = parseFloat(chargeInput);
    if (isNaN(value)) return;

    if (chargeTarget === "all") {
      setGlobalCharge(value);
      setRowChargeMap({});
    } else {
      setRowChargeMap((prev) => ({
        ...prev,
        [chargeTarget]: value,
      }));
    }

    setShowChargeModal(false);
  };
  /* -------------------------------------
        SAVE NOTES
  -------------------------------------- */
  const handleNotesSave = () => {
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

  const handleNotesCancel = () => {
    notesCardRef.current?.cancelNotes();
    setShowNotesModal(false);
  };

  /* -------------------------------------
        TOTAL CALCULATION
  -------------------------------------- */
  const totalCharges = rows.reduce((sum, row, idx) => {
    const conflict = row?.[4]?.trim();
    const apiCharge = row?.[8];

    const isHoliday = conflict === "Holiday";
    const isBooked = conflict === "Booked";
    const isOverride = !!overrideMap[idx];

    let charge = null;

    if (isHoliday && !isOverride) {
      charge = null;
    } else if (rowChargeMap[idx] != null) {
      charge = rowChargeMap[idx];
    } else if (globalCharge != null && !isBooked) {
      charge = globalCharge;
    } else if (isHoliday && isOverride) {
      charge = baseOverrideCharge;
    } else if (!isHoliday && apiCharge != null) {
      charge = parseFloat(apiCharge);
    }

    return charge != null ? sum + charge : sum;
  }, 0);

  useEffect(() => {
    onTotalChange?.(totalCharges);
  }, [totalCharges, onTotalChange]);

  const hasBookedConflict = rows.some((row) => row?.[4]?.trim() === "Booked");

  // skip all dates functionality
  const handleSelectAll = () => {
    if (!hasSelectableRows) return;

    const allSelected = selectableIndexes.every((idx) => selectedRows[idx]);

    if (allSelected) {
      setSelectedRows({});
    } else {
      const updated = {};
      selectableIndexes.forEach((idx) => {
        updated[idx] = true;
      });
      setSelectedRows(updated);
    }
  };

  const selectableIndexes = rows
    .map((row, idx) => ({ row, idx }))
    .filter(({ row, idx }) => isRowSelectable(row, idx))
    .map(({ idx }) => idx);

  const allRowsSelected =
    selectableIndexes.length > 0 &&
    selectableIndexes.every((idx) => selectedRows[idx]);

  const hasSelectableRows = selectableIndexes.length > 0;

  /* -------------------------------------
        RENDER
  -------------------------------------- */
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped scheduleTable">
          <thead className="tableHeader">
            <tr>
              <th className="skipDateCol">
                <div className="skipHeader">
                  <input
                    type="checkbox"
                    className="skipCheckbox"
                    checked={allRowsSelected}
                    disabled={!hasSelectableRows}
                    onChange={handleSelectAll}
                  />
                  <span>Skip Date</span>
                </div>
              </th>
              <th>Date</th>
              <th>Available?</th>
              <th>Conflict</th>
              <th>Conflict Customer</th>
              <th>Conflict Function</th>
              <th>Conflict Hours</th>
              <th>Override</th>
              <th
                className="chargeHeader"
                onClick={() => !hasBookedConflict && openGlobalChargeModal()}
              >
                Charge
                <button className="tableSettingBtn">
                  <img src={settingsIcon} alt="" />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => {
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

              const conflict = CONFLICT?.trim();
              const available = AVAILABLE?.trim();

              const isHoliday = conflict === "Holiday";
              const isBooked = conflict === "Booked";
              const isOverride = !!overrideMap[idx];

              const displayAvailable =
                isHoliday && isOverride ? "Yes" : available;

              let finalCharge = null;

              if (isHoliday && !isOverride) {
                finalCharge = null;
              } else if (rowChargeMap[idx] != null) {
                finalCharge = rowChargeMap[idx];
              } else if (globalCharge != null && !isBooked) {
                finalCharge = globalCharge;
              } else if (isHoliday && isOverride) {
                finalCharge = baseOverrideCharge;
              } else if (!isHoliday && CHARGES != null) {
                finalCharge = parseFloat(CHARGES);
              }

              return (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      disabled={!isRowSelectable(row, idx)}
                      checked={!!selectedRows[idx]}
                      onChange={() =>
                        setSelectedRows((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }))
                      }
                    />
                  </td>
                  <td>{DATEDAY}</td>
                  <td>{displayAvailable}</td>
                  <td
                    className={conflict !== "None" ? "text-danger fw-bold" : ""}
                  >
                    {conflict}
                  </td>
                  <td>{CONFLICTCUSTOMER || "---"}</td>
                  <td>{CONFLICTFUNCTION || "---"}</td>
                  <td>{CONFLICTHOURS || "---"}</td>
                  <td className="text-center">
                    {isHoliday ? (
                      <input
                        type="checkbox"
                        checked={isOverride}
                        onChange={() => handleOverrideToggle(idx)}
                      />
                    ) : (
                      "---"
                    )}
                  </td>
                  <td
                    onClick={() =>
                      finalCharge != null &&
                      openRowChargeModal(idx, finalCharge)
                    }
                    style={{ cursor: finalCharge ? "pointer" : "not-allowed" }}
                  >
                    {finalCharge != null
                      ? `$ ${finalCharge.toFixed(2)}`
                      : "---"}
                  </td>
                </tr>
              );
            })}

            <tr>
              <td colSpan="8" className="estimated_Charge">
                Estimated Facility Charge
              </td>
              <td>{`$ ${totalCharges.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td colSpan="8" className="estimated_Charge">
                Estimated Request Charge
              </td>
              <td>{`$ ${totalCharges.toFixed(2)}`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="scheduleActionBar">
        <button
          className="btn additionBtn"
          disabled={!hasSelectableRows}
          onClick={() => setShowBillingModal(true)}
        >
          Billing Items
        </button>

        <button
          className="btn additionBtn"
          disabled={!hasSelectableRows}
          onClick={() => setShowNotesModal(true)}
        >
          Addition/Notes
        </button>
        {!hasSelectableRows ? (
          <button className="btn blueBtn">Continue</button>
        ) : (
          <>
            <button className="btn blueBtn">Schedule</button>

            <button className="btn printBtn">Print</button>

            <button className="btn blueBtn">Save Request</button>
          </>
        )}
      </div>

      {/* CHARGE MODAL */}
      <Modal show={showChargeModal} onHide={() => setShowChargeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            className="form-control"
            value={chargeInput}
            onChange={(e) => setChargeInput(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowChargeModal(false)}>Cancel</Button>
          <Button onClick={handleChargeSave}>OK</Button>
        </Modal.Footer>
      </Modal>
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
    </>
  );
}
