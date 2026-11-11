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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = setTimeout(() => setPhase("fade"), reducedMotion ? 150 : 1600);
    const b = setTimeout(() => setPhase("gone"), reducedMotion ? 150 : 2100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  if (phase === "gone") return null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 motion-reduce:transition-none ${phase === "fade" ? "opacity-0" : "opacity-100"}`}
    >
      <img src={logo} alt="The Sales Doctor" className="w-64 max-w-[70%] animate-splash motion-reduce:animate-none" />
    </div>
  );
}
