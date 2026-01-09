import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./index.scss";

const ScheduleRequest = () => {
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("Pending (External)");
  const [showZeroContracts, setShowZeroContracts] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", searchText);
  };

  return (
    <div className="schedule-request-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h2 className="title">Schedule Request</h2>
        <button className="back-btn">Back to Search</button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Left side */}
        <div className="filter-left">
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Pending (External)</option>
            <option>Pending (Internal)</option>
            <option>Denied</option>
            <option>Pending Insurance</option>
            <option>Hold</option>
            <option>Send Contract</option>
            <option>Contract Sent</option>
            <option>Invoice Sent</option>
            <option>Contract Signed</option>
            <option>All</option>
          </select>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
            <button
              className="search-btn"
              onClick={handleSearch}
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="filter-right">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showZeroContracts}
              onChange={() => setShowZeroContracts(!showZeroContracts)}
            />
            <span>Display $0 Contracts</span>
          </label>
          <button className="action-btn">Change Status</button>
          <button className="action-btn">Change Scheduler</button>
        </div>
      </div>

      <Modal
        backdrop={false}
        keyboard={true}
        role="dialog"
        aria-labelledby="back_to_search_modal_title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="back_to_search_modal_title">
            Assign Location to Req
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h6 class="assignedLocation_2">
              Create new or assign to existing Event
            </h6>
          </div>
          <div class="row">
            <label class="assignedLocation_3">Event</label>

            <div class="col-md-6 assignedLocation_5">
              <select class="assignedLocation_4">
                <option value="" disabled="" selected="" hidden="">
                  select request type
                </option>
                <option>District</option>
                <option>Quadrant</option>
                <option>School</option>
                <option>Floor</option>
                <option>Room</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="intervalCloseBtn">Back to Search</Button>
          <Button className="intervalCloseBtn">Close</Button>
          <Button variant="primary">Assign</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ScheduleRequest;
