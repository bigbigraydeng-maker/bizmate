/**
 * Generate compliance deadlines for a company (GST, PAYE filing, annual return, provisional tax, ACC).
 * Rules are illustrative — confirm with IRD / Companies Office for your entity.
 */

import {
  addMonths,
  endOfMonth,
  isBefore,
  startOfDay,
  startOfMonth,
} from "date-fns";

import {
  addNzWorkingDaysAfter,
  addNzWorkingDaysAfterEvent,
  formatDateKey,
  getMonthPaydaysInRange,
  lastDayOfMonth,
} from "./holidays";

export type GstFilingFrequency =
  | "monthly"
  | "2monthly"
  | "6monthly"
  | "not_registered";

export type CompanyForCompliance = {
  id: string;
  name: string;
  gst_filing_frequency: GstFilingFrequency | null;
  balance_date: string;
  /** ISO — used as proxy for incorporation anniversary for annual return if no separate field */
  created_at: string;
  employee_count?: number;
};

export type ComplianceDeadlineRow = {
  company_id: string;
  type:
    | "gst"
    | "paye"
    | "annual_return"
    | "provisional_tax"
    | "fbt"
    | "acc"
    | "custom";
  title: string;
  description: string | null;
  due_date: string;
  status: "upcoming";
};

const HORIZON_MONTHS = 12;

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function balanceMonthDay(balanceIso: string): { month: number; day: number } {
  const d = parseLocalDate(balanceIso);
  return { month: d.getMonth(), day: d.getDate() };
}

/** GST due: 28th of the month after the taxable period ends (IRD). */
function gstDueAfterPeriodEnd(periodEnd: Date): Date {
  const next = addMonths(periodEnd, 1);
  const y = next.getFullYear();
  const m = next.getMonth();
  return new Date(y, m, 28);
}

function pushGstMonthly(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const start = startOfDay(from);
  const end = startOfDay(to);
  const base = startOfMonth(from);
  for (let i = 0; i < HORIZON_MONTHS; i++) {
    const m = addMonths(base, i);
    const periodEnd = endOfMonth(m);
    const due = gstDueAfterPeriodEnd(periodEnd);
    if (isBefore(due, start) || isBefore(end, due)) continue;
    out.push({
      company_id: company.id,
      type: "gst",
      title: "GST return",
      description: `GST return for period ending ${formatDateKey(periodEnd)} (due 28th of following month).`,
      due_date: formatDateKey(due),
      status: "upcoming",
    });
  }
}

/** 2-monthly: periods ending last day of Feb, Apr, Jun, Aug, Oct, Dec */
function pushGst2Monthly(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const end = startOfDay(to);
  let y = from.getFullYear();
  const endYears = to.getFullYear() + 1;
  while (y <= endYears) {
    for (const month of [1, 3, 5, 7, 9, 11]) {
      const periodEnd = lastDayOfMonth(new Date(y, month, 1));
      if (isBefore(periodEnd, startOfDay(from)) || isBefore(end, periodEnd)) continue;
      const due = gstDueAfterPeriodEnd(periodEnd);
      if (isBefore(end, due)) continue;
      out.push({
        company_id: company.id,
        type: "gst",
        title: "GST return (2-monthly)",
        description: `GST return for period ending ${formatDateKey(periodEnd)}.`,
        due_date: formatDateKey(due),
        status: "upcoming",
      });
    }
    y++;
  }
}

/** 6-monthly: two periods per year aligned to balance month / opposite half-year */
function pushGst6Monthly(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const { month: bm } = balanceMonthDay(company.balance_date);
  const end = startOfDay(to);
  let y = from.getFullYear() - 1;
  while (y <= to.getFullYear() + 1) {
    const periodEnds = [
      lastDayOfMonth(new Date(y, bm, 1)),
      lastDayOfMonth(new Date(y, (bm + 6) % 12, 1)),
    ];
    for (const pe of periodEnds) {
      if (isBefore(pe, startOfDay(from)) || isBefore(end, pe)) continue;
      const due = gstDueAfterPeriodEnd(pe);
      if (isBefore(end, due)) continue;
      out.push({
        company_id: company.id,
        type: "gst",
        title: "GST return (6-monthly)",
        description: `GST return for period ending ${formatDateKey(pe)}.`,
        due_date: formatDateKey(due),
        status: "upcoming",
      });
    }
    y++;
  }
}

function pushPaye(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  if ((company.employee_count ?? 0) <= 0) return;
  const paydays = getMonthPaydaysInRange(from, to);
  for (const payday of paydays) {
    const due = addNzWorkingDaysAfter(payday, 2);
    out.push({
      company_id: company.id,
      type: "paye",
      title: "PAYE payday filing",
      description: `IRD payday filing (due 2 working days after payday ${formatDateKey(payday)}).`,
      due_date: formatDateKey(due),
      status: "upcoming",
    });
  }
}

/** Annual return: 20 working days after anniversary of registration (uses created_at date). */
function pushAnnualReturn(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const created = new Date(company.created_at);
  const annMonth = created.getMonth();
  const annDay = created.getDate();
  const start = startOfDay(from);
  const end = startOfDay(to);
  for (let y = from.getFullYear() - 1; y <= to.getFullYear() + 1; y++) {
    const anni = new Date(y, annMonth, annDay);
    if (isBefore(anni, start) || isBefore(end, anni)) continue;
    const due = addNzWorkingDaysAfterEvent(anni, 20);
    if (isBefore(due, start) || isBefore(end, due)) continue;
    out.push({
      company_id: company.id,
      type: "annual_return",
      title: "Companies Office annual return",
      description:
        "Illustrative due date: 20 working days after registration anniversary (confirm on Companies Office).",
      due_date: formatDateKey(due),
      status: "upcoming",
    });
  }
}

/**
 * Provisional tax instalments — standard dates for March balance; other months use shifted pattern (illustrative).
 */
function pushProvisionalTax(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const { month: bm, day: bd } = balanceMonthDay(company.balance_date);
  const years = [from.getFullYear(), from.getFullYear() + 1, to.getFullYear() + 1];
  const seen = new Set<string>();

  for (const year of years) {
    let p1: Date;
    let p2: Date;
    let p3: Date;
    if (bm === 2 && bd === 31) {
      p1 = new Date(year, 7, 28);
      p2 = new Date(year + 1, 0, 15);
      p3 = new Date(year + 1, 4, 7);
    } else if (bm === 5 && bd === 30) {
      p1 = new Date(year, 10, 15);
      p2 = new Date(year + 1, 1, 28);
      p3 = new Date(year + 1, 4, 28);
    } else {
      p1 = addMonths(parseLocalDate(company.balance_date), 5);
      p1 = new Date(p1.getFullYear(), p1.getMonth(), 28);
      p2 = addMonths(parseLocalDate(company.balance_date), 10);
      p2 = new Date(p2.getFullYear(), p2.getMonth(), 15);
      p3 = addMonths(parseLocalDate(company.balance_date), 14);
      p3 = new Date(p3.getFullYear(), p3.getMonth(), 7);
    }
    for (const d of [p1, p2, p3]) {
      const key = formatDateKey(d);
      if (seen.has(key)) continue;
      seen.add(key);
      if (isBefore(d, from) || isBefore(to, d)) continue;
      out.push({
        company_id: company.id,
        type: "provisional_tax",
        title: "Provisional tax instalment",
        description:
          "Illustrative IRD instalment date — confirm amounts and dates in myIR.",
        due_date: key,
        status: "upcoming",
      });
    }
  }
}

function pushAcc(
  company: CompanyForCompliance,
  from: Date,
  to: Date,
  out: ComplianceDeadlineRow[],
): void {
  const { month: bm } = balanceMonthDay(company.balance_date);
  let y = from.getFullYear();
  while (y <= to.getFullYear() + 1) {
    const due = new Date(y, (bm + 3) % 12, 30);
    if (!isBefore(due, from) && !isBefore(to, due)) {
      out.push({
        company_id: company.id,
        type: "acc",
        title: "ACC employer levy (reminder)",
        description:
          "Illustrative reminder for employer levy / coverage — confirm with ACC.",
        due_date: formatDateKey(due),
        status: "upcoming",
      });
    }
    y++;
  }
}

/**
 * Generate upcoming compliance rows for roughly the next 12 months.
 */
export function generateComplianceDates(company: CompanyForCompliance): ComplianceDeadlineRow[] {
  const today = startOfDay(new Date());
  const from = today;
  const to = addMonths(today, HORIZON_MONTHS);
  const out: ComplianceDeadlineRow[] = [];

  const freq = company.gst_filing_frequency ?? "not_registered";
  if (freq === "monthly") {
    pushGstMonthly(company, from, to, out);
  } else if (freq === "2monthly") {
    pushGst2Monthly(company, from, to, out);
  } else if (freq === "6monthly") {
    pushGst6Monthly(company, from, to, out);
  }

  pushPaye(company, from, to, out);
  pushAnnualReturn(company, from, to, out);
  pushProvisionalTax(company, from, to, out);
  pushAcc(company, from, to, out);

  const uniq = new Map<string, ComplianceDeadlineRow>();
  for (const row of out) {
    const key = `${row.type}-${row.due_date}-${row.title}`;
    const existing = uniq.get(key);
    if (!existing) uniq.set(key, row);
    else {
      uniq.set(
        key,
        existing.description && existing.description.length > (row.description?.length ?? 0)
          ? existing
          : row,
      );
    }
  }

  const sorted = [...uniq.values()].sort((a, b) => a.due_date.localeCompare(b.due_date));
  return sorted;
}

export function horizonRange(): { from: Date; to: Date } {
  const today = startOfDay(new Date());
  return { from: today, to: addMonths(today, HORIZON_MONTHS) };
}
