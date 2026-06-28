import { ImageResponse } from "next/og";

// Apple touch icon — iOS uses this for the Home Screen icon when you
// "Add to Home Screen". Full-bleed background; iOS rounds the corners.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a6098",
          color: "#f7f8fa",
          fontSize: 118,
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
