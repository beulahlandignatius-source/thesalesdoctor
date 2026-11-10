// Uses the built-in Lovable Cloud backend. URL and publishable key are public by design.
export const BACKEND_URL: string =
  import.meta.env['VITE_SUPABASE_URL'] ?? (typeof process !== "undefined" ? process.env["SUPABASE_URL"] : "") ?? "";
export const BACKEND_PUBLISHABLE_KEY: string =
  import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ??
  (typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] : "") ??
  "";

/** Opaque sb_ keys are not JWTs: send them only as `apikey`, never as the bearer. */
export function keyFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}
