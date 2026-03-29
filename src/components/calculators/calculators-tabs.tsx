"use client";

import { useTranslations } from "next-intl";

import { GstCalculator } from "@/components/calculators/gst-calculator";
import { KiwisaverCalculator } from "@/components/calculators/kiwisaver-calculator";
import { PayeCalculator } from "@/components/calculators/paye-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CalculatorsTabs() {
  const t = useTranslations("calculators");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground max-w-2xl text-sm">{t("disclaimer")}</p>
      <Tabs defaultValue="gst" className="w-full">
        <TabsList variant="line" className="w-full max-w-md">
          <TabsTrigger value="gst">{t("gstTab")}</TabsTrigger>
          <TabsTrigger value="paye">{t("payeTab")}</TabsTrigger>
          <TabsTrigger value="kiwisaver">{t("kiwisaverTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="gst" className="mt-4">
          <GstCalculator />
        </TabsContent>
        <TabsContent value="paye" className="mt-4">
          <PayeCalculator />
        </TabsContent>
        <TabsContent value="kiwisaver" className="mt-4">
          <KiwisaverCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
