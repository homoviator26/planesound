export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-white">
      <div className="container-wide py-10 text-sm text-muted">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold text-navy">플레인사운드 — Plane Sound</p>
            <p className="mt-1">제주 항공 소음 자가진단 프로젝트</p>
          </div>
          <div className="space-y-1 md:text-right">
            <p>출처: WHO Environmental Noise Guidelines (2018)</p>
            <p>출처: ISO 15666:2003 — Annoyance Scale</p>
            <p className="text-xs">모든 응답은 완전 익명으로 수집됩니다.</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted/80">© {new Date().getFullYear()} Plane Sound</p>
      </div>
    </footer>
  );
}
