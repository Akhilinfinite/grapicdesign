import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.scss";
import CalendarIcon from "../../../../asserts/images/Icons/calendar-blank.svg";

const DateTimePicker = ({ selectedDate, handleDateChange }) => {
  return (
    <div className="datetime-picker-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="yyyy-MM-dd HH:mm"
        timeFormat="HH:mm"
        timeIntervals={15}
        className="form-control"
        style={{
          height: "40px",
          fontSize: "16px",
          padding: "5px",
        }}
      />
      <img src={CalendarIcon} alt="Calendar" className="calendar-icon" />
    </div>
  );
};

export default DateTimePicker;
