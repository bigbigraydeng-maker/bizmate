"use client";

import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

export function Trust() {
  const t = useTranslations("landing");

  return (
    <section className="bg-muted/40 px-4 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
        <Shield className="h-8 w-8 text-primary" />
        <h3 className="text-lg font-semibold">{t("trustTitle")}</h3>
        <p className="text-muted-foreground text-sm">{t("trustSources")}</p>
        <p className="text-muted-foreground text-xs">{t("trustDisclaimer")}</p>
      </div>
    </section>
  );
}
