"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Clock, DollarSign, Languages, Briefcase } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type JobListingRow = {
  id: string;
  title: string;
  title_zh: string | null;
  description: string;
  description_zh: string | null;
  job_type: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: string | null;
  languages_required: string[] | null;
  visa_sponsorship: boolean | null;
  is_active: boolean | null;
  created_at: string;
  poster_id: string;
  company_id: string | null;
};

function formatSalary(min: number | null, max: number | null, type: string | null): string {
  if (!min && !max) return "";
  const suffix = type === "hourly" ? "/时" : "/年";
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}${suffix}`;
  if (min) return `$${min.toLocaleString()}+${suffix}`;
  return `最高 $${max!.toLocaleString()}${suffix}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}个月前`;
}

export function JobCard({ job }: { job: JobListingRow }) {
  const t = useTranslations("jobs");
  const title = job.title_zh || job.title;
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_type);

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group-hover:scale-[1.01]">
        <CardContent className="space-y-3 pt-5 pb-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {t(`type_${job.job_type}`)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            {salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> {salary}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {timeAgo(job.created_at)}
            </span>
          </div>

          {job.languages_required && job.languages_required.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Languages className="h-3.5 w-3.5" />
              {job.languages_required.map((lang) => (
                <Badge key={lang} variant="outline" className="text-xs px-1.5 py-0">
                  {lang}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {job.visa_sponsorship && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Briefcase className="mr-1 h-3 w-3" /> {t("visaSponsorship")}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description_zh || job.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
