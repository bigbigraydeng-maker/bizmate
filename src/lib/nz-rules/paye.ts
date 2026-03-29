/**
 * NZ PAYE-style progressive income tax (annual gross) + ACC earner levy.
 * Deterministic brackets; not LLM.
 */

const BANDS: { from: number; to: number; rate: number }[] = [
  { from: 0, to: 15_600, rate: 0.105 },
  { from: 15_600, to: 53_500, rate: 0.175 },
  { from: 53_500, to: 78_100, rate: 0.3 },
  { from: 78_100, to: 180_000, rate: 0.33 },
  { from: 180_000, to: Number.POSITIVE_INFINITY, rate: 0.39 },
];

export const ACC_EARNER_LEVY_RATE = 0.016;
export const ACC_MAX_EARNINGS_FOR_LEVY = 142_283;

export type PayeBracketSlice = {
  bandFrom: number;
  bandTo: number;
  rate: number;
  taxableInBand: number;
  taxInBand: number;
};

export type AnnualPayeResult = {
  grossAnnual: number;
  payeAnnual: number;
  accAnnual: number;
  payeAndAccAnnual: number;
  monthlyPaye: number;
  weeklyPaye: number;
  monthlyAcc: number;
  weeklyAcc: number;
  effectivePayeRate: number;
  effectivePayeAndAccRate: number;
  takeHomeAfterPayeAndAcc: number;
  brackets: PayeBracketSlice[];
};

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateAnnualIncomeTax(grossAnnual: number): {
  tax: number;
  brackets: PayeBracketSlice[];
} {
  const gross = Math.max(0, grossAnnual);
  const brackets: PayeBracketSlice[] = [];
  let totalTax = 0;

  for (const band of BANDS) {
    if (gross <= band.from) break;
    const upper =
      band.to === Number.POSITIVE_INFINITY ? gross : Math.min(gross, band.to);
    const taxableInBand = upper - band.from;
    if (taxableInBand <= 0) continue;
    const taxInBand = roundMoney(taxableInBand * band.rate);
    totalTax += taxInBand;
    brackets.push({
      bandFrom: band.from,
      bandTo: upper,
      rate: band.rate,
      taxableInBand: roundMoney(taxableInBand),
      taxInBand,
    });
  }

  return { tax: roundMoney(totalTax), brackets };
}

export function calculateAccEarnerLevy(grossAnnual: number): number {
  const capped = Math.min(Math.max(0, grossAnnual), ACC_MAX_EARNINGS_FOR_LEVY);
  return roundMoney(capped * ACC_EARNER_LEVY_RATE);
}

export function calculateAnnualPayeBreakdown(grossAnnual: number): AnnualPayeResult {
  const gross = Math.max(0, grossAnnual);
  const { tax: payeAnnual, brackets } = calculateAnnualIncomeTax(gross);
  const accAnnual = calculateAccEarnerLevy(gross);
  const payeAndAccAnnual = roundMoney(payeAnnual + accAnnual);

  return {
    grossAnnual: gross,
    payeAnnual,
    accAnnual,
    payeAndAccAnnual,
    monthlyPaye: roundMoney(payeAnnual / 12),
    weeklyPaye: roundMoney(payeAnnual / 52),
    monthlyAcc: roundMoney(accAnnual / 12),
    weeklyAcc: roundMoney(accAnnual / 52),
    effectivePayeRate: gross > 0 ? roundMoney((payeAnnual / gross) * 100) : 0,
    effectivePayeAndAccRate: gross > 0 ? roundMoney((payeAndAccAnnual / gross) * 100) : 0,
    takeHomeAfterPayeAndAcc: roundMoney(gross - payeAndAccAnnual),
    brackets,
  };
}
