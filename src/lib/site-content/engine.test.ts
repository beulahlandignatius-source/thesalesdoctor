import { describe, expect, it } from "vitest";
import { buildMaps, replaceText } from "./engine";

describe("site text overrides", () => {
  const maps = buildMaps([{ kind: "text", original: "Book a  consultation", replacement: "Book a call" }], () => undefined);
  it("replaces matching wording and keeps spaces", () => { expect(replaceText("  Book a consultation ", maps.text)).toBe("  Book a call "); });
  it("leaves other wording alone", () => { expect(replaceText("Mentorship", maps.text)).toBeNull(); });
  it("drops image overrides with no address", () => { expect(buildMaps([{ kind: "image", original: "/a.jpg", replacement: "x" }], () => undefined).image.size).toBe(0); });
});
