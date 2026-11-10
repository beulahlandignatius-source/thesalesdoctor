import welcome from "@/assets/dr-dan-guide.png.asset.json";
import examining from "@/assets/mascot-examining.png";
import findings from "@/assets/mascot-findings.png";
import positive from "@/assets/mascot-positive.png";

type Mood = "welcome" | "examining" | "findings" | "positive";
const images: Record<Mood, string> = { welcome: welcome.url, examining, findings, positive };

export function DiagnosticGuide({ mood = "welcome", message, compact = false, scanning = false }: {
  mood?: Mood;
  message: string;
  compact?: boolean;
  scanning?: boolean;
}) {
  return (
    <aside className={`diagnostic-guide ${compact ? "guide-compact" : "guide-featured"} ${scanning ? "guide-scanning" : ""} guide-${mood}`} aria-label="Dr. Dan's diagnostic guidance">
      <div className="guide-portrait">
        <img key={mood} src={images[mood]} width={768} height={768} alt={`Dr. Dan ${mood === "positive" ? "giving a thumbs-up" : mood === "findings" ? "pointing towards your findings" : "with his sales diagnostic device"}`} className="guide-character" />
        {scanning && <span className="guide-device-indicator" aria-hidden="true" />}
      </div>
      <div className="guide-speech">
        <span className="guide-name"><span aria-hidden="true" className="xray-pulse-dot" /> Dr. Dan</span>
        <p key={message} className="guide-message">{message}</p>
      </div>
      {scanning && <span className="guide-scan-track" aria-hidden="true"><span /></span>}
    </aside>
  );
}

export function DiagnosticSweep({ repeat = false }: { repeat?: boolean }) {
  return <div aria-hidden="true" className={`diagnostic-sweep ${repeat ? "sweep-repeat" : ""}`}><span /></div>;
}