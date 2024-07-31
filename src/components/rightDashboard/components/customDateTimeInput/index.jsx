import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

const CustomDateTimePicker = ({ value, onChange, interval }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const pickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      const hours = date.getHours();
      setHour((hours % 12 || 12).toString().padStart(2, '0'));
      setMinute(date.getMinutes().toString().padStart(2, '0'));
      setAmpm(hours >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleBlur = (e) => {
    if (!pickerRef.current.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const handleDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    handleDateTimeChange(newDate, hour, minute, ampm);
  };

  const handleTimeChange = (type, value) => {
    let newHour = hour;
    let newMinute = minute;
    let newAmpm = ampm;

    if (type === 'hour') {
      newHour = value;
      setHour(value);
    } else if (type === 'minute') {
      newMinute = value;
      setMinute(value);
    } else if (type === 'ampm') {
      newAmpm = value;
      setAmpm(value);
    }

    handleDateTimeChange(selectedDate, newHour, newMinute, newAmpm);
  };

  const handleDateTimeChange = (date, hour, minute, ampm) => {
    const hours = ampm === 'AM' ? parseInt(hour) % 12 : (parseInt(hour) % 12) + 12;
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(parseInt(minute));
    onChange(newDate.toISOString());
  };

  const handleClear = () => {
    const now = new Date();
    setSelectedDate(now);
    const currentHour = now.getHours() % 12 || 12;
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentAmpm = now.getHours() >= 12 ? 'PM' : 'AM';

    setHour(currentHour.toString());
    setMinute(currentMinute);
    setAmpm(currentAmpm);

    handleDateTimeChange(now, currentHour.toString(), currentMinute, currentAmpm);
  };

  const handleToday = () => {
    const now = new Date();
    setSelectedDate(now);
    const currentHour = now.getHours() % 12 || 12;
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentAmpm = now.getHours() >= 12 ? 'PM' : 'AM';

    setHour(currentHour.toString());
    setMinute(currentMinute);
    setAmpm(currentAmpm);

    handleDateTimeChange(now, currentHour.toString(), currentMinute, currentAmpm);
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(e.target.value);
    setSelectedDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(e.target.value);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const daysInMonth = [];
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      daysInMonth.push(i);
    }
    const firstDayIndex = startOfMonth.getDay();
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const emptyDays = Array(firstDayIndex).fill(null);

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <select value={selectedDate.getMonth()} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={selectedDate.getFullYear()} onChange={handleYearChange}>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={selectedDate.getFullYear() - 50 + i}>
                {selectedDate.getFullYear() - 50 + i}
              </option>
            ))}
          </select>
        </div>
        <div className="weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day"></div>
          ))}
          {daysInMonth.map((day) => (
            <div
              key={day}
              className={`calendar-day ${
                selectedDate.getDate() === day ? 'selected' : ''
              } ${
                new Date().getDate() === day &&
                new Date().getMonth() === selectedDate.getMonth() &&
                new Date().getFullYear() === selectedDate.getFullYear()
                  ? 'today'
                  : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-buttons">
          <button className="link-button" onClick={handleToday}>Today</button>
          <button className="link-button" onClick={handleClear}>Clear</button>
        </div>
      </div>
    );
  };

  const renderTime = () => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => (i % interval === 0 ? i.toString().padStart(2, '0') : null)).filter(Boolean);

    return (
      <div className="time-container">
        <div className="time-header">
          <select value={ampm} onChange={(e) => handleTimeChange('ampm', e.target.value)}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <div className="time-body">
          <div className="time-section">
            <div className="time-label">Hr</div>
            <div className="time-list">
              {hours.map((h) => (
                <div
                  key={h}
                  className={`time-item ${h === hour ? 'selected' : ''}`}
                  onClick={() => handleTimeChange('hour', h)}
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
          <div className="time-section">
            <div className="time-label">Mn</div>
            <div className="time-list">
              {minutes.map((m) => (
                <div
                  key={m}
                  className={`time-item ${m === minute ? 'selected' : ''}`}
                  onClick={() => handleTimeChange('minute', m)}
                >
                  {m} 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="custom-date-time-picker" ref={pickerRef} tabIndex={-1} onBlur={handleBlur}>
      <input
        type="text"
        className="date-time-input"
        value={selectedDate.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
        onClick={handleInputClick}
        readOnly
      />
      {isOpen && (
        <div className="date-time-picker-popup">
          <div className="calendar-time-container">
            <div className="calendar-part">{renderCalendar()}</div>
            <div className="time-part">{renderTime()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
