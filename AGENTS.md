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
- Reviews use an insert-only public server function with validation and default pending status; public reads expose only published rows. Existing sample reviews live in the same table with stable source keys for bundled avatars; authenticated admin-checked functions edit/delete through RLS so every review has one authoritative record.
- Stock review portraits are mapped only to existing sample source keys through the shared headshot collection; preserve client-uploaded photos and label sample cards to avoid attributing testimonials to stock models.
- StackedCards supplies swipe, arrow and dot navigation for steps and reviews; shared presentation keeps the reference interaction consistent without changing photo markup.
- Visitor and admin layout wrappers scope shared visual tokens; dashboard summaries use existing protected reads and never substitute demo counts for live data.
- A shared ThemeProvider owns the document dark class and browser-stored theme preference; visitor and admin navigation reuse ThemeToggle so every page shares one theme.
- Booking and mentorship forms share branded FormShell/F controls and grouped contact fields; consultation fields use persistent inset labels and grouped challenges use a collapsible multi-select with hidden inputs, preserving original names and submit handlers so presentation changes preserve saved data and onward journeys.
- Clinic bonus data lives in a shared browser-safe offer module; FormShell shows forms immediately, retaining steps and optional bonus content in expandable details without intermediate history entries or changed submission/payment logic.
- CountryFlags uses duplicated, accessibility-hidden tracks for a seamless regional flag loop; pause on hover/focus and provide manual scrolling for reduced motion without altering client statistics.
- Private Sales Clinic paid counts come only from signed provider notifications stored once per provider payment; browser payment clicks are intent, not proof of payment.
- Admin site editing stores text/photo replacements in site_overrides keyed by original wording or image address, applied client-side by SiteEditor; empty text and a removed-image sentinel provide reversible deletion without changing page structure or controls.
- Page editing controls render only in a same-origin page preview embedded in /admin/content for a verified admin; standalone visitor pages apply saved overrides without edit controls or click interception.
- Client X-Ray mascot guidance is presentation-only: reuse real question/answer and result state, never compute or fabricate diagnoses, and keep scanning effects noninteractive with reduced-motion fallbacks.
- X-Ray groups original question IDs into six topic stages through audit-pages; stored steps remain original question indexes for legacy resume, and topic navigation saves through the existing answer endpoint. Phones use an internally scrolling form with stationary Back/Continue, while results scroll normally and Calendly stays separate. Business scan completion follows real diagnosis status, never animation timers.
- The visitor mascot companion uses an isolated deterministic guidance adapter and in-memory answers; it does not alter Client X-Ray diagnoses or store conversations, and is excluded from admin and focused assessment screens to avoid obstructing controls.
- About and Services reuse the shared motion hook with editorial-scoped selectors; keep reduced-motion fallbacks and existing photo framing intact to avoid separate animation systems.
- Shared PageTransition animates committed route content without keys, exit waits or transformed containers; browser history indexes supply direction, and page-transition.ts centralizes timing. Phone X-Ray reveals content groups with small offsets and reduced-motion fallbacks, keeping scroll hosts and action bars stationary.
- Use the shared WhatsAppIcon brand mark for WhatsApp contact actions and fields; ExtLink adds it for WhatsApp destinations so repeated links stay consistent.
- Admin navigation below the desktop sidebar breakpoint uses three primary tabs and one accessible More dialog for secondary sections and account actions; keep dashboard layout adjustments scoped to the admin shell.
- Global admin search uses authenticated, admin-checked RLS queries with literal-text matching; record links fetch by ID independently of list limits/status filters, and provider-confirmed payments remain distinct from uploaded screenshots.
- Saved admin views persist filter definitions per admin and scope in Cloud with owner/admin RLS; reapplying replaces the current filters, preserves exact date ranges, and never stores result records.
