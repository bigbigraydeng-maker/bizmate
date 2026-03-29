"use client";

import { useTranslations } from "next-intl";

export function Steps() {
  const t = useTranslations("landing");

  const steps = [
    { num: "1", key: "register" },
    { num: "2", key: "onboard" },
    { num: "3", key: "use" },
  ];

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          {t("stepsTitle")}
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-4">
          {steps.map(({ num, key }, i) => (
            <div key={key} className="flex flex-1 flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {num}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden h-0.5 w-full bg-primary/20 md:block md:absolute" />
              )}
              <h3 className="mt-3 font-semibold">{t(`step_${key}_title`)}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{t(`step_${key}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
