"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, ExternalLink, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type GpRow = Tables<"gp_practices">;

const CITIES = [
  "Auckland",
  "Wellington",
  "Christchurch",
  "Hamilton",
  "Tauranga",
] as const;

export function GpFinder() {
  const t = useTranslations("gp");
  function cityLabel(c: (typeof CITIES)[number]) {
    switch (c) {
      case "Auckland":
        return t("city_auckland");
      case "Wellington":
        return t("city_wellington");
      case "Christchurch":
        return t("city_christchurch");
      case "Hamilton":
        return t("city_hamilton");
      case "Tauranga":
        return t("city_tauranga");
      default:
        return c;
    }
  }
  const [city, setCity] = useState<string>("Auckland");
  const [language, setLanguage] = useState<string>("mandarin");
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [rows, setRows] = useState<GpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const search = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("gp_practices").select("*").eq("city", city);
    if (acceptingOnly) {
      q = q.eq("accepting_new_patients", true);
    }
    if (language && language !== "any") {
      q = q.contains("languages_spoken", [language]);
    }
    const { data, error } = await q.order("name");
    setLoading(false);
    if (error) {
      console.error(error);
      setRows([]);
      setSearchError(true);
      return;
    }
    setSearchError(false);
    setRows((data ?? []) as GpRow[]);
  }, [supabase, city, language, acceptingOnly]);

  useEffect(() => {
    void search();
  }, [search]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t("search")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
          <div className="space-y-2 md:min-w-[200px]">
            <Label>{t("city")}</Label>
            <Select
              value={city}
              onValueChange={(v) => {
                if (v) setCity(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {cityLabel(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:min-w-[200px]">
            <Label>{t("language")}</Label>
            <Select
              value={language}
              onValueChange={(v) => {
                if (v) setLanguage(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("lang_any")}</SelectItem>
                <SelectItem value="mandarin">{t("lang_mandarin")}</SelectItem>
                <SelectItem value="cantonese">{t("lang_cantonese")}</SelectItem>
                <SelectItem value="english">{t("lang_english")}</SelectItem>
                <SelectItem value="korean">{t("lang_korean")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Switch
              id="accepting"
              checked={acceptingOnly}
              onCheckedChange={setAcceptingOnly}
            />
            <Label htmlFor="accepting" className="cursor-pointer">
              {t("acceptingOnly")}
            </Label>
          </div>
          <Button type="button" onClick={() => void search()}>
            {t("search")}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground text-sm">{t("loading")}</p>
      ) : searchError ? (
        <p className="text-destructive text-sm">{t("searchError")}</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("noResults")}</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => {
            const open = expanded === r.id;
            return (
              <li key={r.id}>
                <Card className="h-full overflow-hidden">
                  <CardHeader className="space-y-2 pb-2">
                    <CardTitle className="text-lg leading-snug">{r.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{r.address}</p>
                    {r.suburb ? (
                      <p className="text-muted-foreground text-xs">
                        {r.suburb} · {r.city}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-wrap gap-1.5">
                      {(r.languages_spoken ?? []).map((lang) => (
                        <span
                          key={lang}
                          className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {r.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3.5 shrink-0" />
                          {r.phone}
                        </span>
                      ) : null}
                      <span>
                        {r.accepting_new_patients === true
                          ? t("accepting")
                          : r.accepting_new_patients === false
                            ? t("notAccepting")
                            : t("unknownAccepting")}
                      </span>
                    </div>
                    <div className="text-muted-foreground grid gap-1 text-xs md:grid-cols-3">
                      <span>
                        {t("feeAdult")}:{" "}
                        {r.fee_adult != null ? `$${r.fee_adult.toFixed(2)}` : "—"}
                      </span>
                      <span>
                        {t("feeChild")}:{" "}
                        {r.fee_child != null ? `$${r.fee_child.toFixed(2)}` : "—"}
                      </span>
                      <span>
                        {t("feeCsc")}: {r.fee_csc != null ? `$${r.fee_csc.toFixed(2)}` : "—"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setExpanded(open ? null : r.id)}
                    >
                      {open ? t("collapse") : t("expand")}
                      {open ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                    {open ? (
                      <div className="border-border space-y-2 border-t pt-3">
                        {r.website ? (
                          <a
                            href={r.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                          >
                            {t("website")}
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : (
                          <p className="text-muted-foreground text-xs">{t("website")}: —</p>
                        )}
                        {r.healthpoint_url ? (
                          <a
                            href={r.healthpoint_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
                          >
                            {t("healthpoint")}
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
