/**
 * Only follow `next` when it resolves to this site. A prefix check isn't enough: browsers read
 * "/\evil.example" as "//evil.example", which would send someone off-site right after a real
 * Google sign-in.
 */
export function safeNext(next: string | null, origin: string | undefined): string {
  if (!next || !origin) return "/";
  try {
    const url = new URL(next, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : "/";
  } catch {
    return "/";
  }
}
