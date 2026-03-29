"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNzd } from "@/lib/format-nz";
import { addGst, removeGst } from "@/lib/nz-rules/gst";

type Mode = "add" | "remove";

export function GstCalculator() {
  const t = useTranslations("calculators.gst");
  const [raw, setRaw] = useState("100");
  const [mode, setMode] = useState<Mode>("add");

  const amount = Number.parseFloat(raw.replace(",", ".")) || 0;

  const result = useMemo(() => {
    if (mode === "add") return addGst(amount);
    return removeGst(amount);
  }, [amount, mode]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "add" ? "default" : "outline"}
            onClick={() => setMode("add")}
          >
            {t("modeAdd")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "remove" ? "default" : "outline"}
            onClick={() => setMode("remove")}
          >
            {t("modeRemove")}
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gst-amount">{t("amount")}</Label>
          <Input
            id="gst-amount"
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("gstAmount")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(result.gstAmount)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("totalExcl")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(result.totalExclGst)}
            </dd>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("totalIncl")}</dt>
            <dd className="font-medium tabular-nums">
              {formatNzd(result.totalInclGst)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
