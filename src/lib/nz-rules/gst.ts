/** NZ GST — deterministic rules only (not LLM). */

export const GST_RATE = 0.15;
export const REGISTRATION_THRESHOLD_NZD = 60_000;

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type GstBreakdown = {
  gstAmount: number;
  totalInclGst: number;
  totalExclGst: number;
};

/** Add 15% GST to an exclusive (before-GST) amount. */
export function addGst(exclusiveAmount: number): GstBreakdown {
  const totalExclGst = roundMoney(exclusiveAmount);
  const gstAmount = roundMoney(totalExclGst * GST_RATE);
  const totalInclGst = roundMoney(totalExclGst + gstAmount);
  return { gstAmount, totalInclGst, totalExclGst };
}

/** Remove GST from a tax-inclusive amount (GST-inclusive price → ex-GST + GST). */
export function removeGst(inclusiveAmount: number): GstBreakdown {
  const totalInclGst = roundMoney(inclusiveAmount);
  const totalExclGst = roundMoney(totalInclGst / (1 + GST_RATE));
  const gstAmount = roundMoney(totalInclGst - totalExclGst);
  return { gstAmount, totalInclGst, totalExclGst };
}
