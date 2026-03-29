"use client";

import { useTranslations } from "next-intl";

import { GstCalculator } from "@/components/calculators/gst-calculator";
import { KiwisaverCalculator } from "@/components/calculators/kiwisaver-calculator";
import { PayeCalculator } from "@/components/calculators/paye-calculator";
import { EmployeeCostCalculator } from "@/components/calculators/employee-cost-calculator";
import { SalaryConverter } from "@/components/calculators/salary-converter";
import { LeaveCalculator } from "@/components/calculators/leave-calculator";
import { CurrencyCalculator } from "@/components/calculators/currency-calculator";
import { InvoiceCalculator } from "@/components/calculators/invoice-calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CalculatorsTabs() {
  const t = useTranslations("calculators");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground max-w-2xl text-sm">{t("disclaimer")}</p>
      <Tabs defaultValue="gst" className="w-full">
        <TabsList variant="line" className="w-full flex-wrap">
          <TabsTrigger value="gst">{t("gstTab")}</TabsTrigger>
          <TabsTrigger value="paye">{t("payeTab")}</TabsTrigger>
          <TabsTrigger value="kiwisaver">{t("kiwisaverTab")}</TabsTrigger>
          <TabsTrigger value="employeeCost">{t("employeeCostTab")}</TabsTrigger>
          <TabsTrigger value="salary">{t("salaryTab")}</TabsTrigger>
          <TabsTrigger value="leave">{t("leaveTab")}</TabsTrigger>
          <TabsTrigger value="currency">{t("currencyTab")}</TabsTrigger>
          <TabsTrigger value="invoice">{t("invoiceTab")}</TabsTrigger>
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
        <TabsContent value="employeeCost" className="mt-4">
          <EmployeeCostCalculator />
        </TabsContent>
        <TabsContent value="salary" className="mt-4">
          <SalaryConverter />
        </TabsContent>
        <TabsContent value="leave" className="mt-4">
          <LeaveCalculator />
        </TabsContent>
        <TabsContent value="currency" className="mt-4">
          <CurrencyCalculator />
        </TabsContent>
        <TabsContent value="invoice" className="mt-4">
          <InvoiceCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
