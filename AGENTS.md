<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Sales Clinic pages (/, /book/*, /mentorship) and the imported Client X-Ray (/xray, /audit, /results) share one root nav/footer; /admin/* has its own AdminNav instead — keeps visitor and admin chrome separate.
- Visitor forms save via the public submitEnquiry server fn (zod-validated, insert-only with the admin client); clinic_enquiries/audit_* tables have RLS with admin-only reads via is_admin(), so visitors can never read stored data.
- Admin access = Cloud email/password sign-in plus a row in admin_users; there is no public admin signup.
- src/lib/backend/* are thin re-exports of the generated Cloud clients/middleware so the imported X-Ray code keeps its imports.
- Reviews use an insert-only public server function with validation and default pending status; public reads expose only published rows, and authenticated admins moderate through RLS to prevent unapproved content appearing.
- StackedCards supplies swipe, arrow and dot navigation for steps and reviews; shared presentation keeps the reference interaction consistent without changing photo markup.
- Visitor and admin layout wrappers scope shared visual tokens; dashboard summaries use existing protected reads and never substitute demo counts for live data.
- A shared ThemeProvider owns the document dark class and browser-stored theme preference; visitor and admin navigation reuse ThemeToggle so every page shares one theme.
- Booking and mentorship forms share branded FormShell/F controls and grouped contact fields; keep original input names and submit handlers so presentation changes preserve saved data and onward journeys.
- Private Sales Clinic paid counts come only from signed provider notifications stored once per provider payment; browser payment clicks are intent, not proof of payment.
- Admin site editing stores text/photo replacements in site_overrides keyed by the original wording or image address, applied client-side by SiteEditor over the rendered DOM; this makes every page editable without moving copy into the database.
