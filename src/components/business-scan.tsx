import { Activity, Check, ScanLine, Target, TrendingUp, Users, type LucideIcon } from "lucide-react";
import examining from "@/assets/mascot-examining.png";
import positive from "@/assets/mascot-positive.png";
const modules: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Clients" }, { icon: Target, label: "Offers" },
  { icon: TrendingUp, label: "Sales" }, { icon: Activity, label: "Follow-up" },
];

/** Visual processing only: completion comes from the real saved diagnosis, never a timer. */
export function BusinessScan({ complete = false }: { complete?: boolean }) {
  return <div className={`business-scan ${complete ? "scan-complete" : ""}`} role="status">
    <div className="scan-doctor"><img src={complete ? positive : examining} alt={complete ? "Dr. Dan giving a thumbs-up" : "Dr. Dan examining his scanner"} /><span>{complete ? "Your X-Ray is ready." : "Let's scan."}</span></div>
    <div className="scan-business" aria-hidden="true">
      <div className="scan-corners" />
      <div className="scan-modules">{modules.map(({ icon: Symbol, label }) => {
        return <div key={label} className="scan-module"><Symbol /><span>{label}</span>{complete && <Check className="scan-check" />}</div>;
      })}</div>
      {!complete && <div className="business-scan-beam" />}
    </div>
    <p>{complete ? "Let's look at what comes next." : "Examining your business answers…"}</p>
    <div className="scan-route" aria-hidden="true"><img src={complete ? positive : examining} alt="" /><ScanLine /></div>
  </div>;
}