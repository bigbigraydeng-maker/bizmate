/**
 * NZ working-day helpers: weekends + national public holidays (incl. Mondayisation).
 * Used for PAYE filing due dates, annual return due dates, etc.
 */

import {
  addDays,
  format,
  getDay,
  getDaysInMonth,
  startOfDay,
} from "date-fns";

const DATE_KEY = "yyyy-MM-dd";

export function formatDateKey(d: Date): string {
  return format(d, DATE_KEY);
}

/** Mondayise: if weekend, move to following Monday (NZ Holidays Act style for some holidays). */
function mondayise(date: Date): Date {
  const dow = getDay(date);
  if (dow === 0) return addDays(date, 1);
  if (dow === 6) return addDays(date, 2);
  return date;
}

/** Easter Sunday (Gregorian) — Anonymous Gregorian algorithm. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Matariki (public holiday Friday) — fixed dates per MBIE announcements. */
function matarikiFriday(year: number): Date {
  const table: Record<number, string> = {
    2025: "2025-06-20",
    2026: "2026-06-19",
    2027: "2027-07-09",
    2028: "2028-07-14",
    2029: "2029-06-28",
    2030: "2030-07-11",
  };
  const iso = table[year];
  if (iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  // Fallback: late June Friday (illustrative only)
  return new Date(year, 5, 20);
}

function firstMondayInJune(year: number): Date {
  const june1 = new Date(year, 5, 1);
  const dow = getDay(june1);
  return addDays(june1, (8 - dow) % 7);
}

function fourthMondayInOctober(year: number): Date {
  let d = 1;
  let mondays = 0;
  while (mondays < 4) {
    const dt = new Date(year, 9, d);
    if (getDay(dt) === 1) mondays++;
    if (mondays === 4) return dt;
    d++;
  }
  return new Date(year, 9, 22);
}

/**
 * All NZ national public holidays for a calendar year (observed dates).
 */
export function getNzPublicHolidayDates(year: number): Set<string> {
  const set = new Set<string>();
  const add = (d: Date) => set.add(formatDateKey(startOfDay(d)));

  add(mondayise(new Date(year, 0, 1)));
  add(mondayise(new Date(year, 0, 2)));

  add(mondayise(new Date(year, 1, 6)));

  const e = easterSunday(year);
  add(addDays(e, -2));
  add(addDays(e, 1));

  add(mondayise(new Date(year, 3, 25)));

  add(firstMondayInJune(year));
  add(matarikiFriday(year));
  add(fourthMondayInOctober(year));

  add(mondayise(new Date(year, 11, 25)));
  add(mondayise(new Date(year, 11, 26)));

  return set;
}

const holidayCache = new Map<number, Set<string>>();

export function isNzPublicHoliday(d: Date): boolean {
  const y = d.getFullYear();
  let set = holidayCache.get(y);
  if (!set) {
    set = getNzPublicHolidayDates(y);
    holidayCache.set(y, set);
  }
  return set.has(formatDateKey(startOfDay(d)));
}

export function isWeekend(d: Date): boolean {
  const dow = getDay(d);
  return dow === 0 || dow === 6;
}

export function isWorkingDay(d: Date): boolean {
  return !isWeekend(d) && !isNzPublicHoliday(d);
}

/**
 * The date that is `n` NZ working days after `start`, counting only forward from the day after `start`
 * (exclusive of `start`). Used for PAYE payday filing (due 2 working days after payday).
 */
export function addNzWorkingDaysAfter(start: Date, workingDays: number): Date {
  let d = startOfDay(start);
  let remaining = workingDays;
  d = addDays(d, 1);
  while (remaining > 0) {
    if (isWorkingDay(d)) remaining--;
    if (remaining > 0) d = addDays(d, 1);
  }
  return d;
}

/**
 * Due date = `workingDays` working days after `eventDate`, counting from the first day strictly after `eventDate`.
 * Used for "20 working days after incorporation/balance anniversary" (Companies Office style).
 */
export function addNzWorkingDaysAfterEvent(eventDate: Date, workingDays: number): Date {
  let d = startOfDay(eventDate);
  let remaining = workingDays;
  d = addDays(d, 1);
  while (remaining > 0) {
    if (isWorkingDay(d)) remaining--;
    if (remaining > 0) d = addDays(d, 1);
  }
  return d;
}

/** Last calendar day of month containing `d`. */
export function lastDayOfMonth(d: Date): Date {
  const y = d.getFullYear();
  const m = d.getMonth();
  return new Date(y, m, getDaysInMonth(d));
}

/** Mid-month and month-end paydays (15th and last day). */
export function getMonthPaydaysInRange(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  let cur = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = startOfDay(to);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = cur.getMonth();
    const dim = getDaysInMonth(cur);
    const p15 = new Date(y, m, 15);
    const plast = new Date(y, m, dim);
    if (p15 >= startOfDay(from) && p15 <= end) out.push(p15);
    if (plast >= startOfDay(from) && plast <= end) out.push(plast);
    cur = new Date(y, m + 1, 1);
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}
