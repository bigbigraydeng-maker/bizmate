"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JOB_TYPES = ["all", "full_time", "part_time", "casual", "contract", "internship"] as const;
const LOCATIONS = ["all", "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Queenstown"] as const;

export type JobFilters = {
  search: string;
  jobType: string;
  location: string;
};

export function JobFilterBar({
  filters,
  onChange,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}) {
  const t = useTranslations("jobs");

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder={t("searchPlaceholder")}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="w-full sm:w-64"
      />
      <Select
        value={filters.jobType}
        onValueChange={(v) => v && onChange({ ...filters, jobType: v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={t("allTypes")} />
        </SelectTrigger>
        <SelectContent>
          {JOB_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type === "all" ? t("allTypes") : t(`type_${type}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.location}
        onValueChange={(v) => v && onChange({ ...filters, location: v })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={t("allLocations")} />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc === "all" ? t("allLocations") : loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(filters.search || filters.jobType !== "all" || filters.location !== "all") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ search: "", jobType: "all", location: "all" })}
        >
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
