"use client";

import { useTranslations } from "next-intl";
import { Bot, BookOpen, LayoutDashboard } from "lucide-react";

const POINTS = [
  { key: "labor", icon: Bot },
  { key: "tax", icon: BookOpen },
  { key: "scattered", icon: LayoutDashboard },
] as const;

export function PainPoints() {
  const t = useTranslations("landing");

  return (
    <section className="bg-muted/40 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          {t("painTitle")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {POINTS.map(({ key, icon: Icon }) => (
            <div key={key} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t(`pain_${key}_title`)}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{t(`pain_${key}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
