import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1628",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            background: "#6BA9E0",
            borderRadius: 999,
          }}
        />
      </div>
    ),
    size,
  );
}
