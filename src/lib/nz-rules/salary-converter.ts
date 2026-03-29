/**
 * NZ Salary Converter — converts between hourly, weekly, fortnightly, monthly, and annual.
 * Standard assumptions: 40 hours/week, 52 weeks/year, 26 fortnights, 12 months.
 */

export const HOURS_PER_WEEK = 40;
export const WEEKS_PER_YEAR = 52;
export const FORTNIGHTS_PER_YEAR = 26;
export const MONTHS_PER_YEAR = 12;

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type SalaryConversion = {
  hourly: number;
  weekly: number;
  fortnightly: number;
  monthly: number;
  annual: number;
  hoursPerWeek: number;
};

export type SalaryPeriod = "hourly" | "weekly" | "fortnightly" | "monthly" | "annual";

export function convertSalary(
  amount: number,
  period: SalaryPeriod,
  hoursPerWeek: number = HOURS_PER_WEEK,
): SalaryConversion {
  const hrs = Math.max(1, hoursPerWeek);
  const val = Math.max(0, amount);

  let annual: number;
  switch (period) {
    case "hourly":
      annual = val * hrs * WEEKS_PER_YEAR;
      break;
    case "weekly":
      annual = val * WEEKS_PER_YEAR;
      break;
    case "fortnightly":
      annual = val * FORTNIGHTS_PER_YEAR;
      break;
    case "monthly":
      annual = val * MONTHS_PER_YEAR;
      break;
    case "annual":
      annual = val;
      break;
  }

  return {
    hourly: roundMoney(annual / (hrs * WEEKS_PER_YEAR)),
    weekly: roundMoney(annual / WEEKS_PER_YEAR),
    fortnightly: roundMoney(annual / FORTNIGHTS_PER_YEAR),
    monthly: roundMoney(annual / MONTHS_PER_YEAR),
    annual: roundMoney(annual),
    hoursPerWeek: hrs,
  };
}
