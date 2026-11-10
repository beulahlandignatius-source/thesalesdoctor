import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, Minus, RotateCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotCharacter, type CharacterState } from "@/components/mascot-character";
import { GUIDE_QUESTIONS, SALES_TIPS, respondToMessage, summarizeGuide, type CompanionDestination } from "@/lib/sales-companion";

type Context = { message: string; state: CharacterState };
const WELCOME: Context = { message: "Need help fixing your sales?", state: "welcome" };

function usePageContext(path: string): Context {
  const [context, setContext] = useState<Context>(WELCOME);
  useEffect(() => {
    const base: Context = path.startsWith("/mentorship") ? { message: "Explore direct support through mentorship.", state: "encouraging" }
      : path.startsWith("/services") ? { message: "Explore the support that fits your goals.", state: "explaining" }
      : path.startsWith("/book") ? { message: "Let's find the session that fits.", state: "booking" }
      : path.startsWith("/reviews") ? { message: "Take a look at customer experiences.", state: "explaining" }
      : path.startsWith("/xray") ? { message: "Time for a sales health check!", state: "diagnosing" } : WELCOME;
    setContext(base);
    const update = () => {
      const point = window.innerHeight * .55;
      const el = Array.from(document.querySelectorAll("main > section")).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= point && rect.bottom >= point;
      });
      if (!el) return;
      if (el.classList.contains("close-wrap")) setContext({ message: "Ready to take your next step?", state: "booking" });
      else if (el.classList.contains("mentorship-spread")) setContext({ message: "Explore direct support through mentorship.", state: "encouraging" });
      else if (el.querySelector(".session-question")) setContext({ message: "Three questions. Let's find your next step.", state: "thinking" });
      else if (el.querySelector(".who-bento")) setContext({ message: "Which of these sounds like you?", state: "explaining" });
      else if (el.querySelector(".review-stack")) setContext({ message: "Take a look at customer experiences.", state: "explaining" });
      else setContext(base);
    };
    let frame = 0;
    const schedule = () => { if (frame) return; frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const timer = window.setTimeout(update, 500);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [path]);
  return context;
}

export function SalesCompanion() {
  const path = useRouterState({ select: s => s.location.pathname });
  const context = usePageContext(path);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [bubble, setBubble] = useState(true);
  const [tip, setTip] = useState("");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<ReturnType<typeof respondToMessage> | null>(null);
  const [sent, setSent] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const launch = useRef<HTMLButtonElement>(null);
  const progressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hidden = /^\/(admin|audit|results|reset-password)(\/|$)/.test(path) || path === "/xray/book";
  const summary = summarizeGuide(answers);
  const question = GUIDE_QUESTIONS[step];
  const state: CharacterState = celebrate ? "celebrating" : summary ? "encouraging" : started ? "thinking" : context.state;

  useEffect(() => {
    setBubble(true); setTip("");
    const hide = window.setTimeout(() => setBubble(false), 6500);
    return () => clearTimeout(hide);
  }, [context.message]);
  useEffect(() => {
    if (open || dismissed || hidden) return;
    let index = 0;
    let hide: number | undefined;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setTip(SALES_TIPS[index % SALES_TIPS.length] ?? ""); index++; setBubble(true);
      hide = window.setTimeout(() => { setBubble(false); setTip(""); }, 6500);
    }, 65000);
    return () => { clearInterval(timer); if (hide) clearTimeout(hide); };
  }, [open, dismissed, hidden]);
  useEffect(() => () => { if (progressTimer.current) clearTimeout(progressTimer.current); }, []);
  useEffect(() => { setOpen(false); }, [path]);

  const reset = () => { setStarted(true); setStep(0); setAnswers([]); setSelected(""); setReply(null); setSent(""); };
  const advance = () => {
    if (!selected.trim() || !question) return;
    const next = [...answers.slice(0, step), selected.trim()];
    setAnswers(next); setSelected(""); setReply(null); setSent("");
    if (step < 2) setStep(step + 1);
    setCelebrate(true);
    if (progressTimer.current) clearTimeout(progressTimer.current);
    progressTimer.current = setTimeout(() => setCelebrate(false), 1100);
  };
  const navigateAction = (to: CompanionDestination, label: string, primary = false) => <Button asChild variant={primary ? "premium" : "outline"} className="companion-action"><Link to={to} onClick={() => setOpen(false)}>{label}<ArrowRight /></Link></Button>;

  if (hidden || dismissed) return null;
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <div className={`companion-launcher ${path.startsWith("/book") ? "companion-raised" : ""}`} data-no-edit>
      {!open && bubble && <div className="companion-nudge"><p>{tip || context.message}</p><Button variant="ghost" size="icon" aria-label="Dismiss mascot message" onClick={() => setBubble(false)}><X /></Button></div>}
      <Dialog.Trigger asChild><Button ref={launch} variant="ghost" aria-label="Open Dr. Dan sales guide" className="companion-launch"><MascotCharacter state={context.state} /><span className="companion-launch-dot" /></Button></Dialog.Trigger>
    </div>
    <Dialog.Portal>
      <Dialog.Overlay className="companion-overlay" />
      <Dialog.Content className="companion-panel" data-no-edit onCloseAutoFocus={e => { e.preventDefault(); launch.current?.focus(); }}>
        <div className="companion-panel-top">
          <div><Dialog.Title className="font-display text-xl font-bold">Dr. Dan</Dialog.Title><Dialog.Description className="mt-1 text-xs text-muted-foreground">The Sales Doctor</Dialog.Description></div>
          <div className="flex gap-1"><Button variant="ghost" size="icon" title="Minimise" aria-label="Minimise sales guide" onClick={() => setOpen(false)}><Minus /></Button><Button variant="ghost" size="icon" title="Close" aria-label="Close sales guide" onClick={() => { setOpen(false); setBubble(false); }}><X /></Button></div>
        </div>
        <div className="companion-panel-scroll">
          <div className="companion-intro"><MascotCharacter state={state} /><div><span className="eyebrow">Your next move</span><p className="mt-2 font-display text-lg font-semibold">{summary ? "Let's work on your next step." : started ? "Time for a sales health check!" : "Hello, I'm Dr. Dan. Let's find where to start."}</p></div></div>
          {!started ? <div className="space-y-3"><p className="text-sm text-muted-foreground">Tell me your sales challenge, who you sell to and what you want to achieve.</p><Button variant="premium" className="w-full" onClick={reset}>Start my sales health check<ArrowRight /></Button><div className="grid grid-cols-2 gap-2">{["How do I book?", "Tell me about mentorship", "What does a session cost?", "What is Client X-Ray?"].map(q => <Button key={q} variant="outline" className="companion-suggestion" onClick={() => { setSent(q); setReply(respondToMessage(q)); }}>{q}</Button>)}</div></div>
          : summary ? <div className="companion-summary" aria-live="polite"><span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Check />Your starting point</span><p className="mt-3 text-sm">{summary.focus}</p><p className="mt-3 text-sm text-muted-foreground">{summary.guidance}</p><p className="mt-3 text-xs text-muted-foreground">Guidance based on your answers, not a full business diagnosis or a promise of results.</p><div className="mt-5 space-y-2">{navigateAction(summary.destination, summary.action, true)}{navigateAction("/services", "Explore services")}{navigateAction("/book", "Book a consultation")}</div><Button variant="ghost" className="mt-3" onClick={reset}><RotateCcw />Start again</Button></div>
          : question && <div key={step} className="companion-question"><div className="mb-3 flex items-center justify-between text-xs font-semibold text-primary"><span>Question {step + 1} of 3</span><span className="flex gap-1">{GUIDE_QUESTIONS.map((_,i) => <span key={i} className={`companion-step ${i <= step ? "step-on" : ""}`} />)}</span></div><h2 className="font-display text-xl font-bold leading-snug">{question.text}</h2><div role="group" aria-label={question.text} className="mt-4 space-y-2">{question.options.map(option => <Button key={option} variant="outline" aria-pressed={selected === option} className="companion-option" onClick={() => setSelected(option)}><span>{option}.</span>{selected === option && <Check />}</Button>)}</div><div className="mt-4 flex gap-2"><Button variant="ghost" aria-label="Previous question" disabled={step === 0} onClick={() => { const previous = step - 1; setSelected(answers[previous] ?? ""); setAnswers(answers.slice(0, previous)); setStep(previous); }}><ArrowLeft /></Button><Button variant="premium" className="flex-1" disabled={!selected.trim()} onClick={advance}>{step === 2 ? "See my guidance" : "Next question"}<ArrowRight /></Button></div></div>}
          {reply && <div className="companion-reply" aria-live="polite"><p className="text-xs text-muted-foreground">{sent}</p><p className="mt-2 text-sm">{reply.text}</p>{reply.destination && reply.action && <div className="mt-3">{navigateAction(reply.destination, reply.action)}</div>}</div>}
        </div>
        <form className="companion-input" onSubmit={e => { e.preventDefault(); const value = message.trim(); if (!value) return; if (started && !summary) { setSelected(value); setReply({ text: "Your answer is selected. Continue to the next question when you're ready." }); } else setReply(respondToMessage(value)); setSent(value); setMessage(""); }}>
          <label htmlFor="companion-message" className="sr-only">{started && !summary ? "Type your answer" : "Ask about sales or sessions"}</label><input id="companion-message" value={message} maxLength={500} autoComplete="off" onChange={e => setMessage(e.target.value)} placeholder={started && !summary ? "Or type your own answer…" : "Ask about sales or sessions…"} /><Button type="submit" variant="premium" size="icon" aria-label="Send message" disabled={!message.trim()}><Send /></Button>
        </form>
        <div className="companion-panel-note"><p>Predefined guidance, not an AI chat.</p><Button variant="ghost" size="sm" onClick={() => { setOpen(false); setDismissed(true); }}>Hide companion</Button></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}