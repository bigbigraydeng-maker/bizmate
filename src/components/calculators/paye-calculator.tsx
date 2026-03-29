"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNzd, formatPercent } from "@/lib/format-nz";
import { calculateAnnualPayeBreakdown } from "@/lib/nz-rules/paye";

export function PayeCalculator() {
  const t = useTranslations("calculators.paye");
  const [raw, setRaw] = useState("65000");

  const gross = Number.parseFloat(raw.replace(",", ".")) || 0;

  const breakdown = useMemo(
    () => calculateAnnualPayeBreakdown(gross),
    [gross],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("grossAnnual")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paye-gross">{t("grossAnnual")}</Label>
          <Input
            id="paye-gross"
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("payeAnnual")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.payeAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("accAnnual")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.accAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("combined")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.payeAndAccAnnual)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("takeHome")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {formatNzd(breakdown.takeHomeAfterPayeAndAcc)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("monthlyPaye")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(breakdown.monthlyPaye)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("weeklyPaye")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(breakdown.weeklyPaye)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("effectivePaye")}</dt>
            <dd className="font-medium tabular-nums">
              {formatPercent(breakdown.effectivePayeRate)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("effectiveCombined")}</dt>
            <dd className="font-medium tabular-nums">
              {formatPercent(breakdown.effectivePayeAndAccRate)}
            </dd>
          </div>
        </dl>
        <div>
          <p className="text-muted-foreground mb-2 text-sm font-medium">
            {t("brackets")}
          </p>
          <div className="overflow-x-auto rounded-md border border-border">
            <div className="divide-y divide-border text-sm">
              <div className="bg-muted/40 grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-2 font-medium">
                <span>{t("columnBand")}</span>
                <span className="text-right">{t("columnRate")}</span>
                <span className="text-right">{t("columnTax")}</span>
              </div>
              {breakdown.brackets.map((b, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-2"
                >
                  <span className="tabular-nums">
                    {formatNzd(b.bandFrom)} – {formatNzd(b.bandTo)}
                  </span>
                  <span className="text-right">
                    {(b.rate * 100).toFixed(1)}%
                  </span>
                  <span className="text-right tabular-nums">
                    {formatNzd(b.taxInBand)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
