import { describe, expect, it } from "vitest";
import { canShowPageEditor } from "@/lib/site-content/editor-scope";

describe("page editing stays inside the admin dashboard", () => {
  it("never displays editing controls on a standalone visitor page, even for an admin", () => {
    expect(canShowPageEditor(true, false, "/admin/content")).toBe(false);
  });
  it("only enables the embedded editor inside admin content", () => {
    expect(canShowPageEditor(true, true, "/admin/content")).toBe(true);
    expect(canShowPageEditor(true, true, "/")).toBe(false);
    expect(canShowPageEditor(false, true, "/admin/content")).toBe(false);
  });
});