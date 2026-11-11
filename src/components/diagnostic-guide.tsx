import welcome from "@/assets/mascot-wave.png";
import thinking from "@/assets/mascot-thinking.png";
import examining from "@/assets/mascot-examining.png";
import findings from "@/assets/mascot-findings.png";
import positive from "@/assets/mascot-positive.png";

type Mood = "welcome" | "thinking" | "examining" | "findings" | "positive";
const images: Record<Mood, string> = { welcome, thinking, examining, findings, positive };
const descriptions: Record<Mood, string> = { welcome: "waving a friendly welcome", thinking: "thoughtfully considering your business", examining: "examining his sales diagnostic device", findings: "pointing towards your findings", positive: "giving an encouraging thumbs-up" };

export function DiagnosticGuide({ mood = "welcome", message, compact = false, scanning = false }: {
  mood?: Mood;
  message: string;
  compact?: boolean;
  scanning?: boolean;
}) {
  return (
    <aside className={`diagnostic-guide ${compact ? "guide-compact" : "guide-featured"} ${scanning ? "guide-scanning" : ""} guide-${mood}`} aria-label="Dr. Dan's diagnostic guidance">
      <div className="guide-portrait">
        <img key={mood} src={images[mood]} width={768} height={768} alt={`Dr. Dan ${descriptions[mood]}`} className="guide-character" />
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