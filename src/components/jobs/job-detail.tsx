"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Clock,
  DollarSign,
  Languages,
  Briefcase,
  ArrowLeft,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { JobListingRow } from "./job-card";

function formatSalary(min: number | null, max: number | null, type: string | null): string {
  if (!min && !max) return "面议";
  const suffix = type === "hourly" ? "/小时" : "/年";
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()} NZD${suffix}`;
  if (min) return `$${min.toLocaleString()}+ NZD${suffix}`;
  return `最高 $${max!.toLocaleString()} NZD${suffix}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function JobDetail({ jobId }: { jobId: string }) {
  const t = useTranslations("jobs");
  const [job, setJob] = useState<JobListingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("job_listings")
        .select("*")
        .eq("id", jobId)
        .single();

      if (err) throw err;
      setJob(data as JobListingRow);
    } catch {
      // Check if it's a mock job
      if (jobId.startsWith("mock-")) {
        setError(null);
        setJob(null); // mock jobs don't have detail
      } else {
        setError(t("loadError"));
      }
    } finally {
      setLoading(false);
    }
  }, [jobId, t]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title_zh || job?.title || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground p-8">{t("loading")}</p>;
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-muted-foreground">{error || t("jobNotFound")}</p>
        <Link href="/jobs" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-1 h-4 w-4" /> {t("backToList")}
          </Button>
        </Link>
      </div>
    );
  }

  const title = job.title_zh || job.title;
  const description = job.description_zh || job.description;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToList")}
      </Link>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{t(`type_${job.job_type}`)}</Badge>
                {job.visa_sponsorship && (
                  <Badge className="bg-green-100 text-green-800">
                    <Briefcase className="mr-1 h-3 w-3" /> {t("visaSponsorship")}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Key info */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">{t("detailLocation")}</p>
              <p className="flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("detailSalary")}</p>
              <p className="flex items-center gap-1 font-medium">
                <DollarSign className="h-3.5 w-3.5" />
                {formatSalary(job.salary_min, job.salary_max, job.salary_type)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("detailPosted")}</p>
              <p className="flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5" /> {formatDate(job.created_at)}
              </p>
            </div>
            {job.languages_required && job.languages_required.length > 0 && (
              <div>
                <p className="text-muted-foreground">{t("detailLanguages")}</p>
                <p className="flex items-center gap-1 font-medium">
                  <Languages className="h-3.5 w-3.5" />
                  {job.languages_required.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="font-semibold">{t("detailDescription")}</h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{description}</div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 border-t pt-4">
            <Button className="flex-1" onClick={handleShare}>
              {t("shareJob")}
            </Button>
            <Link href="/jobs">
              <Button variant="outline">{t("backToList")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
