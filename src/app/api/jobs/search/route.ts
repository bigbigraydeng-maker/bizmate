import { NextResponse } from "next/server";

import { searchSeekJobs, type SeekJob } from "@/lib/integrations/seek";
import { searchTradeMeJobs, isTradeMeConfigured, type TradeMeJob } from "@/lib/integrations/trademe-jobs";

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

function seekToExternal(job: SeekJob): ExternalJob {
  return {
    id: `seek-${job.id}`,
    title: job.title,
    company: job.companyName,
    location: job.location,
    salary: job.salaryLabel,
    jobType: job.workTypes.join(", "),
    description: job.teaser,
    postedDate: job.listingDate,
    postedDisplay: job.listingDateDisplay,
    sourceUrl: job.seekUrl,
    source: "seek",
    logoUrl: job.logoUrl,
  };
}

function trademeToExternal(job: TradeMeJob): ExternalJob {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    jobType: job.jobType,
    description: job.description,
    postedDate: job.listingDate,
    postedDisplay: "",
    sourceUrl: job.trademeUrl,
    source: "trademe",
    logoUrl: null,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get("keywords")?.split(",").filter(Boolean) ?? ["Chinese", "Mandarin"];

  // Fetch from both sources in parallel
  const [seekResult, trademeResult] = await Promise.all([
    searchSeekJobs(keywords, 30),
    searchTradeMeJobs(keywords, 30),
  ]);

  const jobs: ExternalJob[] = [
    ...seekResult.jobs.map(seekToExternal),
    ...trademeResult.jobs.map(trademeToExternal),
  ];

  // Sort by posted date descending
  jobs.sort((a, b) => {
    const da = a.postedDate ? new Date(a.postedDate).getTime() : 0;
    const db = b.postedDate ? new Date(b.postedDate).getTime() : 0;
    return db - da;
  });

  return NextResponse.json({
    jobs,
    totalCount: seekResult.totalCount + trademeResult.totalCount,
    sources: {
      seek: seekResult.jobs.length,
      trademe: trademeResult.jobs.length,
      trademeConfigured: isTradeMeConfigured(),
    },
  });
}
