"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNzd, formatPercent } from "@/lib/format-nz";
import { calculateEmployeeCost } from "@/lib/nz-rules/employee-cost";

export function EmployeeCostCalculator() {
  const t = useTranslations("calculators.employeeCost");
  const [rawGross, setRawGross] = useState("55000");
  const [rawKs, setRawKs] = useState("3");

  const gross = Number.parseFloat(rawGross.replace(",", ".")) || 0;
  const ks = Number.parseFloat(rawKs.replace(",", ".")) || 3;

  const result = useMemo(() => calculateEmployeeCost(gross, ks), [gross, ks]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ec-gross">{t("grossAnnual")}</Label>
            <Input
              id="ec-gross"
              inputMode="decimal"
              value={rawGross}
              onChange={(e) => setRawGross(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ec-ks">{t("kiwisaverRate")}</Label>
            <Input
              id="ec-ks"
              inputMode="decimal"
              value={rawKs}
              onChange={(e) => setRawKs(e.target.value)}
            />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("kiwisaverEmployer")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.kiwisaverEmployer)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("esct")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.esctOnKiwisaver)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("accLevy")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.accEmployerLevy)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("annualLeave")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.annualLeaveProvision)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("publicHolidays")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.publicHolidayProvision)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("sickLeave")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.sickLeaveProvision)}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("totalOnCosts")}</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatNzd(result.totalOnCosts)}</dd>
          </div>
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("totalCost")}</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatNzd(result.totalCostToEmployer)}</dd>
          </div>
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("hourlyEquivalent")}</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatNzd(result.hourlyEquivalent)}/hr</dd>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          {t("onCostNote", { percent: formatPercent(result.onCostPercentage) })}
        </p>
      </CardContent>
    </Card>
  );
}
