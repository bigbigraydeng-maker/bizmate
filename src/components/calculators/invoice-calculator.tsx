"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatNzd } from "@/lib/format-nz";
import { calculateInvoice } from "@/lib/nz-rules/invoice";

type LineInput = { description: string; quantity: string; unitPrice: string };

const emptyLine = (): LineInput => ({ description: "", quantity: "1", unitPrice: "0" });

export function InvoiceCalculator() {
  const t = useTranslations("calculators.invoice");
  const [lines, setLines] = useState<LineInput[]>([
    { description: "", quantity: "1", unitPrice: "500" },
  ]);
  const [rawDiscount, setRawDiscount] = useState("0");
  const [gstRegistered, setGstRegistered] = useState(true);
  const [rawWht, setRawWht] = useState("0");

  const parsedLines = lines.map((l) => ({
    description: l.description || t("lineDefault"),
    quantity: Number.parseFloat(l.quantity) || 0,
    unitPrice: Number.parseFloat(l.unitPrice) || 0,
  }));
  const discount = Number.parseFloat(rawDiscount) || 0;
  const wht = Number.parseFloat(rawWht) || 0;

  const result = useMemo(
    () =>
      calculateInvoice(parsedLines, {
        discountPercent: discount,
        isGstRegistered: gstRegistered,
        withholdingTaxPercent: wht,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(parsedLines), discount, gstRegistered, wht],
  );

  const updateLine = (index: number, field: keyof LineInput, value: string) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (index: number) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* Line items */}
        <div className="space-y-3">
          <Label>{t("lineItems")}</Label>
          {lines.map((line, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                {i === 0 && <span className="text-muted-foreground text-xs">{t("description")}</span>}
                <Input
                  placeholder={t("lineDefault")}
                  value={line.description}
                  onChange={(e) => updateLine(i, "description", e.target.value)}
                />
              </div>
              <div className="w-20 space-y-1">
                {i === 0 && <span className="text-muted-foreground text-xs">{t("qty")}</span>}
                <Input
                  inputMode="decimal"
                  value={line.quantity}
                  onChange={(e) => updateLine(i, "quantity", e.target.value)}
                />
              </div>
              <div className="w-28 space-y-1">
                {i === 0 && <span className="text-muted-foreground text-xs">{t("unitPrice")}</span>}
                <Input
                  inputMode="decimal"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(i, "unitPrice", e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLine(i)}
                disabled={lines.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="mr-1 h-4 w-4" /> {t("addLine")}
          </Button>
        </div>

        {/* Options */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="inv-disc">{t("discountPercent")}</Label>
            <Input
              id="inv-disc"
              inputMode="decimal"
              value={rawDiscount}
              onChange={(e) => setRawDiscount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-wht">{t("withholdingTax")}</Label>
            <Input
              id="inv-wht"
              inputMode="decimal"
              value={rawWht}
              onChange={(e) => setRawWht(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2 pb-0.5">
            <Button
              type="button"
              size="sm"
              variant={gstRegistered ? "default" : "outline"}
              onClick={() => setGstRegistered(true)}
            >
              {t("gstYes")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={!gstRegistered ? "default" : "outline"}
              onClick={() => setGstRegistered(false)}
            >
              {t("gstNo")}
            </Button>
          </div>
        </div>

        {/* Results */}
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("subtotal")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.subtotal)}</dd>
          </div>
          {result.discountAmount > 0 && (
            <div className="rounded-md bg-muted/50 p-3">
              <dt className="text-muted-foreground">{t("discount")}</dt>
              <dd className="font-medium tabular-nums">-{formatNzd(result.discountAmount)}</dd>
            </div>
          )}
          <div className="rounded-md bg-muted/50 p-3">
            <dt className="text-muted-foreground">{t("gstAmount")}</dt>
            <dd className="font-medium tabular-nums">{formatNzd(result.gstAmount)}</dd>
          </div>
          {result.withholdingTaxAmount > 0 && (
            <div className="rounded-md bg-muted/50 p-3">
              <dt className="text-muted-foreground">{t("whtAmount")}</dt>
              <dd className="font-medium tabular-nums">-{formatNzd(result.withholdingTaxAmount)}</dd>
            </div>
          )}
          <div className="rounded-md bg-primary/10 p-3 md:col-span-2">
            <dt className="text-muted-foreground">{t("amountDue")}</dt>
            <dd className="text-2xl font-bold tabular-nums">{formatNzd(result.amountDue)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
