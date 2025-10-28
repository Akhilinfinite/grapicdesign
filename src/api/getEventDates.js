// Time conversion: "hh:mm AM/PM" → 24-hour format
function convertTo24Hour(timeStr) {
  if (!timeStr || typeof timeStr !== "string") {
    console.warn("Invalid time string:", timeStr);
    return "00:00";
  }

  const parts = timeStr.trim().split(" ");
  const time = parts[0];
  const modifier = parts[1] ? parts[1].toUpperCase() : null;

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);

  if (modifier) {
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes || "00"}`;
}

// ✅ Safe formatter for start datetime → ISO UTC
function formatDateForstart(isoStr) {
  if (!isoStr || !isoStr.start) return null;

  const [datePart, timePart] = isoStr.start.split(" ");
  if (!datePart || !timePart) {
    console.error("Invalid start datetime:", isoStr.start);
    return null;
  }

  // Detect format: MM/DD/YYYY → convert to YYYY-MM-DD
  const [p1, p2, p3] = datePart.split(/[/,-]/);
  const formattedDate = datePart.includes("/")
    ? `${p3}-${p1.padStart(2, "0")}-${p2.padStart(2, "0")}`
    : datePart;

  return `${formattedDate}T${timePart}:00.000Z`;
}

// ✅ Safe formatter for end datetime → ISO UTC
function formatDateForend(isoStr) {
  if (!isoStr || !isoStr.end) return null;

  const [datePart, timePart] = isoStr.end.split(" ");
  if (!datePart || !timePart) {
    console.error("Invalid end datetime:", isoStr.end);
    return null;
  }

  // Detect format: MM/DD/YYYY → convert to YYYY-MM-DD
  const [p1, p2, p3] = datePart.split(/[/,-]/);
  const formattedDate = datePart.includes("/")
    ? `${p3}-${p1.padStart(2, "0")}-${p2.padStart(2, "0")}`
    : datePart;

  return `${formattedDate}T${timePart}:00.000Z`;
}

// Main generator switch
export const generateDates = (params) => {
  let result = [];

  switch (params.type) {
    case "single":
      result = generateSingleDates(params);
      break;
    case "weekly":
      result = generateWeeklyDates(params);
      break;
    case "monthly":
      result = generateMonthlyDates(params);
      break;
    case "random":
      result = generateRandomDates(params);
      break;
    default:
      throw new Error("Unknown recurrence type");
  }

  // ✅ Sort ascending order for consistency
  if (Array.isArray(result)) {
    result.sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  return result;
};

// Single Date
function generateSingleDates({ startDate, endDate, startTime, endTime }) {
  const sTime24 = convertTo24Hour(startTime);
  const eTime24 = convertTo24Hour(endTime);

  const sDateTime = `${startDate} ${sTime24}`;
  const eDateTime = `${endDate} ${eTime24}`;

  return [
    {
      start: formatDateForstart({ start: sDateTime }),
      end: formatDateForend({ end: eDateTime }),
    },
  ];
}

// Weekly Recurrence
function generateWeeklyDates({
  startDate,
  endDate,
  startTime,
  endTime,
  days,
  durationWeeks,
  everyXWeeks,
}) {
  const results = [];
  const sTime24 = convertTo24Hour(startTime);
  const eTime24 = convertTo24Hour(endTime);

  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + durationWeeks * 7);

  // Handle days as array or comma-separated string
  const selectedDays = Array.isArray(days)
    ? days.map(Number)
    : typeof days === "string" && days.length
    ? days.split(",").map(Number)
    : [];

  for (let week = 0; week < durationWeeks; week += everyXWeeks) {
    const baseWeek = new Date(start);
    baseWeek.setDate(baseWeek.getDate() + week * 7);

    for (const d of selectedDays) {
      const temp = new Date(baseWeek);
      const diff = (d - temp.getDay() + 7) % 7;
      temp.setDate(temp.getDate() + diff);

      if (temp > end) continue;

      const dateStr = temp.toISOString().split("T")[0];

      const entry = {
        start: `${dateStr} ${sTime24}`,
        end: `${dateStr} ${eTime24}`,
      };

      results.push({
        start: formatDateForstart({ start: entry.start }),
        end: formatDateForend({ end: entry.end }),
      });
    }
  }

  results.sort((a, b) => new Date(a.start) - new Date(b.start));
  return results;
}

// Monthly Recurrence
function generateMonthlyDates({
  startDate,
  startTime,
  endTime,
  repeatEvery,
  mode,
  dayNumber,
  weekNumber,
  weekDay,
}) {
  const results = [];
  const sTime24 = convertTo24Hour(startTime);
  const eTime24 = convertTo24Hour(endTime);
  const baseDate = new Date(startDate);

  for (let i = 0; i < repeatEvery; i++) {
    const monthDate = new Date(baseDate);
    monthDate.setMonth(baseDate.getMonth() + i);
    let eventDate;

    if (mode === "daynumber") {
      eventDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        dayNumber
      );
    } else if (mode === "weekday") {
      const firstDay = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const offset = (weekDay - firstDay.getDay() + 7) % 7;
      eventDate = new Date(firstDay);
      eventDate.setDate(1 + offset + (weekNumber - 1) * 7);
    }

    if (eventDate && !isNaN(eventDate.getTime())) {
      const dateStr = eventDate.toISOString().split("T")[0];

      const entry = {
        start: `${dateStr} ${sTime24}`,
        end: `${dateStr} ${eTime24}`,
      };

      results.push({
        start: formatDateForstart({ start: entry.start }),
        end: formatDateForend({ end: entry.end }),
      });
    }
  }

  results.sort((a, b) => new Date(a.start) - new Date(b.start));
  return results;
}

// Random Dates
function generateRandomDates({ randomDates, startTime, endTime }) {
  const sTime24 = convertTo24Hour(startTime);
  const eTime24 = convertTo24Hour(endTime);

  const results = randomDates
    .map((dateStr) => {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj)) {
        console.error("Invalid random date:", dateStr);
        return null;
      }

      // Convert to YYYY-MM-DD for consistent ISO
      const formattedDate = dateObj.toISOString().split("T")[0];

      const entry = {
        start: `${formattedDate} ${sTime24}`,
        end: `${formattedDate} ${eTime24}`,
      };

      return {
        start: formatDateForstart({ start: entry.start }),
        end: formatDateForend({ end: entry.end }),
      };
    })
    .filter(Boolean);

  results.sort((a, b) => new Date(a.start) - new Date(b.start));
  return results;
}
