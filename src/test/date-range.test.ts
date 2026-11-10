import { describe, expect, it } from "vitest";
import { presetRange, previousRange, readRange, buckets, change, inRange } from "@/lib/date-range";

const now = new Date("2026-11-10T20:00:00Z");
describe("Admin dashboard date ranges", () => {
  it("last 7 days includes today", () => expect(presetRange("7d", now)).toEqual({ from: "2026-11-04", to: "2026-11-10" }));
  it("this month starts on the 1st", () => expect(presetRange("month", now)).toEqual({ from: "2026-11-01", to: "2026-11-10" }));
  it("compares against the same number of days just before", () => expect(previousRange({ from: "2026-11-04", to: "2026-11-10" })).toEqual({ from: "2026-10-28", to: "2026-11-03" }));
  it("falls back to the last 30 days for bad dates", () => expect(readRange({ from: "nope" }, now)).toEqual({ from: "2026-10-12", to: "2026-11-10" }));
  it("swaps a reversed range", () => expect(readRange({ from: "2026-11-10", to: "2026-11-01" })).toEqual({ from: "2026-11-01", to: "2026-11-10" }));
  it("charts by day up to 62 days and by week beyond", () => {
    expect(buckets({ from: "2026-11-01", to: "2026-11-10" })).toHaveLength(10);
    expect(buckets(presetRange("90d", now))).toHaveLength(13);
  });
  it("includes records on the last day of the range", () => expect(inRange("2026-11-10T23:59:00Z", { from: "2026-11-01", to: "2026-11-10" })).toBe(true));
  it("shows no percent change when the previous period was zero", () => { expect(change(5, 0)).toBeNull(); expect(change(0, 0)).toBe(0); expect(change(15, 10)).toBe(50); });
});
