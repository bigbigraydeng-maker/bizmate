/**
 * NZ Invoice Calculator
 * Calculates invoice amounts with GST, withholding tax, and discounts.
 * Useful for small business owners preparing invoices.
 */

import { GST_RATE } from "./gst";

/** Schedular payment / withholding tax rates for contractors */
export const WITHHOLDING_TAX_RATES = [0, 10.5, 17.5, 20, 30, 33, 45, 48] as const;

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type InvoiceLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type InvoiceBreakdown = {
  lines: InvoiceLine[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  afterDiscount: number;
  isGstRegistered: boolean;
  gstAmount: number;
  withholdingTaxPercent: number;
  withholdingTaxAmount: number;
  totalInclGst: number;
  amountDue: number;
};

export function calculateInvoice(
  lines: { description: string; quantity: number; unitPrice: number }[],
  options: {
    discountPercent?: number;
    isGstRegistered?: boolean;
    withholdingTaxPercent?: number;
  } = {},
): InvoiceBreakdown {
  const {
    discountPercent = 0,
    isGstRegistered = true,
    withholdingTaxPercent = 0,
  } = options;

  const invoiceLines: InvoiceLine[] = lines.map((l) => ({
    description: l.description,
    quantity: Math.max(0, l.quantity),
    unitPrice: Math.max(0, l.unitPrice),
    lineTotal: roundMoney(Math.max(0, l.quantity) * Math.max(0, l.unitPrice)),
  }));

  const subtotal = roundMoney(invoiceLines.reduce((sum, l) => sum + l.lineTotal, 0));
  const disc = Math.max(0, Math.min(100, discountPercent));
  const discountAmount = roundMoney(subtotal * (disc / 100));
  const afterDiscount = roundMoney(subtotal - discountAmount);

  const gstAmount = isGstRegistered ? roundMoney(afterDiscount * GST_RATE) : 0;
  const totalInclGst = roundMoney(afterDiscount + gstAmount);

  const wht = Math.max(0, Math.min(100, withholdingTaxPercent));
  const withholdingTaxAmount = roundMoney(afterDiscount * (wht / 100));
  const amountDue = roundMoney(totalInclGst - withholdingTaxAmount);

  return {
    lines: invoiceLines,
    subtotal,
    discountPercent: disc,
    discountAmount,
    afterDiscount,
    isGstRegistered,
    gstAmount,
    withholdingTaxPercent: wht,
    withholdingTaxAmount,
    totalInclGst,
    amountDue,
  };
}
