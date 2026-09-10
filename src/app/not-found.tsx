import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-6 py-24">
      <p className="font-cond text-[12px] tracking-[0.24em] text-dust">NOT IN THIS CUT</p>
      <h1 className="mt-3 font-display text-5xl">This record is not in the mock catalog.</h1>
      <Link href="/archive" className="mt-8 inline-block font-cond tracking-[0.2em] underline underline-offset-4">
        RETURN TO THE INDEX
      </Link>
    </div>
  );
}
