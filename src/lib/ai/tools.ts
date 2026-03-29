import type { ChatCompletionTool } from "openai/resources/chat/completions";

import { searchKnowledgeBase } from "./rag";
import {
  generateComplianceDates,
  type CompanyForCompliance,
  type GstFilingFrequency,
} from "@/lib/nz-rules/compliance-dates";
import { addGst, removeGst } from "@/lib/nz-rules/gst";
import {
  calculateKiwisaver,
  type EmployeeRatePercent,
  EMPLOYEE_RATES_PERCENT,
} from "@/lib/nz-rules/kiwisaver";
import { calculateAnnualPayeBreakdown } from "@/lib/nz-rules/paye";
import type { Tables } from "@/lib/supabase/types";

export const BIZMATE_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculate_gst",
      description:
        "Calculate NZ GST (15%) on an amount. Use for add-GST or remove-GST from a dollar amount.",
      parameters: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: ["add", "remove"],
            description: "add: exclusive to inclusive GST; remove: inclusive to ex-GST + GST",
          },
          amount_nzd: { type: "number", description: "Amount in NZD" },
        },
        required: ["mode", "amount_nzd"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_paye",
      description:
        "Annual PAYE-style income tax + ACC earner levy breakdown for a gross annual salary (NZ).",
      parameters: {
        type: "object",
        properties: {
          gross_annual_nzd: { type: "number", description: "Annual gross salary in NZD" },
        },
        required: ["gross_annual_nzd"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_kiwisaver",
      description:
        "KiwiSaver employee and employer contributions (annual) from gross salary and contribution rates.",
      parameters: {
        type: "object",
        properties: {
          gross_annual_nzd: { type: "number" },
          employee_rate_percent: {
            type: "number",
            description: "Employee rate: 3, 4, 6, 8, or 10",
          },
          employer_rate_percent: {
            type: "number",
            description: "Employer rate (minimum 3%)",
          },
        },
        required: ["gross_annual_nzd", "employee_rate_percent", "employer_rate_percent"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_compliance_dates",
      description:
        "Generate illustrative NZ compliance due dates (GST, PAYE filing, annual return, provisional tax, ACC) for the next 12 months from profile fields.",
      parameters: {
        type: "object",
        properties: {
          company_id: { type: "string", description: "UUID placeholder if unknown" },
          company_name: { type: "string" },
          gst_filing_frequency: {
            type: "string",
            enum: ["monthly", "2monthly", "6monthly", "not_registered"],
          },
          balance_date: {
            type: "string",
            description: "Financial year-end YYYY-MM-DD",
          },
          created_at: {
            type: "string",
            description: "Company registration / profile created ISO timestamp",
          },
          employee_count: { type: "number", description: "For PAYE deadlines; use 0 if none" },
        },
        required: [
          "gst_filing_frequency",
          "balance_date",
          "created_at",
          "employee_count",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description:
        "Search the BizMate NZ business knowledge base (bilingual snippets with sources). Use for conceptual questions.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: {
            type: "string",
            description: "Optional filter, e.g. tax, employment, health_safety",
          },
          limit: { type: "number", description: "Max results 1-10, default 5" },
        },
        required: ["query"],
      },
    },
  },
];

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return fallback;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export async function executeBizmateTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  switch (name) {
    case "calculate_gst": {
      const mode = str(input.mode) === "remove" ? "remove" : "add";
      const amount = num(input.amount_nzd);
      const r = mode === "add" ? addGst(amount) : removeGst(amount);
      return JSON.stringify({ mode, ...r });
    }
    case "calculate_paye": {
      const gross = num(input.gross_annual_nzd);
      const r = calculateAnnualPayeBreakdown(gross);
      return JSON.stringify(r);
    }
    case "calculate_kiwisaver": {
      const gross = num(input.gross_annual_nzd);
      const er = num(input.employee_rate_percent, 3);
      const or_ = num(input.employer_rate_percent, 3);
      const nearest = EMPLOYEE_RATES_PERCENT.reduce((a, b) =>
        Math.abs(b - er) < Math.abs(a - er) ? b : a,
      ) as EmployeeRatePercent;
      const r = calculateKiwisaver(gross, nearest, or_);
      return JSON.stringify(r);
    }
    case "get_compliance_dates": {
      const company: CompanyForCompliance = {
        id: str(input.company_id, "00000000-0000-0000-0000-000000000001"),
        name: str(input.company_name, "Company"),
        gst_filing_frequency: str(input.gst_filing_frequency, "not_registered") as GstFilingFrequency,
        balance_date: str(input.balance_date, "2026-03-31"),
        created_at: str(input.created_at, new Date().toISOString()),
        employee_count: num(input.employee_count),
      };
      const rows = generateComplianceDates(company);
      return JSON.stringify(rows);
    }
    case "search_knowledge_base": {
      const query = str(input.query);
      const category = input.category != null ? str(input.category) : undefined;
      const limit = Math.min(10, Math.max(1, num(input.limit, 5)));
      const hits = await searchKnowledgeBase(query, category, limit);
      return JSON.stringify(hits);
    }
    default:
      return JSON.stringify({ error: "unknown_tool", name });
  }
}

/** Merge saved company profile into tool input for accurate compliance dates. */
export async function executeBizmateToolWithContext(
  name: string,
  input: Record<string, unknown>,
  company: Tables<"companies"> | null,
): Promise<string> {
  if (name === "get_compliance_dates" && company) {
    return executeBizmateTool(name, {
      ...input,
      company_id: company.id,
      company_name: company.name,
      gst_filing_frequency:
        (company.gst_filing_frequency as GstFilingFrequency | null) ?? "not_registered",
      balance_date: company.balance_date ?? "2026-03-31",
      created_at: company.created_at,
      employee_count: company.employee_count ?? 0,
    });
  }
  return executeBizmateTool(name, input);
}
