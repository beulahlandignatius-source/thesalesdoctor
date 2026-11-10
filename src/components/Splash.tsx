import { useEffect, useState } from "react";
import logo from "@/assets/logo-white.png";

export function Splash() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");
  useEffect(() => {
    if (sessionStorage.getItem("xray-splash")) {
      setPhase("gone");
      return;
    }
    sessionStorage.setItem("xray-splash", "1");
    const a = setTimeout(() => setPhase("fade"), 1600);
    const b = setTimeout(() => setPhase("gone"), 2200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (phase === "gone") return null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${phase === "fade" ? "opacity-0" : "opacity-100"}`}
    >
      <img src={logo} alt="The Sales Doctor" className="w-64 animate-splash" />
      <div className="mt-6 h-px w-24 bg-secondary animate-pulse" />
      <p className="mt-4 font-display text-sm text-muted-foreground">The Client X-Ray</p>
    </div>
  );
}
