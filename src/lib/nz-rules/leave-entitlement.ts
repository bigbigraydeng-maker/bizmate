/**
 * NZ Leave Entitlement Calculator
 * Based on the Holidays Act 2003:
 * - Annual leave: 4 weeks after 12 months continuous employment
 * - Sick leave: 10 days after 6 months, refreshes each 12-month anniversary
 * - Bereavement leave: 3 days (close family) or 1 day (other)
 * - Public holidays: 12 days per year (if they fall on an otherwise working day)
 * - Domestic violence leave: 10 days per year
 */

export const ANNUAL_LEAVE_WEEKS = 4;
export const SICK_LEAVE_DAYS = 10;
export const BEREAVEMENT_CLOSE_DAYS = 3;
export const BEREAVEMENT_OTHER_DAYS = 1;
export const PUBLIC_HOLIDAYS_DAYS = 12;
export const DOMESTIC_VIOLENCE_DAYS = 10;

export type LeaveEntitlement = {
  yearsEmployed: number;
  monthsEmployed: number;
  annualLeaveDays: number;
  annualLeaveWeeks: number;
  sickLeaveDays: number;
  bereavementCloseDays: number;
  bereavementOtherDays: number;
  publicHolidayDays: number;
  domesticViolenceDays: number;
  totalPaidLeaveDays: number;
  annualLeaveValue: number;
  sickLeaveValue: number;
  daysPerWeek: number;
};

export function calculateLeaveEntitlement(
  monthsEmployed: number,
  dailyRate: number,
  daysPerWeek: number = 5,
): LeaveEntitlement {
  const months = Math.max(0, Math.round(monthsEmployed));
  const rate = Math.max(0, dailyRate);
  const dpw = Math.max(1, Math.min(7, daysPerWeek));

  const yearsEmployed = Math.floor(months / 12);

  // Annual leave: entitled after 12 months
  const annualLeaveWeeks = months >= 12 ? ANNUAL_LEAVE_WEEKS : 0;
  const annualLeaveDays = annualLeaveWeeks * dpw;

  // Sick leave: entitled after 6 months
  const sickLeaveDays = months >= 6 ? SICK_LEAVE_DAYS : 0;

  const totalPaidLeaveDays =
    annualLeaveDays +
    sickLeaveDays +
    BEREAVEMENT_CLOSE_DAYS +
    PUBLIC_HOLIDAYS_DAYS +
    DOMESTIC_VIOLENCE_DAYS;

  const roundMoney = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

  return {
    yearsEmployed,
    monthsEmployed: months,
    annualLeaveDays,
    annualLeaveWeeks,
    sickLeaveDays,
    bereavementCloseDays: BEREAVEMENT_CLOSE_DAYS,
    bereavementOtherDays: BEREAVEMENT_OTHER_DAYS,
    publicHolidayDays: PUBLIC_HOLIDAYS_DAYS,
    domesticViolenceDays: DOMESTIC_VIOLENCE_DAYS,
    totalPaidLeaveDays,
    annualLeaveValue: roundMoney(annualLeaveDays * rate),
    sickLeaveValue: roundMoney(sickLeaveDays * rate),
    daysPerWeek: dpw,
  };
}
