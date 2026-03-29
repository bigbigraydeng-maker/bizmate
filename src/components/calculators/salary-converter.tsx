"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNzd } from "@/lib/format-nz";
import { convertSalary, type SalaryPeriod } from "@/lib/nz-rules/salary-converter";

const PERIODS: SalaryPeriod[] = ["hourly", "weekly", "fortnightly", "monthly", "annual"];

export function SalaryConverter() {
  const t = useTranslations("calculators.salary");
  const [raw, setRaw] = useState("65000");
  const [period, setPeriod] = useState<SalaryPeriod>("annual");
  const [rawHours, setRawHours] = useState("40");

  const amount = Number.parseFloat(raw.replace(",", ".")) || 0;
  const hours = Number.parseFloat(rawHours.replace(",", ".")) || 40;

  const result = useMemo(() => convertSalary(amount, period, hours), [amount, period, hours]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={period === p ? "default" : "outline"}
              onClick={() => setPeriod(p)}
            >
              {t(`period_${p}`)}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sal-amount">{t("amount")}</Label>
            <Input
              id="sal-amount"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sal-hours">{t("hoursPerWeek")}</Label>
            <Input
              id="sal-hours"
              inputMode="decimal"
              value={rawHours}
              onChange={(e) => setRawHours(e.target.value)}
            />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {PERIODS.map((p) => (
            <div
              key={p}
              className={`rounded-md p-3 ${p === period ? "bg-primary/10" : "bg-muted/50"}`}
            >
              <dt className="text-muted-foreground">{t(`period_${p}`)}</dt>
              <dd className="text-lg font-semibold tabular-nums">{formatNzd(result[p])}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
