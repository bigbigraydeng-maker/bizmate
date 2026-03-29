import { getTranslations, setRequestLocale } from "next-intl/server";

import { JobList } from "@/components/jobs/job-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("pageTitle") };
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <JobList />
    </main>
  );
}
