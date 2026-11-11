import { afterEach, expect, it } from "vitest";
import { emptyState, loadState, saveState } from "@/lib/audit";
import { restartXray } from "@/lib/xray-restart";

afterEach(() => localStorage.clear());
it("starts again with no old session, answers, contact or diagnosis cache", () => {
  saveState({ step: 29, session: { id: "previous-session", token: "previous-token" }, info: { name: "Test", email: "test@example.com", whatsapp: "12345678" }, answers: { q1: "Consulting" } });
  localStorage.setItem("client-xray-diagnosis", JSON.stringify({ diagnosis_title: "Previous report" }));
  localStorage.setItem("sales-clinic-theme", "dark");
  restartXray();
  expect(loadState()).toEqual(emptyState());
  expect(localStorage.getItem("client-xray-diagnosis")).toBeNull();
  expect(localStorage.getItem("sales-clinic-theme")).toBe("dark");
});