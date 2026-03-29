import { setRequestLocale } from "next-intl/server";

import { CalculatorsTabs } from "@/components/calculators/calculators-tabs";

export default async function CalculatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalculatorsTabs />;
}
