"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus, Briefcase, Search, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalJobCard, type ExternalJob } from "./external-job-card";

export function JobList() {
  const t = useTranslations("jobs");
  const [jobs, setJobs] = useState<ExternalJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocal, setSearchLocal] = useState("");
  const [sources, setSources] = useState<{ seek: number; trademe: number; trademeConfigured: boolean } | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs/search?keywords=Chinese,Mandarin");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setSources(data.sources ?? null);
      setTotalCount(data.totalCount ?? 0);
    } catch {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Client-side filter
  const filtered = searchLocal
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(searchLocal.toLowerCase()) ||
          j.company.toLowerCase().includes(searchLocal.toLowerCase()) ||
          j.location.toLowerCase().includes(searchLocal.toLowerCase()) ||
          j.description.toLowerCase().includes(searchLocal.toLowerCase()),
      )
    : jobs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            {t("heading")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t("refresh")}
          </Button>
          <Link href="/jobs/post">
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> {t("postJob")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Source stats */}
      {sources && !loading && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{t("totalJobs", { count: totalCount })}</span>
          <span>·</span>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Seek: {sources.seek} {t("jobsFound")}
          </Badge>
          {sources.trademeConfigured ? (
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              TradeMe: {sources.trademe} {t("jobsFound")}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              TradeMe: {t("notConfigured")}
            </Badge>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="mr-2 h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">{t("fetching")}</span>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground mt-4">{t("noJobs")}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <ExternalJobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Disclaimer */}
      {!loading && filtered.length > 0 && (
        <p className="text-muted-foreground text-center text-xs pt-4">
          {t("sourceDisclaimer")}
        </p>
      )}
    </div>
  );
}
