import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomCalendar = ({ selectedDates, setSelectedDates }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleMonthChange = (e) =>
    setCurrentMonth(parseInt(e.target.value, 10));
  const handleYearChange = (e) => setCurrentYear(parseInt(e.target.value, 10));

  const handleDateClick = (day) => {
    const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter((date) => date !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString]);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    let days = [];

    // Fill empty cells before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <td
          key={`empty-${i}`}
          className="border"
          style={{ width: "14.28%" }}
        ></td>
      );
    }

    // Add the actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
      days.push(
        <td
          key={day}
          className={`text-center border fw-bold ${
            selectedDates.includes(dateString) ? "bg-primary text-white" : ""
          }`}
          onClick={() => handleDateClick(day)}
          style={{ cursor: "pointer", width: "15.5%", padding: "4px" }}
        >
          {day}
        </td>
      );
    }

    let rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
    }

    return rows;
  };

  return (
    <div
      className="card px-3 py-3 shadow-sm"
      style={{ width: "100%", maxWidth: "350px" }}
    >
      <div className="d-flex justify-content-center align-items-center mb-2">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="form-select w-55 text-center"
          style={{ fontSize: "12px" }}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={currentYear}
          onChange={handleYearChange}
          className="form-select w-45 text-center ms-2"
          style={{ fontSize: "12px" }}
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>
      <table
        className="table table-bordered text-center m-0"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <thead>
          <tr>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <th
                key={index}
                className="text-center bg-light"
                style={{ width: "14.28%", padding: "8px" }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </table>
      <div className="text-center mt-2 border-top pt-2 fw-bold">
        Today: {today.toDateString()}
      </div>
    </div>
  );
};

export default CustomCalendar;
