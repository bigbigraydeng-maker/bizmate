"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

type Deadline = Tables<"compliance_deadlines">;

function worstCellStatus(deadlines: Deadline[]): "overdue" | "dueSoon" | "completed" | "future" | null {
  const today = startOfDay(new Date());
  const active = deadlines.filter((d) => d.status !== "completed" && d.status !== "dismissed");
  if (active.length === 0) return deadlines.length ? "completed" : null;
  for (const d of active) {
    const due = startOfDay(parseISO(d.due_date));
    if (isBefore(due, today)) return "overdue";
  }
  for (const d of active) {
    const due = startOfDay(parseISO(d.due_date));
    if (!isBefore(due, today) && differenceInCalendarDays(due, today) <= 7) return "dueSoon";
  }
  return "future";
}

export function ComplianceCalendar() {
  const t = useTranslations("calendar");
  const formatter = useFormatter();
  const [month, setMonth] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data: companies, error: ce } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id);
    if (ce || !companies?.length) {
      setDeadlines([]);
      setLoading(false);
      return;
    }
    const ids = companies.map((c) => c.id);
    const { data: rows, error } = await supabase
      .from("compliance_deadlines")
      .select("*")
      .in("company_id", ids)
      .order("due_date");
    if (error) {
      toast.error(t("loadError"));
      setDeadlines([]);
    } else {
      setDeadlines((rows ?? []) as Deadline[]);
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const byDate = useMemo(() => {
    const m = new Map<string, Deadline[]>();
    for (const d of deadlines) {
      const key = d.due_date;
      const list = m.get(key) ?? [];
      list.push(d);
      m.set(key, list);
    }
    return m;
  }, [deadlines]);

  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;
    for (const d of deadlines) {
      if (d.status === "completed" || d.status === "dismissed") {
        completed++;
        continue;
      }
      const due = startOfDay(parseISO(d.due_date));
      if (isBefore(due, today)) overdue++;
      else upcoming++;
    }
    return { upcoming, overdue, completed };
  }, [deadlines]);

  const { overdueDates, dueSoonDates, completedDates, futureDates } = useMemo(() => {
    const overdue: Date[] = [];
    const dueSoon: Date[] = [];
    const completed: Date[] = [];
    const future: Date[] = [];
    for (const [key, list] of byDate) {
      const st = worstCellStatus(list);
      const dt = parseISO(key);
      if (st === "overdue") overdue.push(dt);
      else if (st === "dueSoon") dueSoon.push(dt);
      else if (st === "completed") completed.push(dt);
      else if (st === "future") future.push(dt);
    }
    return {
      overdueDates: overdue,
      dueSoonDates: dueSoon,
      completedDates: completed,
      futureDates: future,
    };
  }, [byDate]);

  const selectedList = selected
    ? byDate.get(format(selected, "yyyy-MM-dd")) ?? []
    : [];

  async function markCompleted(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("compliance_deadlines")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast.error(t("updateError"));
      return;
    }
    toast.success(t("markedDone"));
    await load();
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">{t("loading")}</p>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
          <span>
            <span className="text-muted-foreground">{t("statUpcoming")}</span>{" "}
            <strong>{stats.upcoming}</strong>
          </span>
          <span>
            <span className="text-muted-foreground">{t("statOverdue")}</span>{" "}
            <strong className="text-destructive">{stats.overdue}</strong>
          </span>
          <span>
            <span className="text-muted-foreground">{t("statCompleted")}</span>{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">{stats.completed}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-500" /> {t("legendOverdue")}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-400" /> {t("legendDueSoon")}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" /> {t("legendCompleted")}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-muted-foreground/40" /> {t("legendFuture")}
          </span>
        </div>

        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={(d) => {
            setSelected(d);
            setPanelOpen(!!d);
          }}
          modifiers={{
            overdue: overdueDates,
            dueSoon: dueSoonDates,
            completed: completedDates,
            future: futureDates,
          }}
          modifiersClassNames={{
            overdue:
              "!bg-red-500/25 text-foreground hover:!bg-red-500/35 data-[selected=true]:!bg-red-500/35",
            dueSoon:
              "!bg-amber-400/25 text-foreground hover:!bg-amber-400/35 data-[selected=true]:!bg-amber-400/35",
            completed:
              "!bg-emerald-500/20 text-foreground hover:!bg-emerald-500/30 data-[selected=true]:!bg-emerald-500/30",
            future:
              "!bg-muted text-muted-foreground hover:!bg-muted/80 data-[selected=true]:!bg-muted",
          }}
          className="rounded-lg border border-border"
        />
      </div>

      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selected
                ? formatter.dateTime(selected, { dateStyle: "long" })
                : t("panelTitle")}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {selectedList.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("noDeadlines")}</p>
            ) : (
              selectedList.map((d) => (
                <div
                  key={d.id}
                  className="space-y-2 rounded-lg border border-border p-3 text-sm"
                >
                  <div className="font-medium">{d.title}</div>
                  {d.description ? (
                    <p className="text-muted-foreground">{d.description}</p>
                  ) : null}
                  <div className="text-muted-foreground text-xs">
                    {t("type")}: {d.type} · {t("due")}: {d.due_date}
                  </div>
                  {d.status !== "completed" && d.status !== "dismissed" ? (
                    <Button size="sm" type="button" onClick={() => void markCompleted(d.id)}>
                      {t("markComplete")}
                    </Button>
                  ) : (
                    <p className="text-emerald-600 text-xs dark:text-emerald-400">{t("alreadyDone")}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
