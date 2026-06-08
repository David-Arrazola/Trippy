const DEFAULT_LEAD_DAYS = 30;
const DEFAULT_TRIP_DURATION_DAYS = 7;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value) {
  if (!value || typeof value !== "string") return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return formatDate(date);
}

function parseReferenceDate(referenceDate) {
  const parsed = parseIsoDate(referenceDate);
  if (parsed) {
    const [year, month, day] = parsed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date();
}

function addDays(dateStr, days) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function daysBetween(startDate, endDate) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  return Math.max(
    1,
    Math.round((end - start) / (1000 * 60 * 60 * 24)),
  );
}

/**
 * Ensures tripData has usable startDate/returnDate for SerpAPI searches.
 * - Relative phrases should already be converted to YYYY-MM-DD during extraction.
 * - Missing start date defaults to reference date + 1 month.
 * - Missing return date defaults to start + duration (or 7 days).
 */
function resolveTripDates(tripData, referenceDate) {
  const today = formatDate(parseReferenceDate(referenceDate));

  let startDate = parseIsoDate(tripData.startDate);
  let returnDate = parseIsoDate(tripData.returnDate);
  let duration =
    typeof tripData.duration === "number" && tripData.duration > 0
      ? tripData.duration
      : null;

  if (!startDate && !returnDate) {
    startDate = addDays(today, DEFAULT_LEAD_DAYS);
    const tripLength = duration ?? DEFAULT_TRIP_DURATION_DAYS;
    returnDate = addDays(startDate, tripLength);
    duration = tripLength;
  } else if (startDate && !returnDate) {
    const tripLength = duration ?? DEFAULT_TRIP_DURATION_DAYS;
    returnDate = addDays(startDate, tripLength);
    duration = tripLength;
  } else if (!startDate && returnDate) {
    const tripLength = duration ?? DEFAULT_TRIP_DURATION_DAYS;
    startDate = addDays(returnDate, -tripLength);
    duration = tripLength;
  } else if (!duration) {
    duration = daysBetween(startDate, returnDate);
  }

  return {
    ...tripData,
    startDate,
    returnDate,
    duration,
  };
}

export default resolveTripDates;
