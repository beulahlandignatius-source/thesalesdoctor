import { useEffect, useState } from "react";
import logo from "@/assets/logo-transparent.png";

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
      <div className="clinic-splash-scene">
        <div className="splash-dashboard" aria-hidden="true"><span /><div className="splash-metrics"><i /><i /><i /></div><div className="splash-chart">{[35, 55, 42, 70, 58, 86, 95].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
        <svg className="splash-lifeline" viewBox="0 0 600 140" fill="none" aria-hidden="true"><path d="M0 70H40L50 50L60 90L75 10L90 125L105 55L120 70H150L165 35L178 100L195 15L210 120L225 50L240 70H280L295 40L308 105L325 5L340 130L355 55L370 70H410L425 30L438 100L455 10L470 125L485 50L500 70H530L545 35L555 100L570 20L585 90L595 70H600" stroke="currentColor" strokeWidth="3" /></svg>
        <img src={logo} alt="The Sales Doctor" className="splash-clinic-logo animate-splash" />
      </div>
      <p className="mt-6 font-display text-sm text-muted-foreground">The Sales Clinic</p>
    </div>
  );
}
