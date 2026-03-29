import { z } from "zod";

export const entityTypes = [
  "company",
  "sole_trader",
  "partnership",
  "trust",
] as const;

export const gstFrequencies = [
  "monthly",
  "2monthly",
  "6monthly",
  "not_registered",
] as const;

export const industries = [
  "restaurant",
  "retail",
  "construction",
  "import_export",
  "it",
  "property",
  "other",
] as const;

export const step1Schema = z.object({
  name: z.string().min(1),
  nzbn: z.string().optional(),
  entity_type: z.enum(entityTypes),
});

export const step2Schema = z.object({
  gst_number: z.string().optional(),
  gst_filing_frequency: z.enum(gstFrequencies),
  balance_date: z.string().min(1),
});

export const step3Schema = z.object({
  employee_count: z.coerce.number().int().min(0),
  kiwisaver_enrolled: z.boolean(),
});

export const step4Schema = z.object({
  industry: z.enum(industries),
});

export const onboardingFullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type OnboardingFormValues = z.infer<typeof onboardingFullSchema>;
