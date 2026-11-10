/** Admin dashboard date ranges. Dates are inclusive UTC days written as YYYY-MM-DD. */
export type DateRange = { from: string; to: string };
export const PRESETS = [
  ["7d", "Last 7 days"], ["30d", "Last 30 days"], ["90d", "Last 90 days"], ["month", "This month"], ["year", "Last 12 months"],
] as const;
export type Preset = (typeof PRESETS)[number][0];
const DAY = 864e5;
export const toDay = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
const parse = (s: string) => new Date(`${s}T00:00:00.000Z`);
const isDay = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parse(s).getTime());

export function presetRange(p: Preset, now = new Date()): DateRange {
  const to = toDay(now);
  if (p === "month") return { from: `${to.slice(0, 7)}-01`, to };
  const n = p === "7d" ? 7 : p === "30d" ? 30 : p === "90d" ? 90 : 365;
  return { from: toDay(new Date(parse(to).getTime() - (n - 1) * DAY)), to };
}
export const DEFAULT_PRESET: Preset = "30d";

/** Reads from/to search values, falling back to the default and swapping them if reversed. */
export function readRange(s: { from?: unknown; to?: unknown }, now = new Date()): DateRange {
  if (!isDay(s.from) || !isDay(s.to)) return presetRange(DEFAULT_PRESET, now);
  return s.from <= s.to ? { from: s.from, to: s.to } : { from: s.to, to: s.from };
}
export const rangeDays = (r: DateRange) => Math.round((parse(r.to).getTime() - parse(r.from).getTime()) / DAY) + 1;
/** The same number of days immediately before the range, for comparison. */
export function previousRange(r: DateRange): DateRange {
  const n = rangeDays(r), start = parse(r.from).getTime();
  return { from: toDay(new Date(start - n * DAY)), to: toDay(new Date(start - DAY)) };
}
export const inRange = (iso: string | null | undefined, r: DateRange) => !!iso && toDay(iso) >= r.from && toDay(iso) <= r.to;
/** ISO bounds for database queries: start of from-day to start of the day after to-day. */
export const isoBounds = (r: DateRange) => ({ gte: parse(r.from).toISOString(), lt: new Date(parse(r.to).getTime() + DAY).toISOString() });
/** Percent change vs the previous period; null when there is nothing to compare against. */
export const change = (cur: number, prev: number) => (prev === 0 ? (cur === 0 ? 0 : null) : Math.round(((cur - prev) / prev) * 100));
export const matchesPreset = (r: DateRange, now = new Date()) => PRESETS.find(([p]) => { const x = presetRange(p, now); return x.from === r.from && x.to === r.to; })?.[0];

/** Chart buckets: daily up to 62 days, weekly beyond. Each bucket is itself a range you can drill into. */
export function buckets(r: DateRange): (DateRange & { label: string })[] {
  const n = rangeDays(r), step = n > 62 ? 7 : 1, out: (DateRange & { label: string })[] = [];
  for (let i = 0; i < n; i += step) {
    const s = new Date(parse(r.from).getTime() + i * DAY), e = new Date(Math.min(parse(r.to).getTime(), s.getTime() + (step - 1) * DAY));
    out.push({ from: toDay(s), to: toDay(e), label: s.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) });
  }
  return out;
}
export const countIn = (dates: (string | null | undefined)[], bs: DateRange[]) => bs.map((b) => dates.filter((d) => inRange(d, b)).length);
export const fmtRange = (r: DateRange) => { const f = (s: string) => parse(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); return r.from === r.to ? f(r.from) : `${f(r.from)} to ${f(r.to)}`; };
