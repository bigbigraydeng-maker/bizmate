/**
 * Seek NZ Job Search Integration
 * Uses Seek's public search API (v5) — no authentication required.
 * Searches for Chinese/Mandarin-related jobs in New Zealand.
 */

const SEEK_API = "https://nz.seek.com/api/jobsearch/v5/search";
const SITE_KEY = "NZ-Main";

export type SeekJob = {
  id: string;
  title: string;
  teaser: string;
  companyName: string;
  location: string;
  salaryLabel: string;
  workTypes: string[];
  listingDate: string;
  listingDateDisplay: string;
  logoUrl: string | null;
  seekUrl: string;
};

type SeekApiJob = {
  id: string;
  title: string;
  teaser?: string;
  companyName?: string;
  advertiser?: { description?: string };
  salaryLabel?: string;
  workTypes?: string[];
  listingDate?: string;
  listingDateDisplay?: string;
  locations?: { label?: string }[];
  branding?: { serpLogoUrl?: string };
};

type SeekApiResponse = {
  totalCount: number;
  data: SeekApiJob[];
};

function mapSeekJob(raw: SeekApiJob): SeekJob {
  return {
    id: String(raw.id),
    title: raw.title ?? "",
    teaser: raw.teaser ?? "",
    companyName: raw.companyName ?? raw.advertiser?.description ?? "",
    location: raw.locations?.[0]?.label ?? "New Zealand",
    salaryLabel: raw.salaryLabel ?? "",
    workTypes: raw.workTypes ?? [],
    listingDate: raw.listingDate ?? "",
    listingDateDisplay: raw.listingDateDisplay ?? "",
    logoUrl: raw.branding?.serpLogoUrl ?? null,
    seekUrl: `https://nz.seek.com/job/${raw.id}`,
  };
}

/**
 * Search Seek NZ for jobs matching given keywords.
 * Runs two searches ("Chinese" and "Mandarin") and deduplicates.
 */
export async function searchSeekJobs(
  keywords: string[] = ["Chinese", "Mandarin"],
  pageSize = 20,
): Promise<{ jobs: SeekJob[]; totalCount: number }> {
  const allJobs = new Map<string, SeekJob>();
  let totalCount = 0;

  for (const keyword of keywords) {
    try {
      const params = new URLSearchParams({
        siteKey: SITE_KEY,
        keywords: keyword,
        where: "All New Zealand",
        page: "1",
        pageSize: String(pageSize),
      });

      const res = await fetch(`${SEEK_API}?${params}`, {
        headers: {
          "User-Agent": "BizMate/1.0 (NZ Chinese Business Assistant)",
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // cache 1 hour
      });

      if (!res.ok) continue;

      const data: SeekApiResponse = await res.json();
      totalCount = Math.max(totalCount, data.totalCount ?? 0);

      for (const raw of data.data ?? []) {
        if (!allJobs.has(String(raw.id))) {
          allJobs.set(String(raw.id), mapSeekJob(raw));
        }
      }
    } catch (err) {
      console.warn(`[Seek] Failed to search for "${keyword}":`, err);
    }
  }

  const jobs = Array.from(allJobs.values()).sort(
    (a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime(),
  );

  return { jobs, totalCount };
}
