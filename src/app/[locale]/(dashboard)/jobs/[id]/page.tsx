import { getTranslations, setRequestLocale } from "next-intl/server";

import { JobDetail } from "@/components/jobs/job-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("pageTitle") };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <JobDetail jobId={id} />
    </main>
  );
}
