"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const JOB_TYPES = ["full_time", "part_time", "casual", "contract", "internship"] as const;
const SALARY_TYPES = ["annual", "hourly"] as const;
const LOCATIONS = ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Queenstown", "其他"] as const;
const LANGUAGES = ["中文", "English", "粤语", "韩语"] as const;

export function PostJobForm() {
  const t = useTranslations("jobs");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title_zh: "",
    title: "",
    description_zh: "",
    description: "",
    job_type: "full_time" as string,
    location: "Auckland" as string,
    salary_min: "",
    salary_max: "",
    salary_type: "annual" as string,
    languages_required: ["中文"] as string[],
    visa_sponsorship: false,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLang = (lang: string) => {
    setForm((prev) => {
      const langs = prev.languages_required.includes(lang)
        ? prev.languages_required.filter((l) => l !== lang)
        : [...prev.languages_required, lang];
      return { ...prev, languages_required: langs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError(t("loginRequired"));
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from("job_listings").insert({
        poster_id: user.id,
        title: form.title || form.title_zh,
        title_zh: form.title_zh || null,
        description: form.description || form.description_zh,
        description_zh: form.description_zh || null,
        job_type: form.job_type,
        location: form.location,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        salary_type: form.salary_type,
        languages_required: form.languages_required.length > 0 ? form.languages_required : null,
        visa_sponsorship: form.visa_sponsorship,
      });

      if (insertError) throw insertError;
      router.push("/jobs");
    } catch {
      setError(t("postError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{t("postJobTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title_zh">{t("fieldTitleZh")} *</Label>
            <Input
              id="title_zh"
              value={form.title_zh}
              onChange={(e) => update("title_zh", e.target.value)}
              placeholder="例：中文会计（全职）"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">{t("fieldTitleEn")}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Chinese Speaking Accountant"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc_zh">{t("fieldDescZh")} *</Label>
            <Textarea
              id="desc_zh"
              value={form.description_zh}
              onChange={(e) => update("description_zh", e.target.value)}
              placeholder="详细描述岗位职责、要求、福利等"
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc_en">{t("fieldDescEn")}</Label>
            <Textarea
              id="desc_en"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional English description"
              rows={3}
            />
          </div>

          {/* Type + Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("fieldJobType")} *</Label>
              <Select value={form.job_type} onValueChange={(v) => v && update("job_type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`type_${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("fieldLocation")} *</Label>
              <Select value={form.location} onValueChange={(v) => v && update("location", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t("fieldSalaryType")}</Label>
              <Select value={form.salary_type} onValueChange={(v) => v && update("salary_type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_TYPES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {t(`salaryType_${st}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sal-min">{t("fieldSalaryMin")}</Label>
              <Input
                id="sal-min"
                inputMode="decimal"
                value={form.salary_min}
                onChange={(e) => update("salary_min", e.target.value)}
                placeholder="最低"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sal-max">{t("fieldSalaryMax")}</Label>
              <Input
                id="sal-max"
                inputMode="decimal"
                value={form.salary_max}
                onChange={(e) => update("salary_max", e.target.value)}
                placeholder="最高"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label>{t("fieldLanguages")}</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  size="sm"
                  variant={form.languages_required.includes(lang) ? "default" : "outline"}
                  onClick={() => toggleLang(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          {/* Visa */}
          <div className="flex items-center gap-3">
            <Label>{t("fieldVisa")}</Label>
            <Button
              type="button"
              size="sm"
              variant={form.visa_sponsorship ? "default" : "outline"}
              onClick={() => update("visa_sponsorship", !form.visa_sponsorship)}
            >
              {form.visa_sponsorship ? t("yes") : t("no")}
            </Button>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("submitting") : t("submitPost")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
