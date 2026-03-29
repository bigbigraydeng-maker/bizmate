import { routing } from "@/i18n/routing";

const DASHBOARD_ROOTS = new Set([
  "chat",
  "calculators",
  "calendar",
  "gp",
  "flights",
  "jobs",
  "documents",
  "settings",
  "onboarding",
]);

/** Strip leading locale segment (en or zh) from pathname */
export function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en" || parts[0] === "zh") {
    return "/" + parts.slice(1).join("/");
  }
  return pathname.length ? pathname : "/";
}

export function getLocaleFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en") return "en";
  if (parts[0] === "zh") return "zh";
  return routing.defaultLocale;
}

export function loginPathForLocale(locale: string): string {
  return locale === routing.defaultLocale ? "/login" : `/${locale}/login`;
}

/** True when route is under (dashboard) and should require auth */
export function isProtectedDashboardPath(pathname: string): boolean {
  const p = stripLocalePrefix(pathname);
  const segments = p.split("/").filter(Boolean);
  const first = segments[0];
  if (!first) return false;
  return DASHBOARD_ROOTS.has(first);
}
