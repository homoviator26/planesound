import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky" />
          <span className="text-sm font-semibold tracking-tight text-navy">
            플레인사운드<span className="ml-1 text-muted font-normal">Plane Sound</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link href="/diagnosis" className="hover:text-navy transition-colors">진단하기</Link>
          <Link href="/dashboard" className="hover:text-navy transition-colors">집단 현황</Link>
        </nav>
      </div>
    </header>
  );
}
