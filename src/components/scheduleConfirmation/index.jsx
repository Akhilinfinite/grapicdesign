import "./index.scss";
import { useEffect } from "react";

import attachmentIcon from "../../asserts/images/Icons/attachment-check.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScheduleTable from "../internalComponents/scheduleTable";

export default function ScheduleConfirmation() {
  // CORRECT DATA SOURCE FROM REDUX
  const searchResults = useSelector((state) => state.schedule.searchResults);
  const headingDetails = useSelector((state) => state.schedule.headingDetails);

  const notes = useSelector((state) => state.eventNotes);
  const navigate = useNavigate();
  const reduxClient = useSelector((state) => state.client.clientname);
  const clientname = reduxClient || localStorage.getItem("clientname");

  // const dispatch = useDispatch();

    const handleBackToSearch = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/${clientname}/SearchSchedule`);
  };

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

  const continueDisabled = !notes.functionType?.id;

  const hasBookedConflict = tableRows.some(
    (row) => String(row?.[4] ?? "").trim() === "Booked"
  );
  return (
    <div className="scheduleConfirmationContainer">
      {/* Header */}
      <div className="headerRow">
        <h2 className="pageTitle">Schedule Confirmation</h2>
        <button type="button" className="backBtn button" onClick={handleBackToSearch}>
          Back to Search
        </button>
      </div>

      {/* Sub Header */}
      <div className="detailsHeaderRow">
        <h3 className="detailsTitle">Request Number - &gt; Schedule Details</h3>

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
        <ScheduleTable
          rows={tableRows}
          baseOverrideCharge={45}
          hasBookedConflict={hasBookedConflict}
        />

        {continueDisabled && (
          <div className="continue-warning">
            {!notes.functionType?.id && (
              <p>
                • Function is required. Open Addition/Notes and select a
                function.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
