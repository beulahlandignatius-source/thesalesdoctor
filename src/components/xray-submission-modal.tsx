import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Activity, Check, ScanLine, Target, TrendingUp, Users } from "lucide-react";
import doctor from "@/assets/mascot-examining.png";
import positive from "@/assets/mascot-positive.png";

const messages = ["Receiving your business information...", "Examining your business structure...", "Reviewing your sales process...", "Checking potential growth bottlenecks...", "Preparing your examination report..."];

/** Receipt animation only. Mount exclusively after server-confirmed submission. */
export function XraySubmissionModal({ alreadyComplete = false, onComplete }: { alreadyComplete?: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(alreadyComplete ? 100 : 0);
  const complete = progress >= 100;
  useEffect(() => { if (complete) onComplete(); }, [complete, onComplete]);
  useEffect(() => {
    if (alreadyComplete) return;
    const start = performance.now();
    const timer = window.setInterval(() => setProgress(Math.min(100, (performance.now() - start) / 50)), 100);
    return () => window.clearInterval(timer);
  }, [alreadyComplete]);
  return <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Overlay className="xray-machine-backdrop" />
      <Dialog.Content className={`xray-machine-modal ${complete ? "receipt-complete" : ""}`} onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
        <header className="xray-machine-header"><span className="flex items-center gap-2"><ScanLine className="h-5 w-5" /> THE CLIENT X-RAY</span><span className="flex items-center gap-2 text-xs"><Check className="h-4 w-4" /> Responses saved</span></header>
        <div className="xray-machine-body">
          <div className="xray-machine-visual" aria-hidden="true">
            <div className="xray-machine-grid" />
            <div className="xray-machine-cross corner-tl" /><div className="xray-machine-cross corner-tr" /><div className="xray-machine-cross corner-bl" /><div className="xray-machine-cross corner-br" />
            <div className="xray-machine-modules">{[Users, Target, TrendingUp, Activity].map((Icon, index) => <span key={index}><Icon /></span>)}</div>
            <img src={complete ? positive : doctor} alt="" className="xray-machine-doctor" />
            {!complete && <div className="xray-machine-beam" />}
            <span className="xray-machine-visual-label">{complete ? "RECEIVED FOR REVIEW" : "BUSINESS EXAMINATION"}</span>
          </div>
          <div className="xray-machine-copy">
            <p className="text-xs font-semibold text-primary">{complete ? "SUBMISSION CONFIRMED" : "YOUR BUSINESS · IN FOCUS"}</p>
            <Dialog.Title className="xray-machine-title">{complete ? "Your X-Ray is Complete!" : "Your business, ready for a closer look."}</Dialog.Title>
            <Dialog.Description className="xray-machine-description">{complete ? "Your business examination has been successfully submitted. Dr. Dan and the team will review your information and get back to you with the next steps." : "Your responses are saved for Dr. Dan and the team. This visual receipt does not generate a diagnosis or score."}</Dialog.Description>
            {!complete ? <div className="xray-machine-status">
              <p role="status" aria-live="polite" className="xray-machine-message">{messages[Math.min(4, Math.floor(progress / 20))]}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Submission receipt</span><span>{Math.round(progress)}%</span></div>
              <div role="progressbar" aria-label="Submission receipt animation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="xray-machine-progress"><span style={{ width: `${progress}%` }} /></div>
            </div> : null}
          </div>
        </div>
        <footer className="xray-machine-footer"><span>THE SALES CLINIC</span><span>{complete ? "Next: personal review by Dr. Dan’s team" : "Securely received · No answers lost"}</span></footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}