import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "진단하기",
  description: "WHO·ISO 기준 12문항으로 항공 소음 피해 수준을 진단합니다.",
};

export default function DiagnosisLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
