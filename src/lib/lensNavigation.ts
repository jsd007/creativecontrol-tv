export type LensPath = "/world" | "/archive" | "/tapes" | "/timeline" | "/tv";

const LENSES: Record<LensPath, { label: string; keys: readonly string[] }> = {
  "/world": { label: "YOUR WORLD VIEW", keys: ["city", "year", "present"] },
  "/archive": {
    label: "YOUR INDEX",
    keys: ["q", "era", "year", "location", "person", "track", "album", "project", "event", "type", "collection", "month", "day", "decade", "refine", "present"],
  },
  "/tapes": { label: "YOUR SOURCE SELECTION", keys: ["open", "scope", "q", "all", "present"] },
  "/timeline": { label: "YOUR TIMELINE", keys: ["through", "year", "month", "day", "present"] },
  "/tv": { label: "YOUR TV SELECTION", keys: ["ch", "clip", "block", "q", "page", "present"] },
};

/** A record can return only to a known local lens, never a supplied external URL. */
export function parseLensReturn(raw?: string | null): { href: string; label: string } | undefined {
  if (!raw || raw.length > 2048 || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("#")) return undefined;
  let url: URL;
  try {
    url = new URL(raw, "https://archive.local");
  } catch {
    return undefined;
  }
  if (url.origin !== "https://archive.local" || !Object.hasOwn(LENSES, url.pathname)) return undefined;
  const lens = LENSES[url.pathname as LensPath];
  const safe = new URLSearchParams();
  for (const key of lens.keys) {
    const value = url.searchParams.get(key);
    if (value && value.length <= 512) safe.set(key, value);
  }
  return { href: `${url.pathname}${safe.size ? `?${safe.toString()}` : ""}`, label: lens.label };
}

/** Keep lens-owned selection and presentation settings while updating a link. */
export function lensHref(path: LensPath, currentSearch = "", patch: Record<string, string | null | undefined> = {}) {
  const params = new URLSearchParams(currentSearch);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  return parseLensReturn(`${path}${params.size ? `?${params.toString()}` : ""}`)?.href ?? path;
}

export function clipHref(slug: string, returnPath?: string) {
  const path = `/clip/${encodeURIComponent(slug)}`;
  const from = parseLensReturn(returnPath)?.href;
  return from ? `${path}?${new URLSearchParams({ from }).toString()}` : path;
}

/** Source files can be opened on a discovery path without dropping that path. */
export function tapeHref(id: string, returnPath?: string) {
  const path = `/tapes/${encodeURIComponent(id)}`;
  const from = parseLensReturn(returnPath)?.href;
  return from ? `${path}?${new URLSearchParams({ from }).toString()}` : path;
}
