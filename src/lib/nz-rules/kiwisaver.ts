/**
 * KiwiSaver — employee / employer contributions (deterministic, not LLM).
 * ESCT on employer contributions is shown using a flat illustrative rate (IRD schedule varies).
 */

export const EMPLOYEE_RATES_PERCENT = [3, 4, 6, 8, 10] as const;
export type EmployeeRatePercent = (typeof EMPLOYEE_RATES_PERCENT)[number];

export const EMPLOYER_MIN_RATE_PERCENT = 3;

/** Illustrative ESCT on employer super contribution (actual ESCT depends on employer). */
export const ESCT_ILLUSTRATIVE_RATE = 0.175;

export type KiwisaverBreakdown = {
  grossAnnual: number;
  employeeRatePercent: number;
  employerRatePercent: number;
  employeeAnnual: number;
  employerAnnual: number;
  esctOnEmployerAnnual: number;
  employerCostIncludingEsct: number;
  totalEmployeePlusEmployerContributions: number;
};

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateKiwisaver(
  grossAnnual: number,
  employeeRatePercent: EmployeeRatePercent,
  employerRatePercent: number,
): KiwisaverBreakdown {
  const gross = Math.max(0, grossAnnual);
  const er = Math.max(EMPLOYER_MIN_RATE_PERCENT, employerRatePercent);

  const employeeAnnual = roundMoney((gross * employeeRatePercent) / 100);
  const employerAnnual = roundMoney((gross * er) / 100);
  const esctOnEmployerAnnual = roundMoney(employerAnnual * ESCT_ILLUSTRATIVE_RATE);
  const employerCostIncludingEsct = roundMoney(employerAnnual + esctOnEmployerAnnual);

  return {
    grossAnnual: gross,
    employeeRatePercent,
    employerRatePercent: er,
    employeeAnnual,
    employerAnnual,
    esctOnEmployerAnnual,
    employerCostIncludingEsct,
  totalEmployeePlusEmployerContributions: roundMoney(
    employeeAnnual + employerAnnual,
  ),
};
}
