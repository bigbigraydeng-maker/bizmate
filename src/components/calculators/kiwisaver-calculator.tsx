"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNzd } from "@/lib/format-nz";
import {
  calculateKiwisaver,
  EMPLOYEE_RATES_PERCENT,
  EMPLOYER_MIN_RATE_PERCENT,
  type EmployeeRatePercent,
} from "@/lib/nz-rules/kiwisaver";

export function KiwisaverCalculator() {
  const t = useTranslations("calculators.kiwisaver");
  const [raw, setRaw] = useState("65000");
  const [employeePct, setEmployeePct] = useState<EmployeeRatePercent>(3);
  const [employerPct, setEmployerPct] = useState(String(EMPLOYER_MIN_RATE_PERCENT));

  const gross = Number.parseFloat(raw.replace(",", ".")) || 0;
  const employer = Math.max(
    EMPLOYER_MIN_RATE_PERCENT,
    Number.parseFloat(employerPct) || EMPLOYER_MIN_RATE_PERCENT,
  );

  const breakdown = useMemo(
    () => calculateKiwisaver(gross, employeePct, employer),
    [gross, employeePct, employer],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("grossAnnual")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ks-gross">{t("grossAnnual")}</Label>
          <Input
            id="ks-gross"
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("employeeRate")}</Label>
            <Select
              value={String(employeePct)}
              onValueChange={(v) =>
                setEmployeePct(Number(v) as EmployeeRatePercent)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_RATES_PERCENT.map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {r}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ks-er">{t("employerRate")}</Label>
            <Input
              id="ks-er"
              inputMode="decimal"
              value={employerPct}
              onChange={(e) => setEmployerPct(e.target.value)}
            />
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("employeeAnnual")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.employeeAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("employerAnnual")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.employerAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("esctNote")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(breakdown.esctOnEmployerAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("employerCost")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(breakdown.employerCostIncludingEsct)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3 md:col-span-2">
            <dt className="text-muted-foreground">{t("totalContributions")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.totalEmployeePlusEmployerContributions)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
