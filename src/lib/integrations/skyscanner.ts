/**
 * Skyscanner flight price integration.
 * Phase 1: mock data with realistic NZD prices.
 * Phase 2: integrate Skyscanner API or scraping.
 */

export interface FlightPrice {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  airline: string;
  price: number; // NZD
  currency: string;
  isDirect: boolean;
}

export const POPULAR_DESTINATIONS = [
  { code: "PVG", city_zh: "上海", city_en: "Shanghai" },
  { code: "PEK", city_zh: "北京", city_en: "Beijing" },
  { code: "CAN", city_zh: "广州", city_en: "Guangzhou" },
  { code: "CTU", city_zh: "成都", city_en: "Chengdu" },
  { code: "WUH", city_zh: "武汉", city_en: "Wuhan" },
  { code: "XMN", city_zh: "厦门", city_en: "Xiamen" },
] as const;

const AIRLINES = [
  { name: "Air New Zealand", direct: true },
  { name: "China Southern", direct: true },
  { name: "Cathay Pacific", direct: false },
  { name: "Singapore Airlines", direct: false },
];

/** Seeded pseudo-random for reproducible mock data */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate mock flight prices for a route over a date range.
 * Prices follow seasonal patterns: cheaper mid-week, expensive holidays.
 */
export function searchFlights(
  origin: string,
  destination: string,
  dateFrom: string,
  dateTo: string,
): FlightPrice[] {
  const results: FlightPrice[] = [];
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  // Route-specific base price offset
  const destIndex = POPULAR_DESTINATIONS.findIndex((d) => d.code === destination);
  const routeOffset = destIndex >= 0 ? destIndex * 50 : 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const dayOfWeek = d.getDay();
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
    );

    // Pick 1-3 airlines for this day
    const airlineCount = 1 + Math.floor(seededRandom(dayOfYear * 7 + destIndex) * 3);

    for (let i = 0; i < airlineCount && i < AIRLINES.length; i++) {
      const airline = AIRLINES[(destIndex + i) % AIRLINES.length];
      const seed = dayOfYear * 100 + destIndex * 10 + i;

      // Base price: direct 1200-1800, connecting 600-1200
      const baseMin = airline.direct ? 1200 : 600;
      const baseMax = airline.direct ? 1800 : 1200;
      let price = baseMin + seededRandom(seed) * (baseMax - baseMin);

      // Weekend surcharge
      if (dayOfWeek === 0 || dayOfWeek === 6) price *= 1.15;

      // Holiday season surcharge (Dec-Jan, Jun-Jul)
      const month = d.getMonth();
      if (month === 11 || month === 0 || month === 5 || month === 6) price *= 1.25;

      // Route offset
      price += routeOffset;

      results.push({
        origin,
        destination,
        departureDate: dateStr,
        airline: airline.name,
        price: Math.round(price),
        currency: "NZD",
        isDirect: airline.direct,
      });
    }
  }

  return results;
}

/** Get the cheapest price per day for charting */
export function getCheapestByDate(prices: FlightPrice[]): { date: string; price: number; airline: string }[] {
  const byDate = new Map<string, FlightPrice>();
  for (const p of prices) {
    const existing = byDate.get(p.departureDate);
    if (!existing || p.price < existing.price) {
      byDate.set(p.departureDate, p);
    }
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, p]) => ({ date, price: p.price, airline: p.airline }));
}
