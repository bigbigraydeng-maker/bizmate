import type { SupabaseClient } from "@supabase/supabase-js";

import { generateComplianceDates } from "@/lib/nz-rules/compliance-dates";
import type { CompanyForCompliance } from "@/lib/nz-rules/compliance-dates";
import type { Database } from "@/lib/supabase/types";

export async function insertComplianceDeadlinesForCompany(
  supabase: SupabaseClient<Database>,
  company: CompanyForCompliance,
): Promise<{ error: Error | null }> {
  const rows = generateComplianceDates(company);
  if (rows.length === 0) return { error: null };
  const { error } = await supabase.from("compliance_deadlines").insert(rows);
  if (error) return { error: new Error(error.message) };
  return { error: null };
}
