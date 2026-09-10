export const PRESENT_KEY = "cc-present";

/** One argument. Destinations are the real catalog — no invented records, no constellation. */
export const PRESENT_BEATS = [
  { id: "enter", href: "/", label: "Threshold" },
  { id: "world", href: "/world", label: "World" },
  { id: "chicago", href: "/world?city=chicago&fly=1", label: "Chicago" },
  { id: "clip", href: "/clip/channel-zero-never-aired", label: "Footage" },
  { id: "archive", href: "/archive?person=ye&location=chicago&year=2002&type=Studio", label: "Index" },
  { id: "person", href: "/archive?person=ye", label: "Person" },
  { id: "tv", href: "/tv?ch=7", label: "Television" },
  { id: "channel", href: "/tv?ch=3", label: "Channel" },
  { id: "tape", href: "/tapes?open=t-0217", label: "Tape" },
  { id: "timeline", href: "/timeline", label: "Timeline" },
] as const;

/** Same-path hops that already have a house verb. Present still Cuts every other hop. */
export function presentKeepsLensMotion(pathname: string) {
  return pathname === "/world" || pathname === "/tv" || pathname === "/tapes";
}

export function matchBeat(pathname: string, search: URLSearchParams) {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/world")) return search.get("fly") === "1" ? 2 : 1;
  if (pathname.startsWith("/clip/")) return 3;
  if (pathname.startsWith("/archive")) {
    const tight = search.get("person") && search.get("location") && search.get("year") && search.get("type");
    return tight ? 4 : 5;
  }
  if (pathname.startsWith("/tv")) {
    return search.get("ch") === "3" ? 7 : 6;
  }
  if (pathname.startsWith("/tapes")) return 8;
  if (pathname.startsWith("/timeline")) return 9;
  if (
    pathname.startsWith("/people/") ||
    pathname.startsWith("/places/") ||
    pathname.startsWith("/projects/") ||
    pathname.startsWith("/constellation")
  ) {
    return 5;
  }
  return 0;
}

export function readPresentFlag() {
  try {
    return sessionStorage.getItem(PRESENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePresentFlag(on: boolean) {
  try {
    if (on) sessionStorage.setItem(PRESENT_KEY, "1");
    else sessionStorage.removeItem(PRESENT_KEY);
  } catch {
    /* ignore */
  }
}
