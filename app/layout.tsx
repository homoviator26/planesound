import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://planesound.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "플레인사운드 — 제주 항공 소음 피해 자가진단",
    template: "%s | 플레인사운드",
  },
  description:
    "WHO·ISO 국제 기준에 근거해 제주 항공 소음 피해 수준을 정량적으로 진단하고, 익명 누적 데이터로 제주 전체 피해 현황을 시각화합니다.",
  keywords: ["제주 항공 소음", "항공 소음 피해", "WHO 소음 기준", "제주공항", "소음 진단"],
  openGraph: {
    title: "플레인사운드 — 제주 항공 소음 피해 자가진단",
    description: "내 항공 소음 피해 수준을 WHO·ISO 기준으로 측정해보세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "플레인사운드",
  },
  twitter: {
    card: "summary_large_image",
    title: "플레인사운드 — 제주 항공 소음 피해 자가진단",
    description: "내 항공 소음 피해 수준을 WHO·ISO 기준으로 측정해보세요.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
