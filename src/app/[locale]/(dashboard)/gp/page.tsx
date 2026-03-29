import { getTranslations } from "next-intl/server";

import { GpFinder } from "@/components/gp/gp-finder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gp" });
  return { title: t("pageTitle") };
}

export default async function GpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gp" });

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">{t("subtitle")}</p>
      </div>
      <GpFinder />
    </main>
  );
}
