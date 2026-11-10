import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAuditDetail } from "@/lib/admin.functions";
import { QUESTIONS } from "@/lib/audit";
import { SeverityBadge, fmtDate } from "@/components/admin/Severity";

export const Route = createFileRoute("/admin/$id")({
  head: () => ({
    meta: [
      { title: "X-Ray Details | Sales Doctor Admin" },
      { name: "description", content: "Private client assessment details and diagnosis." },
      { property: "og:title", content: "X-Ray Details | Sales Doctor Admin" },
      { property: "og:description", content: "Private client assessment details and diagnosis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LeadDetail,
});

const GROUPS = [
  "Market",
  "Positioning",
  "Offer",
  "Lead Generation",
  "Sales",
  "Follow-up",
  "Business Numbers",
];
const groupOf = (section: string) =>
  section === "About your business" || section === "Optional numbers"
    ? "Business Numbers"
    : section;

function LeadDetail() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audit", id],
    queryFn: () => getAuditDetail({ data: { id } }),
  });
  if (isLoading)
    return (
      <p role="status" className="text-muted-foreground">
        Loading…
      </p>
    );
  if (isError || !data)
    return (
      <p role="alert" className="text-destructive">
        Couldn't load this X-Ray.
      </p>
    );
  const { session: s, answers, result: r } = data;
  const a = Object.fromEntries(answers.map((x) => [x.question_id, x]));
  const ans = (qid: string) => a[qid]?.answer || "-";
  const scores: [string, number | null | undefined][] = [
    ["Market", r?.market_score],
    ["Positioning", r?.positioning_score],
    ["Offer", r?.offer_score],
    ["Lead Generation", r?.lead_generation_score],
    ["Sales", r?.sales_score],
    ["Follow-up", r?.follow_up_score],
  ];
  const evidence = (r?.evidence as string[] | undefined) ?? [];
  const card = "rounded-3xl border border-border bg-card p-6";
  const label = "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground";

  return (
    <div className="space-y-6">
      <Link to="/admin/xray" className="text-sm text-muted-foreground hover:text-primary">
        ← All X-Rays
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold break-words text-foreground">
          {s.name}
        </h1>
        <p className="mt-1 break-all text-muted-foreground">{s.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card}>
          <p className={label}>Client information</p>
          <dl className="mt-4 space-y-3 text-sm">
            {(
              [
                ["Name", s.name],
                ["Email", s.email],
                ["WhatsApp", s.phone],
                ["What they sell", ans("q1")],
                ["Who they sell to", ans("q2")],
                ["Selling for", ans("q3")],
                ["Average client worth", ans("q4")],
                ["Ideal new clients / month", ans("q5")],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="break-words text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={card}>
          <p className={label}>Diagnostic scores</p>
          <div className="mt-4 space-y-4">
            {scores.map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{k}</span>
                  <span className="font-semibold text-primary">{v == null ? "-" : `${v}/100`}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${v ?? 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {r && (
        <section className={card}>
          <p className={label}>Primary diagnosis</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-semibold uppercase text-primary">
              {r.diagnosis_title}
            </h2>
            <SeverityBadge value={r.severity} />
            <span className="text-sm text-muted-foreground">
              Confidence {Math.round(Number(r.confidence) * 100)}%
            </span>
          </div>
          <p className="mt-4 text-lg font-medium text-foreground">{r.one_sentence_diagnosis}</p>
          <p className={`${label} mt-5`}>Evidence</p>
          <ul className="mt-2 space-y-2">
            {evidence.map((e) => (
              <li key={e} className="flex gap-3 text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {e}
              </li>
            ))}
          </ul>
          <p className={`${label} mt-5`}>Business impact</p>
          <p className="mt-2 text-foreground">{r.business_impact}</p>
          {r.secondary_observation && (
            <>
              <p className={`${label} mt-5`}>Secondary observation</p>
              <p className="mt-2 text-foreground">{r.secondary_observation}</p>
            </>
          )}
        </section>
      )}

      <section className={card}>
        <p className={label}>Booking status</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Booked</dt>
            <dd className="mt-1 font-medium text-foreground">{s.booked ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Completed</dt>
            <dd className="mt-1 font-medium text-foreground">{fmtDate(s.completed_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium text-foreground">
              {s.booked ? "Review booked" : "Not booked yet"}
            </dd>
          </div>
        </dl>
      </section>

      <section className={card}>
        <p className={label}>Answers</p>
        <div className="mt-4 space-y-8">
          {GROUPS.map((g) => {
            const qs = QUESTIONS.filter((q) => groupOf(q.section) === g);
            return (
              <div key={g}>
                <h2 className="font-display text-lg font-semibold text-primary">{g}</h2>
                <ol className="mt-3 divide-y divide-border">
                  {qs.map((q) => (
                    <li
                      key={q.id}
                      className="grid gap-1 py-3 text-sm sm:grid-cols-[1fr_1fr_60px] sm:gap-4"
                    >
                      <span className="text-muted-foreground">{q.text}</span>
                      <span className="text-foreground">{ans(q.id)}</span>
                      <span className="font-semibold text-primary sm:text-right">
                        {a[q.id]?.score != null ? `${a[q.id]?.score}/5` : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
