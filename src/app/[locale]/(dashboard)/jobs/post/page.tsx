import { getTranslations, setRequestLocale } from "next-intl/server";

import { PostJobForm } from "@/components/jobs/post-job-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "jobs" });
  return { title: t("postJobTitle") };
}

export default async function PostJobPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <PostJobForm />
    </main>
  );
}
