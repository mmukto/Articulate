import { ImageResponse } from "next/og";

// Generated app icon (used for favicon and the PWA manifest 512px icon).
export const size = { width: 512, height: 512 };
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
          background: "#6b6ed4",
          color: "#faf9f8",
          fontSize: 340,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
