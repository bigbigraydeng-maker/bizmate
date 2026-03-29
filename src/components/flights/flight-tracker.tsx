"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plane, Trash2, Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import {
  POPULAR_DESTINATIONS,
  searchFlights,
  getCheapestByDate,
} from "@/lib/integrations/skyscanner";

type DateRange = "30" | "60" | "90";

interface Alert {
  id: string;
  destination: string;
  target_price: number;
  is_active: boolean;
}

export function FlightTracker() {
  const t = useTranslations("flights");
  const supabase = useMemo(() => createClient(), []);

  const [destination, setDestination] = useState("PVG");
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [targetPrice, setTargetPrice] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [savingAlert, setSavingAlert] = useState(false);

  // Compute chart data from mock prices
  const chartData = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + parseInt(dateRange));
    const prices = searchFlights(
      "AKL",
      destination,
      now.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10),
    );
    return getCheapestByDate(prices);
  }, [destination, dateRange]);

  // Find the minimum price point
  const minPoint = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((min, p) => (p.price < min.price ? p : min), chartData[0]);
  }, [chartData]);

  // Cheapest prices across all destinations
  const cheapestPerDest = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    return POPULAR_DESTINATIONS.map((d) => {
      const prices = searchFlights("AKL", d.code, now.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
      const cheapest = getCheapestByDate(prices);
      const min = cheapest.reduce((m, p) => (p.price < m.price ? p : m), cheapest[0]);
      return { ...d, minPrice: min?.price ?? 0, date: min?.date ?? "", airline: min?.airline ?? "" };
    });
  }, []);

  // Load user alerts
  const loadAlerts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("flight_alerts")
      .select("id, destination, target_price, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setAlerts(data as Alert[]);
  }, [supabase]);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const addAlert = async () => {
    const price = parseFloat(targetPrice);
    if (!price || price <= 0) return;
    setSavingAlert(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSavingAlert(false);
      return;
    }
    await supabase.from("flight_alerts").insert({
      user_id: user.id,
      origin: "AKL",
      destination,
      target_price: price,
      is_active: true,
    });
    setTargetPrice("");
    await loadAlerts();
    setSavingAlert(false);
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("flight_alerts").update({ is_active: false }).eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-4 pt-6">
          <div className="min-w-[160px] flex-1">
            <Label>{t("origin")}</Label>
            <Input value="AKL — Auckland" disabled className="mt-1" />
          </div>
          <div className="min-w-[160px] flex-1">
            <Label>{t("destination")}</Label>
            <Select value={destination} onValueChange={(v) => v && setDestination(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_DESTINATIONS.map((d) => (
                  <SelectItem key={d.code} value={d.code}>
                    {d.code} — {t(`dest_${d.code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <Label>{t("dateRange")}</Label>
            <Select value={dateRange} onValueChange={(v) => v && setDateRange(v as DateRange)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">{t("days30")}</SelectItem>
                <SelectItem value="60">{t("days60")}</SelectItem>
                <SelectItem value="90">{t("days90")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            AKL → {destination} {t("priceChart")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)} // MM-DD
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `$${v}`}
                  domain={["dataMin - 50", "dataMax + 50"]}
                />
                <Tooltip
                  formatter={(value) => [`$${value} NZD`, t("price")]}
                  labelFormatter={(label) => String(label)}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4361ee"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                {minPoint && (
                  <ReferenceDot
                    x={minPoint.date}
                    y={minPoint.price}
                    r={6}
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {minPoint && (
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {t("cheapest")}: <span className="text-primary font-semibold">${minPoint.price} NZD</span>{" "}
              — {minPoint.date} ({minPoint.airline})
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cheapest per destination */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cheapestPerDest.map((d) => (
          <Card key={d.code} className={destination === d.code ? "border-primary" : ""}>
            <CardContent className="flex items-center justify-between pt-4 pb-4">
              <div>
                <p className="font-medium">
                  AKL → {d.code}
                </p>
                <p className="text-muted-foreground text-xs">{t(`dest_${d.code}`)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">${d.minPrice}</p>
                <p className="text-muted-foreground text-xs">{d.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("priceAlert")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label>{t("targetPrice")} (NZD)</Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 800"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={addAlert} disabled={savingAlert || !targetPrice}>
              {t("setAlert")}
            </Button>
          </div>

          {alerts.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("activeAlerts")}</p>
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="bg-muted flex items-center justify-between rounded-md px-3 py-2"
                >
                  <span className="text-sm">
                    AKL → {a.destination} — {t("below")} ${a.target_price}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAlert(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
