export const TIMELINE_THREADS = [
  { id: "coodie", label: "COODIE" },
  { id: "chike", label: "CHIKE" },
  { id: "ye", label: "YE" },
  { id: "dropout", label: "COLLEGE DROPOUT" },
  { id: "chicago", label: "CHICAGO" },
  { id: "cc", label: "CREATIVE CONTROL" },
] as const;

export const TIMELINE_START = 1994;
export const TIMELINE_END = 2026;
export const TIMELINE_SPAN = Array.from(
  { length: TIMELINE_END - TIMELINE_START + 1 },
  (_, i) => TIMELINE_START + i,
);

export type TimelinePath = "all" | (typeof TIMELINE_THREADS)[number]["id"];

export type TimelineQuery = {
  through: TimelinePath;
  year: number | null;
  month: number | null;
  day: string | null;
};

const THREAD_IDS = new Set<string>(TIMELINE_THREADS.map((t) => t.id));

function dayKey(year: number, month: number, d: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function parseTimelinePath(raw: string | null): TimelinePath {
  if (raw && THREAD_IDS.has(raw)) return raw as TimelinePath;
  return "all";
}

export function parseTimelineQuery(search: URLSearchParams): TimelineQuery {
  const through = parseTimelinePath(search.get("through"));
  const yearRaw = Number(search.get("year"));
  const year =
    Number.isInteger(yearRaw) && yearRaw >= TIMELINE_START && yearRaw <= TIMELINE_END ? yearRaw : null;

  const monthRaw = search.get("month");
  let month: number | null = null;
  if (monthRaw === "undated" || monthRaw === "0") month = 0;
  else if (monthRaw) {
    const n = Number(monthRaw);
    if (Number.isInteger(n) && n >= 1 && n <= 12) month = n;
  }

  const dayRaw = search.get("day");
  let day: string | null = null;
  if (month === 0 || dayRaw === "undated" || dayRaw === "UNDATED") {
    day = year && month === 0 ? "UNDATED" : dayRaw === "undated" || dayRaw === "UNDATED" ? "UNDATED" : null;
  } else if (dayRaw && year && month && month > 0) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dayRaw)) {
      day = dayRaw;
    } else {
      const n = Number(dayRaw);
      if (Number.isInteger(n) && n >= 1 && n <= daysInMonth(year, month)) day = dayKey(year, month, n);
    }
  }

  if (month === null) day = null;
  if (!year) {
    month = null;
    day = null;
  }

  return { through, year, month, day };
}

export function timelineSearch(query: TimelineQuery, retain?: URLSearchParams) {
  const params = new URLSearchParams();
  const present = retain?.get("present");
  if (present) params.set("present", present);
  if (query.through !== "all") params.set("through", query.through);
  if (query.year) params.set("year", String(query.year));
  if (query.month === 0) params.set("month", "undated");
  else if (query.month) params.set("month", String(query.month));
  if (query.month === 0) {
    /* implied */
  } else if (query.day === "UNDATED") {
    params.set("day", "undated");
  } else if (query.day && query.month) {
    params.set("day", query.day.slice(8));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function timelineHref(query: TimelineQuery, retain?: URLSearchParams) {
  return `/timeline${timelineSearch(query, retain)}`;
}
