import React, { useState, useEffect, useRef } from "react";
import "./index.scss";

const CustomDateTimePicker = ({ id, value, onChange, interval }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const pickerRef = useRef(null);

  // When value changes, update selected date & time
  useEffect(() => {
    if (value) {
      const date = new Date(value); // UTC date
      setSelectedDate(date);

      const utcHours = date.getUTCHours();
      setHour((utcHours % 12 || 12).toString().padStart(2, "0"));
      setMinute(date.getUTCMinutes().toString().padStart(2, "0"));
      setAmpm(utcHours >= 12 ? "PM" : "AM");
    }
  }, [value]);

  const handleInputClick = () => setIsOpen(true);
  const handleBlur = (e) => {
    if (!pickerRef.current.contains(e.relatedTarget)) setIsOpen(false);
  };

  // Handles date selection
  const handleDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setUTCDate(day);
    handleDateTimeChange(newDate, hour, minute, ampm);
  };

  // Handles time selection
  const handleTimeChange = (type, value) => {
    let newHour = hour,
      newMinute = minute,
      newAmpm = ampm;

    if (type === "hour") newHour = value;
    if (type === "minute") newMinute = value;
    if (type === "ampm") newAmpm = value;

    handleDateTimeChange(selectedDate, newHour, newMinute, newAmpm);
  };

  // Update date-time selection and convert to UTC
  const handleDateTimeChange = (date, hour, minute, ampm) => {
    const utcHours = ampm === "AM" ? parseInt(hour) % 12 : (parseInt(hour) % 12) + 12;
    const newDate = new Date(date);
    newDate.setUTCHours(utcHours, parseInt(minute), 0, 0);

    setSelectedDate(newDate);
    onChange(newDate.toISOString()); // ✅ Pass UTC value
  };

  // Format UTC time in 12-hour format
  const formatDateTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(new Date(date));
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1);
    const endOfMonth = new Date(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth() + 1, 0);
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const emptyDays = Array(startOfMonth.getUTCDay()).fill(null);

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <label htmlFor="monthSelect" className="sr-only">Select Month</label>
          <select
            id="monthSelect"
            value={selectedDate.getUTCMonth()}
            onChange={(e) => setSelectedDate(new Date(selectedDate.setUTCMonth(e.target.value)))}
            aria-label="Select Month"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <label htmlFor="yearSelect" className="sr-only">Select Year</label>
          <select
            id="yearSelect"
            value={selectedDate.getUTCFullYear()}
            onChange={(e) => setSelectedDate(new Date(selectedDate.setUTCFullYear(e.target.value)))}
            aria-label="Select Year"
          >
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={selectedDate.getUTCFullYear() - 50 + i}>
                {selectedDate.getUTCFullYear() - 50 + i}
              </option>
            ))}
          </select>
        </div>

        <div className="weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day"></div>
          ))}
          {Array.from({ length: endOfMonth.getUTCDate() }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              className={`calendar-day ${selectedDate.getUTCDate() === day ? "selected" : ""}`}
              onClick={() => handleDateClick(day)}
              aria-label={`Select ${day}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTime = () => {
    return (
      <div className="time-container">
        <label htmlFor="ampmSelect" className="sr-only">Select AM or PM</label>
        <select
          id="ampmSelect"
          value={ampm}
          onChange={(e) => handleTimeChange("ampm", e.target.value)}
          aria-label="Select AM or PM"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>

        <div className="time-body">
          <div className="time-section">
            <label htmlFor="hourSelect" className="sr-only">Select Hour</label>
            <select
              id="hourSelect"
              value={hour}
              onChange={(e) => handleTimeChange("hour", e.target.value)}
              aria-label="Select Hour"
            >
              {Array.from({ length: 12 }, (_, i) =>
                (i + 1).toString().padStart(2, "0")
              ).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div className="time-section">
            <label htmlFor="minuteSelect" className="sr-only">Select Minute</label>
            <select
              id="minuteSelect"
              value={minute}
              onChange={(e) => handleTimeChange("minute", e.target.value)}
              aria-label="Select Minute"
            >
              {Array.from({ length: 60 }, (_, i) => i % interval === 0 ? i.toString().padStart(2, "0") : null)
                .filter(Boolean)
                .map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="custom-date-time-picker" ref={pickerRef} tabIndex={-1} onBlur={handleBlur}>
      <input
        id={id}
        type="text"
        className="date-time-input"
        value={formatDateTime(selectedDate)}
        onClick={handleInputClick}
        readOnly
        aria-label="Date and Time Picker"
      />

      {isOpen && (
        <div className="date-time-picker-popup">
          <div className="calendar-time-container">
            {renderCalendar()}
            {renderTime()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
