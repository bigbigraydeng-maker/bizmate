"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  { key: "aiChat", icon: Brain, href: "/chat" },
  { key: "calculator", icon: Calculator, href: "/calculators" },
  { key: "calendar", icon: Calendar, href: "/calendar" },
  { key: "gp", icon: Stethoscope, href: "/gp" },
  { key: "flights", icon: Plane, href: "/flights" },
  { key: "jobs", icon: Briefcase, href: "/jobs" },
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
          {FEATURES.map(({ key, icon: Icon, href }) => (
            <Link key={key} href={href} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group-hover:scale-[1.02]">
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{t(`feature_${key}_title`)}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{t(`feature_${key}_desc`)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
