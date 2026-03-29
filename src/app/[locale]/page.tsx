import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  const tCommon = await getTranslations("common");
  const tMvp = await getTranslations("mvp");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium text-primary">
          {tCommon("appName")}
        </span>
        <LocaleSwitcher />
      </header>

      <section className="space-y-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
          {t("headline")}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {t("tagline")}
        </p>
        <p className="rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
          {tCommon("freePhase")}
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <p>{t("positioningPaid")}</p>
        <p>{t("positioningFree")}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">{tMvp("title")}</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>{tMvp("aiChat")}</li>
          <li>{tMvp("taxCalc")}</li>
          <li>{tMvp("complianceCal")}</li>
          <li>{tMvp("findGp")}</li>
          <li>{tMvp("userSystem")}</li>
          <li>{tMvp("stripeNote")}</li>
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">{t("localeHint")}</p>
    </main>
  );
}
