import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MULTI_SEP, OPTIONAL_IDS, type Question } from "@/lib/audit";

export function XrayTopicQuestion({ question: q, answer, busy, onAnswer }: { question: Question; answer: string; busy: boolean; onAnswer: (value: string) => void }) {
  const multi = q.type === "choice" && !!q.multi;
  const selected = multi ? answer.split(MULTI_SEP).filter(Boolean) : [answer];
  return <fieldset className="xray-topic-question" id={`group-${q.id}`}>
    <legend id={`heading-${q.id}`} className="font-display font-semibold leading-relaxed">{q.text}</legend>
    {OPTIONAL_IDS.has(q.id) && <p className="mt-2 text-sm text-muted-foreground">Optional. Skip if you'd rather not say.</p>}
    {q.type === "text" ? <>
      <textarea aria-labelledby={`heading-${q.id}`} required={!OPTIONAL_IDS.has(q.id)} value={answer} onChange={e => onAnswer(e.target.value)} disabled={busy} maxLength={1000} rows={2} placeholder={q.placeholder ?? "Type your answer"} className="field mt-3 resize-y" onBlur={e => {
        if (!OPTIONAL_IDS.has(q.id) && !e.currentTarget.value.trim()) window.__lovableEvents?.track?.("project.xray_validation_error", { stage: "questions", field: "answer", reason: "required" });
      }} />
    </> : <>
      {multi && <p className="mt-2 text-sm text-muted-foreground">Select all that apply.</p>}
      <div className="xray-topic-options mt-4 space-y-3" role="group" aria-labelledby={`heading-${q.id}`}>
      {q.options.map(option => <Button key={option} type="button" variant="answer" disabled={busy} aria-pressed={selected.includes(option)} onClick={() => {
        const value = multi ? (selected.includes(option) ? selected.filter(x => x !== option) : [...selected, option]).join(MULTI_SEP) : option;
        onAnswer(value);
      }} className={`xray-option ${selected.includes(option) ? "answer-card-on" : ""}`}>
        <span className={`xray-topic-check ${multi ? "rounded" : "rounded-full"} ${selected.includes(option) ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{selected.includes(option) && <Check className="h-3.5 w-3.5" />}</span>
        <span className="min-w-0 flex-1 text-left">{option}</span>
      </Button>)}
    </div></>}
  </fieldset>;
}