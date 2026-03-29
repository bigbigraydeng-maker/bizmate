"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("landing");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          BizMate
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">{t("feature_aiChat_title")}</Link>
          <Link href="/calculators" className="text-muted-foreground hover:text-foreground transition-colors">{t("feature_calculator_title")}</Link>
          <Link href="/gp" className="text-muted-foreground hover:text-foreground transition-colors">{t("feature_gp_title")}</Link>
          <Link href="/flights" className="text-muted-foreground hover:text-foreground transition-colors">{t("feature_flights_title")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            {t("ctaLogin")}
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
            {t("ctaStart")}
          </Link>
        </div>
      </div>
    </header>
  );
}
