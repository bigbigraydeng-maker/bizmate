"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4361ee] to-[#7c3aed] px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center text-white">
        <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          {t("freeBadge")}
        </div>
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          {t("headline")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
          {t("subheadline")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-[#4361ee] hover:bg-white/90",
            )}
          >
            {t("ctaStart")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/40 text-white hover:bg-white/10",
            )}
          >
            {t("ctaLogin")}
          </Link>
        </div>
      </div>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
    </section>
  );
}
