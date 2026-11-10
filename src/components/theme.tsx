import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setDark(localStorage.getItem("sales-clinic-theme") === "dark"); } catch { /* Storage may be unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("sales-clinic-theme", dark ? "dark" : "light"); } catch { /* Theme still works without persistence. */ }
  }, [dark, ready]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export const useThemeState = () => useContext(ThemeContext);

export function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeContext);
  const label = dark ? "Switch to light theme" : "Switch to dark theme";
  return <Button variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={toggle} aria-label={label} title={label}>
    {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>;
}