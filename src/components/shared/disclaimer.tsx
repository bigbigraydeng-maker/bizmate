"use client";

import { useTranslations } from "next-intl";

export function ChatDisclaimer() {
  const t = useTranslations("chat");

  return (
    <div className="border-t border-border bg-muted/40 px-4 py-3 text-center text-xs text-muted-foreground">
      <p className="font-medium text-foreground">{t("disclaimerTitle")}</p>
      <p className="mt-1 max-w-3xl mx-auto leading-relaxed">{t("disclaimerBody")}</p>
    </div>
  );
}
