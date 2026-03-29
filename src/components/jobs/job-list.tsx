"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { JobCard, type JobListingRow } from "./job-card";
import { JobFilterBar, type JobFilters } from "./job-filters";

export function JobList() {
  const t = useTranslations("jobs");
  const [jobs, setJobs] = useState<JobListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    jobType: "all",
    location: "all",
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      let query = supabase
        .from("job_listings")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (filters.jobType !== "all") {
        query = query.eq("job_type", filters.jobType);
      }
      if (filters.location !== "all") {
        query = query.eq("location", filters.location);
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,title_zh.ilike.%${filters.search}%,description_zh.ilike.%${filters.search}%`,
        );
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setJobs((data as JobListingRow[]) ?? []);
    } catch {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Also include mock data when DB is empty for demo
  const displayJobs = useMemo(() => {
    if (jobs.length > 0) return jobs;
    return MOCK_JOBS;
  }, [jobs]);

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
        <Link href="/jobs/post">
          <Button>
            <Plus className="mr-1 h-4 w-4" /> {t("postJob")}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <JobFilterBar filters={filters} onChange={setFilters} />

      {/* Results */}
      {loading && <p className="text-muted-foreground text-sm">{t("loading")}</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && displayJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground mt-4">{t("noJobs")}</p>
          <Link href="/jobs/post" className="mt-4">
            <Button variant="outline">{t("postFirst")}</Button>
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

/** Demo mock data shown when database is empty */
const MOCK_JOBS: JobListingRow[] = [
  {
    id: "mock-1",
    title: "Chinese Speaking Accountant",
    title_zh: "中文会计（全职）",
    description: "Seeking a bilingual accountant for our Auckland office.",
    description_zh: "招聘中英双语会计，负责客户记账、GST 申报、年度报表。需有新西兰会计资质或相关经验。",
    job_type: "full_time",
    location: "Auckland",
    salary_min: 55000,
    salary_max: 75000,
    salary_type: "annual",
    languages_required: ["中文", "English"],
    visa_sponsorship: false,
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
  {
    id: "mock-2",
    title: "Restaurant Kitchen Hand",
    title_zh: "中餐厅厨房帮手",
    description: "Part-time kitchen hand for a busy Chinese restaurant.",
    description_zh: "繁忙中餐厅招厨房帮手，负责备菜、清洁、协助厨师。周末需上班，时薪 $23.15–$28。",
    job_type: "part_time",
    location: "Auckland",
    salary_min: 23.15,
    salary_max: 28,
    salary_type: "hourly",
    languages_required: ["中文"],
    visa_sponsorship: false,
    is_active: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
  {
    id: "mock-3",
    title: "Full Stack Developer",
    title_zh: "全栈开发工程师",
    description: "Join our tech team in Wellington.",
    description_zh: "科技公司招全栈开发，React + Node.js，远程/混合办公。提供工签担保，年薪 $90K–$120K。",
    job_type: "full_time",
    location: "Wellington",
    salary_min: 90000,
    salary_max: 120000,
    salary_type: "annual",
    languages_required: ["中文", "English"],
    visa_sponsorship: true,
    is_active: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
  {
    id: "mock-4",
    title: "Sales Assistant",
    title_zh: "华人超市销售员",
    description: "Customer-facing role in a Chinese supermarket.",
    description_zh: "华人超市招销售员，需会普通话和基础英文。负责收银、理货、客户服务。可兼职。",
    job_type: "casual",
    location: "Auckland",
    salary_min: 23.15,
    salary_max: 25,
    salary_type: "hourly",
    languages_required: ["中文"],
    visa_sponsorship: false,
    is_active: true,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
  {
    id: "mock-5",
    title: "Immigration Consultant Assistant",
    title_zh: "移民顾问助理",
    description: "Assist licensed immigration advisers with case management.",
    description_zh: "持牌移民公司招助理，协助处理签证申请、文件翻译、客户沟通。中英双语必备，有移民行业经验优先。",
    job_type: "full_time",
    location: "Auckland",
    salary_min: 50000,
    salary_max: 65000,
    salary_type: "annual",
    languages_required: ["中文", "English"],
    visa_sponsorship: false,
    is_active: true,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
  {
    id: "mock-6",
    title: "Tour Guide",
    title_zh: "中文导游（南岛）",
    description: "Chinese-speaking tour guide for South Island tours.",
    description_zh: "旅游公司招中文导游，带团游览南岛景点。需有新西兰驾照和良好驾驶记录。季节性合同，包住宿。",
    job_type: "contract",
    location: "Queenstown",
    salary_min: 28,
    salary_max: 35,
    salary_type: "hourly",
    languages_required: ["中文", "English"],
    visa_sponsorship: true,
    is_active: true,
    created_at: new Date(Date.now() - 518400000).toISOString(),
    poster_id: "mock",
    company_id: null,
  },
];
