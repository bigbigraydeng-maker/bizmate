"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNzd } from "@/lib/format-nz";
import { convertNzdCny, FALLBACK_NZD_TO_CNY } from "@/lib/nz-rules/currency";

type Direction = "nzd_to_cny" | "cny_to_nzd";

function formatCny(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CurrencyCalculator() {
  const t = useTranslations("calculators.currency");
  const [raw, setRaw] = useState("10000");
  const [rawRate, setRawRate] = useState(FALLBACK_NZD_TO_CNY.toString());
  const [direction, setDirection] = useState<Direction>("nzd_to_cny");

  const amount = Number.parseFloat(raw.replace(",", ".")) || 0;
  const rate = Number.parseFloat(rawRate.replace(",", ".")) || FALLBACK_NZD_TO_CNY;

  const result = useMemo(
    () => convertNzdCny(amount, direction, rate),
    [amount, direction, rate],
  );

  const isNzdToCny = direction === "nzd_to_cny";

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={isNzdToCny ? "default" : "outline"}
            onClick={() => setDirection("nzd_to_cny")}
          >
            NZD → CNY
          </Button>
          <Button
            type="button"
            size="sm"
            variant={!isNzdToCny ? "default" : "outline"}
            onClick={() => setDirection("cny_to_nzd")}
          >
            CNY → NZD
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cur-amount">
              {isNzdToCny ? t("amountNzd") : t("amountCny")}
            </Label>
            <Input
              id="cur-amount"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cur-rate">{t("exchangeRate")}</Label>
            <Input
              id="cur-rate"
              inputMode="decimal"
              value={rawRate}
              onChange={(e) => setRawRate(e.target.value)}
            />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("converted")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {isNzdToCny ? formatCny(result.cnyAmount) : formatNzd(result.nzdAmount)}
            </dd>
          </div>
          <div className="rounded-md bg-primary/10 p-3">
            <dt className="text-muted-foreground">{t("effectiveReceived")}</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {isNzdToCny
                ? formatCny(result.effectiveCnyReceived)
                : formatNzd(result.effectiveCnyReceived)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("bankFee")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.bankWireFee)}</dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("bankMargin")}</dt>
            <dd className="font-medium tabular-nums">
              {isNzdToCny ? formatCny(result.bankMarginLoss) : formatNzd(result.bankMarginLoss)}
            </dd>
          </div>
        </dl>

        <p className="text-muted-foreground text-xs">{t("rateNote")}</p>
      </CardContent>
    </Card>
  );
}
