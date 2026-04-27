import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "플레인사운드 — 제주 항공 소음 피해 자가진단";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PRETENDARD_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf";
const PRETENDARD_REGULAR =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Regular.otf";

export default async function OpenGraphImage() {
  const [bold, regular] = await Promise.all([
    fetch(PRETENDARD_BOLD).then((r) => r.arrayBuffer()),
    fetch(PRETENDARD_REGULAR).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0A1628 0%, #1B2A44 100%)",
          color: "white",
          padding: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, background: "#6BA9E0", borderRadius: 999 }} />
          <span style={{ fontSize: 26, letterSpacing: 6, fontWeight: 700, color: "#E8F1FB" }}>
            PLANE SOUND
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, color: "#9DB4D1", marginBottom: 16 }}>
            제주 항공 소음 피해 자가진단
          </span>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 800, lineHeight: 1.15, letterSpacing: -2 }}>
            <span>내 항공 소음 피해 수준을</span>
            <span>측정해보세요</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <Tag>WHO 환경소음 가이드라인 2018</Tag>
          <Tag>ISO 15666:2003</Tag>
          <Tag>5개 영역 12문항</Tag>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}

function Tag({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px 18px",
        background: "rgba(107, 169, 224, 0.12)",
        border: "1px solid rgba(107, 169, 224, 0.4)",
        borderRadius: 999,
        fontSize: 22,
        color: "#E8F1FB",
        fontWeight: 400,
      }}
    >
      {children}
    </div>
  );
}
