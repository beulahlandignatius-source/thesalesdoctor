import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listAudits } from "@/lib/admin.functions";
import { SeverityBadge, DIAGNOSIS_OPTIONS, fmtDate } from "@/components/admin/Severity";

export const Route = createFileRoute("/admin/xray")({
  head: () => ({
    meta: [
      { title: "Completed X-Rays — Sales Doctor Admin" },
      { name: "description", content: "Private review of completed Sales Doctor assessments." },
      { property: "og:title", content: "Completed X-Rays — Sales Doctor Admin" },
      {
        property: "og:description",
        content: "Private review of completed Sales Doctor assessments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminList,
});

function AdminList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audits"],
    queryFn: () => listAudits(),
  });
  const [q, setQ] = useState("");
  const [diag, setDiag] = useState("");
  const [sev, setSev] = useState("");
  const [booked, setBooked] = useState("");

  const rows = useMemo(
    () =>
      (data ?? []).filter((r) => {
        const t = q.trim().toLowerCase();
        if (t && !r.name.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t))
          return false;
        if (diag && r.primary_diagnosis !== diag) return false;
        if (sev && r.severity !== sev) return false;
        if (booked && String(r.booked) !== booked) return false;
        return true;
      }),
    [data, q, diag, sev, booked],
  );

  const sel = "field w-full sm:!w-auto !py-2 text-sm min-h-11";
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Completed X-Rays</h1>
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Search name or email"
          placeholder="Search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="field !py-2 text-sm sm:!w-72"
        />
        <select
          value={diag}
          onChange={(e) => setDiag(e.target.value)}
          className={sel}
          aria-label="Diagnosis"
        >
          <option value="">All diagnoses</option>
          {DIAGNOSIS_OPTIONS.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          className={sel}
          aria-label="Severity"
        >
          <option value="">All severities</option>
          {["LOW", "MODERATE", "HIGH", "CRITICAL"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={booked}
          onChange={(e) => setBooked(e.target.value)}
          className={sel}
          aria-label="Booked"
        >
          <option value="">Booked & not booked</option>
          <option value="true">Booked</option>
          <option value="false">Not booked</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <p role="status" className="p-8 text-center text-muted-foreground">
            Loading…
          </p>
        ) : isError ? (
          <p role="alert" className="p-8 text-center text-destructive">
            Couldn't load X-Rays. Please refresh.
          </p>
        ) : !data?.length ? (
          <p className="p-10 text-center font-display text-lg text-primary">
            No completed X-Rays yet.
          </p>
        ) : !rows.length ? (
          <p className="p-8 text-center text-muted-foreground">No X-Rays match these filters.</p>
        ) : (
          <>
            <ul className="divide-y divide-border sm:hidden">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/admin/$id"
                    params={{ id: r.id }}
                    className="block w-full px-4 py-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-foreground">{r.name}</span>
                      <SeverityBadge value={r.severity} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.email}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{r.diagnosis_title}</p>
                    <p className="mt-1 truncate text-sm text-foreground">{r.sells || "—"}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {fmtDate(r.completed_at)} · Booked: {r.booked ? "Yes" : "No"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "What they sell",
                      "Primary diagnosis",
                      "Severity",
                      "Date",
                      "Booked",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className=" border-t border-border hover:bg-secondary/20">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <Link
                          to="/admin/$id"
                          params={{ id: r.id }}
                          className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-foreground">
                        {r.sells || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">{r.diagnosis_title}</td>
                      <td className="px-4 py-3">
                        <SeverityBadge value={r.severity} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {fmtDate(r.completed_at)}
                      </td>
                      <td className="px-4 py-3">{r.booked ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
