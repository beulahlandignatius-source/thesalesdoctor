import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider, ThemeToggle } from "@/components/theme";

afterEach(() => { cleanup(); localStorage.clear(); document.documentElement.classList.remove("dark"); });

describe("Shared theme preference", () => {
  it("starts in light mode and switches both directions", async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
    expect(localStorage.getItem("sales-clinic-theme")).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(false));
    expect(localStorage.getItem("sales-clinic-theme")).toBe("light");
  });
  it("restores the saved dark theme", async () => {
    localStorage.setItem("sales-clinic-theme", "dark");
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
  });
});