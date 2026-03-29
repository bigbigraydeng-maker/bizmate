/**
 * NZD-CNY Currency Converter
 * Uses a fallback hardcoded rate; in production this should call an API.
 * Includes common remittance fee estimates for Chinese immigrants.
 */

/** Fallback rate when API is unavailable — updated manually */
export const FALLBACK_NZD_TO_CNY = 4.35;

/** Common bank wire fee in NZD */
export const BANK_WIRE_FEE_NZD = 25;

/** Typical margin on bank exchange (percentage) */
export const BANK_MARGIN_PERCENT = 1.5;

function roundMoney(n: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((n + Number.EPSILON) * factor) / factor;
}

export type CurrencyConversion = {
  nzdAmount: number;
  cnyAmount: number;
  rate: number;
  direction: "nzd_to_cny" | "cny_to_nzd";
  bankWireFee: number;
  bankMarginLoss: number;
  effectiveCnyReceived: number;
  effectiveRate: number;
};

export function convertNzdCny(
  amount: number,
  direction: "nzd_to_cny" | "cny_to_nzd",
  rate: number = FALLBACK_NZD_TO_CNY,
): CurrencyConversion {
  const val = Math.max(0, amount);
  const r = Math.max(0.01, rate);

  if (direction === "nzd_to_cny") {
    const cnyAmount = roundMoney(val * r);
    const bankMarginLoss = roundMoney(val * (BANK_MARGIN_PERCENT / 100) * r);
    const effectiveCnyReceived = roundMoney(cnyAmount - bankMarginLoss - BANK_WIRE_FEE_NZD * r);
    const effectiveRate = val > 0 ? roundMoney(effectiveCnyReceived / val, 4) : 0;

    return {
      nzdAmount: val,
      cnyAmount,
      rate: r,
      direction,
      bankWireFee: BANK_WIRE_FEE_NZD,
      bankMarginLoss,
      effectiveCnyReceived,
      effectiveRate,
    };
  }

  // CNY to NZD
  const nzdAmount = roundMoney(val / r);
  const bankMarginLoss = roundMoney(nzdAmount * (BANK_MARGIN_PERCENT / 100));
  const effectiveNzdReceived = roundMoney(nzdAmount - bankMarginLoss - BANK_WIRE_FEE_NZD);
  const effectiveRate = val > 0 ? roundMoney(val / effectiveNzdReceived, 4) : 0;

  return {
    nzdAmount,
    cnyAmount: val,
    rate: r,
    direction,
    bankWireFee: BANK_WIRE_FEE_NZD,
    bankMarginLoss,
    effectiveCnyReceived: effectiveNzdReceived, // reuse field for effective amount
    effectiveRate,
  };
}
