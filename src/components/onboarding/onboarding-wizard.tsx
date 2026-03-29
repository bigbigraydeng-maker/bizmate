"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import {
  onboardingFullSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type OnboardingFormValues,
} from "@/lib/onboarding/schema";
import { insertComplianceDeadlinesForCompany } from "@/lib/compliance/insert-deadlines";
import { createClient } from "@/lib/supabase/client";
import type { CompanyForCompliance } from "@/lib/nz-rules/compliance-dates";

const STEPS = 4;

const defaultValues: OnboardingFormValues = {
  name: "",
  nzbn: "",
  entity_type: "company",
  gst_number: "",
  gst_filing_frequency: "monthly",
  balance_date: "2026-03-31",
  employee_count: 0,
  kiwisaver_enrolled: true,
  industry: "other",
};

export function OnboardingWizard() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OnboardingFormValues>(defaultValues);

  function update<K extends keyof OnboardingFormValues>(
    key: K,
    value: OnboardingFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateCurrent(): boolean {
    if (step === 1) {
      const r = step1Schema.safeParse({
        name: form.name,
        nzbn: form.nzbn || undefined,
        entity_type: form.entity_type,
      });
      return r.success;
    }
    if (step === 2) {
      return step2Schema.safeParse({
        gst_number: form.gst_number || undefined,
        gst_filing_frequency: form.gst_filing_frequency,
        balance_date: form.balance_date,
      }).success;
    }
    if (step === 3) {
      return step3Schema.safeParse({
        employee_count: form.employee_count,
        kiwisaver_enrolled: form.kiwisaver_enrolled,
      }).success;
    }
    return step4Schema.safeParse({ industry: form.industry }).success;
  }

  async function submit() {
    const parsed = onboardingFullSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(t("errorSave"));
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t("errorSave"));
      setLoading(false);
      return;
    }

    const v = parsed.data;
    const { data: companyRow, error } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        name: v.name,
        nzbn: v.nzbn || null,
        entity_type: v.entity_type,
        gst_number: v.gst_number || null,
        gst_filing_frequency: v.gst_filing_frequency,
        balance_date: v.balance_date,
        employee_count: v.employee_count,
        kiwisaver_enrolled: v.kiwisaver_enrolled,
        industry: v.industry,
      })
      .select("id, name, gst_filing_frequency, balance_date, created_at, employee_count")
      .single();

    setLoading(false);
    if (error || !companyRow) {
      toast.error(t("errorSave"));
      return;
    }

    const complianceCompany: CompanyForCompliance = {
      id: companyRow.id,
      name: companyRow.name,
      gst_filing_frequency: companyRow.gst_filing_frequency as CompanyForCompliance["gst_filing_frequency"],
      balance_date: companyRow.balance_date ?? v.balance_date,
      created_at: companyRow.created_at,
      employee_count: companyRow.employee_count ?? 0,
    };
    const { error: deadlineErr } = await insertComplianceDeadlinesForCompany(
      supabase,
      complianceCompany,
    );
    if (deadlineErr) {
      console.error("[onboarding] compliance deadlines:", deadlineErr);
    }
    toast.success(t("success"));
    router.push("/chat");
    router.refresh();
  }

  function next() {
    if (!validateCurrent()) {
      toast.error(t("errorSave"));
      return;
    }
    if (step < STEPS) setStep(step + 1);
    else void submit();
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  const stepLabels = [t("step1"), t("step2"), t("step3"), t("step4")];

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
        <div className="flex items-center justify-between gap-2 pt-2">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div
                key={label}
                className="flex flex-1 flex-col items-center gap-1 text-center"
              >
                <div
                  className={
                    active
                      ? "bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold"
                      : done
                        ? "bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold"
                        : "border-border text-muted-foreground flex size-8 items-center justify-center rounded-full border text-xs"
                  }
                >
                  {n}
                </div>
                <span className="text-muted-foreground hidden text-[10px] leading-tight sm:block">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">{t("companyName")}</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nzbn">{t("nzbn")}</Label>
              <Input
                id="nzbn"
                value={form.nzbn}
                onChange={(e) => update("nzbn", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("entityType")}</Label>
              <Select
                value={form.entity_type}
                onValueChange={(v) =>
                  update("entity_type", v as OnboardingFormValues["entity_type"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">{t("entity_company")}</SelectItem>
                  <SelectItem value="sole_trader">
                    {t("entity_sole_trader")}
                  </SelectItem>
                  <SelectItem value="partnership">
                    {t("entity_partnership")}
                  </SelectItem>
                  <SelectItem value="trust">{t("entity_trust")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="gst_number">{t("gstNumber")}</Label>
              <Input
                id="gst_number"
                value={form.gst_number}
                onChange={(e) => update("gst_number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("gstFrequency")}</Label>
              <Select
                value={form.gst_filing_frequency}
                onValueChange={(v) =>
                  update(
                    "gst_filing_frequency",
                    v as OnboardingFormValues["gst_filing_frequency"],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t("gst_monthly")}</SelectItem>
                  <SelectItem value="2monthly">{t("gst_2monthly")}</SelectItem>
                  <SelectItem value="6monthly">{t("gst_6monthly")}</SelectItem>
                  <SelectItem value="not_registered">
                    {t("gst_not_registered")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance_date">{t("balanceDate")}</Label>
              <Input
                id="balance_date"
                type="date"
                value={form.balance_date}
                onChange={(e) => update("balance_date", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="employee_count">{t("employeeCount")}</Label>
              <Input
                id="employee_count"
                type="number"
                min={0}
                value={form.employee_count}
                onChange={(e) =>
                  update("employee_count", Number.parseInt(e.target.value, 10) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("kiwisaverEnrolled")}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.kiwisaver_enrolled ? "default" : "outline"}
                  onClick={() => update("kiwisaver_enrolled", true)}
                >
                  {t("yes")}
                </Button>
                <Button
                  type="button"
                  variant={!form.kiwisaver_enrolled ? "default" : "outline"}
                  onClick={() => update("kiwisaver_enrolled", false)}
                >
                  {t("no")}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <Label>{t("industry")}</Label>
            <Select
              value={form.industry}
              onValueChange={(v) =>
                update("industry", v as OnboardingFormValues["industry"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">
                  {t("industry_restaurant")}
                </SelectItem>
                <SelectItem value="retail">{t("industry_retail")}</SelectItem>
                <SelectItem value="construction">
                  {t("industry_construction")}
                </SelectItem>
                <SelectItem value="import_export">
                  {t("industry_import_export")}
                </SelectItem>
                <SelectItem value="it">{t("industry_it")}</SelectItem>
                <SelectItem value="property">{t("industry_property")}</SelectItem>
                <SelectItem value="other">{t("industry_other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          disabled={step === 1 || loading}
        >
          {t("back")}
        </Button>
        <Button type="button" onClick={next} disabled={loading}>
          {loading ? t("saving") : step === STEPS ? t("finish") : t("next")}
        </Button>
      </CardFooter>
    </Card>
  );
}
