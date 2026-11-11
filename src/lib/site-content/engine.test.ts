import { describe, expect, it } from "vitest";
import { applyAll, buildMaps, replaceText, REMOVED_IMAGE } from "./engine";

describe("site text overrides", () => {
  const maps = buildMaps([{ kind: "text", original: "Book a  consultation", replacement: "Book a call" }], () => undefined);
  it("replaces matching wording and keeps spaces", () => { expect(replaceText("  Book a consultation ", maps.text)).toBe("  Book a call "); });
  it("leaves other wording alone", () => { expect(replaceText("Mentorship", maps.text)).toBeNull(); });
  it("drops image overrides with no address", () => { expect(buildMaps([{ kind: "image", original: "/a.jpg", replacement: "x" }], () => undefined).image.size).toBe(0); });
  it("allows an admin's deleted wording to stay empty rather than restoring it", () => {
    const deleted = buildMaps([{ kind: "text", original: "Remove me", replacement: "" }], () => undefined);
    expect(replaceText("Remove me", deleted.text)).toBe("");
  });
  it("removes only the selected photo without hiding other photos", () => {
    const root = document.createElement("div");
    root.innerHTML = '<img src="/remove.jpg"><img src="/keep.jpg">';
    applyAll(root, buildMaps([{ kind: "image", original: "/remove.jpg", replacement: REMOVED_IMAGE }], () => undefined));
    expect(root.querySelector<HTMLImageElement>('img[src="/remove.jpg"]')?.hidden).toBe(true);
    expect(root.querySelector<HTMLImageElement>('img[src="/keep.jpg"]')?.hidden).toBe(false);
  });
});
