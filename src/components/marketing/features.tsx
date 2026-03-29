"use client";

import { useTranslations } from "next-intl";
import {
  Brain,
  Calculator,
  Calendar,
  Stethoscope,
  Plane,
  Briefcase,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  { key: "aiChat", icon: Brain },
  { key: "calculator", icon: Calculator },
  { key: "calendar", icon: Calendar },
  { key: "gp", icon: Stethoscope },
  { key: "flights", icon: Plane },
  { key: "jobs", icon: Briefcase },
] as const;

export function Features() {
  const t = useTranslations("landing");

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          {t("featuresTitle")}
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-center">
          {t("featuresSubtitle")}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }) => (
            <Card key={key} className="transition-shadow hover:shadow-lg">
              <CardContent className="flex gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t(`feature_${key}_title`)}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">{t(`feature_${key}_desc`)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
