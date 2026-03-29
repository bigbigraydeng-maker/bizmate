/**
 * TradeMe Jobs Search Integration
 * Uses TradeMe's official API with OAuth 1.0a authentication.
 * Requires TRADEME_CONSUMER_KEY and TRADEME_CONSUMER_SECRET env vars.
 *
 * Register at: https://developer.trademe.co.nz
 * Sandbox: https://www.tmsandbox.co.nz
 */

import crypto from "crypto";

const TRADEME_API = "https://api.trademe.co.nz/v1/Search/Jobs.json";

export type TradeMeJob = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  listingDate: string;
  trademeUrl: string;
};

type TradeMeApiJob = {
  ListingId?: number;
  Title?: string;
  ShortDescription?: string;
  Company?: string;
  JobLocation?: string;
  District?: string;
  Region?: string;
  PayBenefits?: string;
  Salary?: string;
  JobType?: string;
  StartDate?: string;
};

type TradeMeApiResponse = {
  TotalCount?: number;
  List?: TradeMeApiJob[];
};

/** Check if TradeMe credentials are configured */
export function isTradeMeConfigured(): boolean {
  return Boolean(process.env.TRADEME_CONSUMER_KEY && process.env.TRADEME_CONSUMER_SECRET);
}

/** Generate OAuth 1.0a Authorization header (2-legged, no user token) */
function generateOAuthHeader(url: string): string {
  const consumerKey = process.env.TRADEME_CONSUMER_KEY!;
  const consumerSecret = process.env.TRADEME_CONSUMER_SECRET!;

  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const params: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
  };

  // Parse URL params
  const urlObj = new URL(url);
  for (const [k, v] of urlObj.searchParams) {
    params[k] = v;
  }

  // Create signature base string
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;
  const signatureBase = `GET&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParams)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&`;

  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  return `OAuth oauth_consumer_key="${encodeURIComponent(consumerKey)}", oauth_nonce="${nonce}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_version="1.0"`;
}

function mapTradeMeJob(raw: TradeMeApiJob): TradeMeJob {
  const location = [raw.District, raw.Region].filter(Boolean).join(", ") || raw.JobLocation || "New Zealand";

  return {
    id: `tm-${raw.ListingId}`,
    title: raw.Title ?? "",
    description: raw.ShortDescription ?? "",
    company: raw.Company ?? "",
    location,
    salary: raw.PayBenefits ?? raw.Salary ?? "",
    jobType: raw.JobType ?? "",
    listingDate: raw.StartDate ?? "",
    trademeUrl: `https://www.trademe.co.nz/a/jobs/listing/${raw.ListingId}`,
  };
}

/**
 * Search TradeMe Jobs for Chinese/Mandarin-related positions.
 * Returns empty array if credentials are not configured.
 */
export async function searchTradeMeJobs(
  keywords: string[] = ["Chinese", "Mandarin"],
  rows = 20,
): Promise<{ jobs: TradeMeJob[]; totalCount: number }> {
  if (!isTradeMeConfigured()) {
    return { jobs: [], totalCount: 0 };
  }

  const allJobs = new Map<string, TradeMeJob>();
  let totalCount = 0;

  for (const keyword of keywords) {
    try {
      const params = new URLSearchParams({
        search_string: keyword,
        rows: String(rows),
        sort_order: "ExpiryDesc",
      });

      const url = `${TRADEME_API}?${params}`;
      const authHeader = generateOAuthHeader(url);

      const res = await fetch(url, {
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`[TradeMe] Search failed for "${keyword}": ${res.status}`);
        continue;
      }

      const data: TradeMeApiResponse = await res.json();
      totalCount = Math.max(totalCount, data.TotalCount ?? 0);

      for (const raw of data.List ?? []) {
        const job = mapTradeMeJob(raw);
        if (!allJobs.has(job.id)) {
          allJobs.set(job.id, job);
        }
      }
    } catch (err) {
      console.warn(`[TradeMe] Failed to search for "${keyword}":`, err);
    }
  }

  const jobs = Array.from(allJobs.values());
  return { jobs, totalCount };
}
