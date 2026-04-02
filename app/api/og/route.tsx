import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin; // e.g., http://localhost:3000 or your production domain

    const title = url.searchParams.get("title") ?? "VeriWorkly";
    const description =
      url.searchParams.get("description") ??
      "The ultimate tool for building modern applications at scale.";

    // Absolute URL for your public logo
    const logoUrl = `${origin}/veriworkly-logo.png`;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f4ef", // Light mode --background
          color: "#171717", // Light mode --foreground
          position: "relative",
        }}
      >
        {/* Layer 1: Top Left Radial Gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 28%)",
          }}
        />

        {/* Layer 2: Top Right Radial Gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at top right, rgba(96, 165, 250, 0.08), transparent 22%)",
          }}
        />

        {/* Layer 3: Denser, Lighter Grid Pattern */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Changed width/height to 16 to make the gaps smaller */}
            <pattern
              id="grid"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              {/* Updated the path dimensions to 16 and lowered opacity to 0.035 */}
              <path
                d="M 16 0 L 0 0 0 16"
                fill="none"
                stroke="rgba(23, 23, 23, 0.035)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Layer 4: Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          {/* Logo and Brand Name */}
          <div
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="VeriWorkly Logo"
              width="48"
              height="48"
              style={{ marginRight: 16, objectFit: "contain" }}
            />
            VeriWorkly
          </div>

          {/* Title Text */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              maxWidth: "80%",
            }}
          >
            {title}
          </div>

          {/* Description Text */}
          <div style={{ fontSize: 32, color: "#5f5c54", maxWidth: "70%" }}>
            {description}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
