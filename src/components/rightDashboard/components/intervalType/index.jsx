import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./index.scss";
import Edit from "../../../../asserts/images/Icons/add.svg";

// Constants
const intervalOptions = ["Weekly", "Monthly", "Recurring"];
const occurrenceOptions = ["First", "Second", "Third", "Fourth", "Last"];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Reusable Components
const Dropdown = ({ options, name, onChange, value }) => (
  <select
    name={name}
    className="custom-select"
    onChange={onChange}
    value={value}
  >
    <option value="">Select value</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const RadioInput = ({ name, label, style, onChange, checked }) => (
  <div className="d-flex align-items-center">
    <input
      type="radio"
      name={name}
      style={{ height: "20px", width: "20px", ...style }}
      onChange={onChange}
      checked={checked}
    />
    <label className="ml-2">{label}</label>
  </div>
);

// Interval Modal Component
const IntervalModal = ({ type, isVisible, onClose }) => {
  if (!isVisible) return null;

  const renderContent = () => {
    switch (type) {
      case "Weekly":
        return (
          <div>
            <div className="row">
              <div className="col-sm-6 mb-2">
                <label>Repeat every</label>
                <input
                  type="number"
                  className="form-control"
                  style={{
                    width: "30%",
                    display: "inline-block",
                    marginLeft: "5px",
                  }}
                />
              </div>
              <div className="col-sm-6">
                <Dropdown options={daysOfWeek} name="days" />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-3"></div>
              <div className="col-sm-6">
                <RadioInput name="onDay" label="On Day" />
                <input
                  type="number"
                  className="form-control"
                  style={{
                    width: "30%",
                    display: "inline-block",
                    marginLeft: "5px",
                  }}
                />
              </div>
              <div className="col-sm-3"></div>
            </div>
          </div>
        );
      case "Monthly":
        return (
          <div>
            <div className="row">
              <div className="col-sm-6">
                <label>Repeat every</label>
                <input
                  type="number"
                  className="form-control"
                  style={{
                    width: "30%",
                    display: "inline-block",
                    marginLeft: "5px",
                  }}
                />
              </div>
              <div className="col-sm-6">
                <label>Month(s)</label>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-5">
                <RadioInput name="monthlyOption" label="On Day" />
                <input
                  type="number"
                  className="form-control"
                  style={{
                    width: "30%",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                />
              </div>
              <div className="col-sm-7">
                <RadioInput name="monthlyOption" label="On the" />
                <Dropdown options={occurrenceOptions} name="occurrence" />
                <Dropdown options={daysOfWeek} name="weekday" />
              </div>
            </div>
          </div>
        );
      case "Recurring":
        return (
          <div>
            <div className="row">
              <div className="col-sm-6">
                <label>Repeat every</label>
                <input
                  type="number"
                  className="form-control"
                  style={{
                    width: "30%",
                    display: "inline-block",
                    marginLeft: "5px",
                  }}
                />
              </div>
              <div className="col-sm-6">
                <Dropdown
                  options={["Day(s)", "Week(s)", "Month(s)", "Year(s)"]}
                  name="interval"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-12">
                <div className="d-flex justify-content-between">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`check${day}`}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`check${day}`}
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={isVisible} onHide={onClose} backdrop={false} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{`${type} Interval Type`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderContent()}</Modal.Body>
      <Modal.Footer>
        <Button className="intervalCloseBtn" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onClose}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Main Component
const IntervalType = () => {
  const [isIntervalTypeModalVisible, setIntervalTypeModalVisible] =
    useState(false);
  const [intervalType, setIntervalType] = useState("");

  const closeIntervalTypeModal = () => setIntervalTypeModalVisible(false);
  const handlePopUpOpen = () => setIntervalTypeModalVisible(true);

  const handleIntervalTypeChange = (e) => {
    setIntervalType(e.target.value);
    setIntervalTypeModalVisible(true);
  };

  return (
    <div>
      <div className="heading">Interval Type</div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="dropdown dropdown-wrapper search keyword">
          <Dropdown
            options={intervalOptions}
            name="intervalType"
            value={intervalType}
            onChange={handleIntervalTypeChange}
          />
        </div>
        <div onClick={handlePopUpOpen}>
          <img src={Edit} alt="edit" width={35} height={35} />
        </div>
      </div>
      <IntervalModal
        type={intervalType}
        isVisible={isIntervalTypeModalVisible}
        onClose={closeIntervalTypeModal}
      />
    </div>
  );
};

export default IntervalType;
