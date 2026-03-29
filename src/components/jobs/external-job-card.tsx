"use client";

import { MapPin, DollarSign, Clock, Building2, ExternalLink } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ExternalJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  description: string;
  postedDate: string;
  postedDisplay: string;
  sourceUrl: string;
  source: "seek" | "trademe";
  logoUrl: string | null;
};

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  seek: { label: "Seek", color: "bg-purple-100 text-purple-800" },
  trademe: { label: "TradeMe", color: "bg-orange-100 text-orange-800" },
};

export function ExternalJobCard({ job }: { job: ExternalJob }) {
  const src = SOURCE_LABELS[job.source] ?? { label: job.source, color: "bg-muted" };

  return (
    <a
      href={job.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group-hover:scale-[1.01]">
        <CardContent className="space-y-3 pt-5 pb-5">
          {/* Title + Source badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>
            <Badge className={`shrink-0 text-xs ${src.color}`}>
              {src.label}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Badge>
          </div>

          {/* Company */}
          {job.company && (
            <p className="flex items-center gap-1 text-sm font-medium">
              {job.logoUrl ? (
                <img src={job.logoUrl} alt="" className="h-4 w-4 rounded" />
              ) : (
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {job.company}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> {job.salary}
              </span>
            )}
            {(job.postedDisplay || job.postedDate) && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.postedDisplay || new Date(job.postedDate).toLocaleDateString("zh-CN")}
              </span>
            )}
          </div>

          {/* Job type */}
          {job.jobType && (
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs">
                {job.jobType}
              </Badge>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
