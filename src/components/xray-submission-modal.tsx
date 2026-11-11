import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Activity, ArrowRight, Check, ScanLine, Target, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import doctor from "@/assets/mascot-examining.png";
import positive from "@/assets/mascot-positive.png";

const messages = ["Receiving your business information...", "Examining your business structure...", "Reviewing your sales process...", "Checking potential growth bottlenecks...", "Preparing your examination report..."];

/** Receipt animation only. Mount exclusively after server-confirmed submission. */
export function XraySubmissionModal({ alreadyComplete = false, onComplete }: { alreadyComplete?: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(alreadyComplete ? 100 : 0);
  const complete = progress >= 100;
  const [leaving, setLeaving] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const reportButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (complete) reportButton.current?.focus(); }, [complete]);
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onComplete, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250);
    return () => window.clearTimeout(timer);
  }, [leaving, onComplete]);
  useEffect(() => {
    if (alreadyComplete) return;
    const start = performance.now();
    const timer = window.setInterval(() => setProgress(Math.min(100, (performance.now() - start) / 50)), 100);
    return () => window.clearInterval(timer);
  }, [alreadyComplete]);
  return <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Overlay className={`xray-machine-backdrop ${leaving ? "receipt-leaving" : ""}`} />
      <Dialog.Content className={`xray-machine-modal ${complete ? "receipt-complete" : ""} ${leaving ? "receipt-leaving" : ""}`} onOpenAutoFocus={e => { e.preventDefault(); if (complete) reportButton.current?.focus(); else title.current?.focus(); }} onEscapeKeyDown={e => { e.preventDefault(); if (complete && !leaving) setLeaving(true); }} onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
        <header className="xray-machine-header"><span className="flex items-center gap-2"><ScanLine className="h-5 w-5" /> THE CLIENT X-RAY</span><span className="flex items-center gap-2 text-xs"><Check className="h-4 w-4" /> Responses saved</span></header>
        <div className="xray-machine-body">
          <div className="xray-machine-visual" aria-hidden="true">
            <div className="xray-machine-grid" />
            <div className="xray-machine-cross corner-tl" /><div className="xray-machine-cross corner-tr" /><div className="xray-machine-cross corner-bl" /><div className="xray-machine-cross corner-br" />
            <div className="xray-machine-modules">{[Users, Target, TrendingUp, Activity].map((Icon, index) => <span key={index}><Icon /></span>)}</div>
            <img src={complete ? positive : doctor} alt="" className="xray-machine-doctor" />
            {!complete && <div className="xray-machine-beam" />}
            <span className="xray-machine-visual-label">{complete ? "RESPONSES RECEIVED" : "BUSINESS EXAMINATION"}</span>
          </div>
          <div className="xray-machine-copy">
            <p className="text-xs font-semibold text-primary">{complete ? "SUBMISSION CONFIRMED" : "YOUR BUSINESS · IN FOCUS"}</p>
            <Dialog.Title ref={title} tabIndex={-1} className="xray-machine-title">{complete ? "Your X-Ray is Complete!" : "Your business, ready for a closer look."}</Dialog.Title>
            <Dialog.Description className="xray-machine-description">{complete ? "Your business examination has been successfully submitted. Your X-Ray report is next." : "Your responses are saved. Your examination report will be prepared from your answers after this submission receipt."}</Dialog.Description>
            <p role="status" aria-live="polite" aria-atomic="true" className={complete ? "sr-only" : "xray-machine-message mt-6"}>{complete ? "Your X-Ray submission is complete. Your answers are securely saved. View your X-Ray report to continue." : messages[Math.min(4, Math.floor(progress / 20))]}</p>
            {!complete ? <div className="xray-machine-status">
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Submission receipt</span><span>{Math.round(progress)}%</span></div>
              <div role="progressbar" aria-label="Submission receipt animation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-valuetext={`${Math.round(progress)}% of submission receipt. Responses already saved.`} className="xray-machine-progress"><span style={{ width: `${progress}%` }} /></div>
            </div> : <div className="xray-machine-completion">
              <span className="flex items-center gap-2 text-sm text-primary"><Check className="h-5 w-5" />Your answers are securely saved.</span>
              <Button ref={reportButton} variant="premium" size="lg" className="mt-6 w-full whitespace-normal" disabled={leaving} onClick={() => setLeaving(true)}>View my X-Ray report <ArrowRight aria-hidden="true" /></Button>
            </div>}
          </div>
        </div>
        <footer className="xray-machine-footer"><span>THE SALES CLINIC</span><span>{complete ? "Next: your findings and downloadable PDF" : "Securely received · No answers lost"}</span></footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}