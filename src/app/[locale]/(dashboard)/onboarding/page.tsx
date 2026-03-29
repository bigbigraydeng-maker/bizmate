import { setRequestLocale } from "next-intl/server";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto w-full max-w-2xl py-4">
      <OnboardingWizard />
    </div>
  );
}
