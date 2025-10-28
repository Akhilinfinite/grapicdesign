// dateUtils.js

// -----------------------------
// ✅ Basic Converters & Formatters
// -----------------------------

// Convert “hh:mm AM/PM” → “HH:mm:ss”
export function convertTo24Hour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "00:00:00";

  const [time, modifier] = timeStr.trim().split(" ");
  if (!time) return "00:00:00";

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);

  if (modifier) {
    const upper = modifier.toUpperCase();
    if (upper === "PM" && hours !== 12) hours += 12;
    if (upper === "AM" && hours === 12) hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes || "00"}:00`;
}

// Convert “YYYY-MM-DD HH:mm” → ISO UTC string
export function formatToUTCISO(dateTimeStr) {
  if (!dateTimeStr || typeof dateTimeStr !== "string") return null;
  const [datePart, timePart] = dateTimeStr.split(" ");
  if (!datePart || !timePart) return null;

  return `${datePart}T${timePart}:00.000Z`;
}

// Convert ISO date → “MM/DD/YYYY”
export function formatDateMMDDYYYY(isoStr) {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// Convert ISO date → “HH:MM”
export function formatTimeHHMM(isoStr) {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  return date.toISOString().substr(11, 5);
}

// -----------------------------
// ✅ Mapping Helpers
// -----------------------------

export const getDayNumber = (dayName) => {
  const map = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };
  return map[dayName];
};

export const getMonthPartNumber = (part) => {
  const map = { First: 1, Second: 2, Third: 3, Fourth: 4, Last: 5 };
  return map[part] || 0;
};
