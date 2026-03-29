import { getTranslations } from "next-intl/server";

import { ComplianceCalendar } from "@/components/calendar/compliance-calendar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendar" });
  return { title: t("pageTitle") };
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendar" });

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
      </div>
      <ComplianceCalendar />
    </main>
  );
}
