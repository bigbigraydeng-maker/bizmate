import { getTranslations, setRequestLocale } from "next-intl/server";

import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { PainPoints } from "@/components/marketing/pain-points";
import { Features } from "@/components/marketing/features";
import { Steps } from "@/components/marketing/steps";
import { Trust } from "@/components/marketing/trust";
import { Footer } from "@/components/marketing/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <PainPoints />
      <Features />
      <Steps />
      <Trust />
      <Footer />
    </main>
  );
}
