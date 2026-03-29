"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNzd } from "@/lib/format-nz";
import { calculateLeaveEntitlement } from "@/lib/nz-rules/leave-entitlement";

export function LeaveCalculator() {
  const t = useTranslations("calculators.leave");
  const [rawMonths, setRawMonths] = useState("12");
  const [rawDaily, setRawDaily] = useState("250");
  const [rawDays, setRawDays] = useState("5");

  const months = Number.parseInt(rawMonths, 10) || 0;
  const daily = Number.parseFloat(rawDaily.replace(",", ".")) || 0;
  const daysPerWeek = Number.parseInt(rawDays, 10) || 5;

  const result = useMemo(
    () => calculateLeaveEntitlement(months, daily, daysPerWeek),
    [months, daily, daysPerWeek],
  );

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="lv-months">{t("monthsEmployed")}</Label>
            <Input
              id="lv-months"
              inputMode="numeric"
              value={rawMonths}
              onChange={(e) => setRawMonths(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lv-daily">{t("dailyRate")}</Label>
            <Input
              id="lv-daily"
              inputMode="decimal"
              value={rawDaily}
              onChange={(e) => setRawDaily(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lv-dpw">{t("daysPerWeek")}</Label>
            <Input
              id="lv-dpw"
              inputMode="numeric"
              value={rawDays}
              onChange={(e) => setRawDays(e.target.value)}
            />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("annualLeave")}</dt>
            <dd className="font-medium">
              {result.annualLeaveWeeks} {t("weeks")} ({result.annualLeaveDays} {t("days")})
            </dd>
            <dd className="text-muted-foreground text-xs">{t("annualLeaveValue")}: {formatNzd(result.annualLeaveValue)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("sickLeave")}</dt>
            <dd className="font-medium">{result.sickLeaveDays} {t("days")}</dd>
            <dd className="text-muted-foreground text-xs">{t("sickLeaveValue")}: {formatNzd(result.sickLeaveValue)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("bereavement")}</dt>
            <dd className="font-medium">
              {result.bereavementCloseDays} {t("days")} ({t("closeFam")}) / {result.bereavementOtherDays} {t("day")} ({t("other")})
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("publicHolidays")}</dt>
            <dd className="font-medium">{result.publicHolidayDays} {t("days")}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("domesticViolence")}</dt>
            <dd className="font-medium">{result.domesticViolenceDays} {t("days")}</dd>
          </div>
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("totalPaidLeave")}</dt>
            <dd className="text-lg font-semibold">{result.totalPaidLeaveDays} {t("days")}</dd>
          </div>
        </dl>

        {months < 12 && (
          <p className="text-muted-foreground text-xs">{t("under12Note")}</p>
        )}
      </CardContent>
    </Card>
  );
}
