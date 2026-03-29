/**
 * NZ Employee Total Cost Calculator
 * Calculates the true cost of employing someone including:
 * - Gross salary
 * - KiwiSaver employer contribution (min 3%)
 * - ESCT on employer KiwiSaver
 * - ACC employer levy
 * - Holiday pay provision (8% of gross for casual/contractor comparison)
 */

import { EMPLOYER_MIN_RATE_PERCENT, ESCT_ILLUSTRATIVE_RATE } from "./kiwisaver";

/** ACC employer levy rate (WorkSafe levy varies by industry, using average) */
export const ACC_EMPLOYER_LEVY_RATE = 0.008; // ~0.8% average across industries

/** Statutory annual leave: 4 weeks = 8% loading on gross */
export const ANNUAL_LEAVE_LOADING = 0.08;

/** Public holidays: 12 days / 260 working days ≈ 4.6% */
export const PUBLIC_HOLIDAY_LOADING = 0.0462;

/** Sick leave: 10 days / 260 ≈ 3.8% */
export const SICK_LEAVE_LOADING = 0.0385;

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type EmployeeCostBreakdown = {
  grossAnnual: number;
  kiwisaverEmployer: number;
  esctOnKiwisaver: number;
  accEmployerLevy: number;
  annualLeaveProvision: number;
  publicHolidayProvision: number;
  sickLeaveProvision: number;
  totalOnCosts: number;
  totalCostToEmployer: number;
  hourlyEquivalent: number;
  onCostPercentage: number;
};

export function calculateEmployeeCost(
  grossAnnual: number,
  kiwisaverEmployerPercent: number = EMPLOYER_MIN_RATE_PERCENT,
): EmployeeCostBreakdown {
  const gross = Math.max(0, grossAnnual);
  const ksRate = Math.max(EMPLOYER_MIN_RATE_PERCENT, kiwisaverEmployerPercent);

  const kiwisaverEmployer = roundMoney((gross * ksRate) / 100);
  const esctOnKiwisaver = roundMoney(kiwisaverEmployer * ESCT_ILLUSTRATIVE_RATE);
  const accEmployerLevy = roundMoney(gross * ACC_EMPLOYER_LEVY_RATE);
  const annualLeaveProvision = roundMoney(gross * ANNUAL_LEAVE_LOADING);
  const publicHolidayProvision = roundMoney(gross * PUBLIC_HOLIDAY_LOADING);
  const sickLeaveProvision = roundMoney(gross * SICK_LEAVE_LOADING);

  const totalOnCosts = roundMoney(
    kiwisaverEmployer +
    esctOnKiwisaver +
    accEmployerLevy +
    annualLeaveProvision +
    publicHolidayProvision +
    sickLeaveProvision,
  );

  const totalCostToEmployer = roundMoney(gross + totalOnCosts);
  const hoursPerYear = 2080; // 40hrs × 52wks
  const hourlyEquivalent = roundMoney(totalCostToEmployer / hoursPerYear);
  const onCostPercentage = gross > 0 ? roundMoney((totalOnCosts / gross) * 100) : 0;

  return {
    grossAnnual: gross,
    kiwisaverEmployer,
    esctOnKiwisaver,
    accEmployerLevy,
    annualLeaveProvision,
    publicHolidayProvision,
    sickLeaveProvision,
    totalOnCosts,
    totalCostToEmployer,
    hourlyEquivalent,
    onCostPercentage,
  };
}
