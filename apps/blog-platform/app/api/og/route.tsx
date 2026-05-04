import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") ?? "VeriWorkly";
    const description = searchParams.get("description");
    const showDescription = searchParams.get("showDesc") !== "false";

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://veriworkly.com";
    const logoUrl = `${baseUrl}/veriworkly-logo.png`;

    const displayDescription =
      description || "Building the future of professional resumes, one sync at a time.";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          color: "#171717",
          alignItems: "center",
          position: "relative",
          flexDirection: "column",
          fontFamily: "sans-serif",
          justifyContent: "center",
          backgroundColor: "#f5f4ef",
        }}
      >
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
            <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 48,
              display: "flex",
              alignItems: "center",
              letterSpacing: "-0.02em",
              opacity: 0.9,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                marginRight: 14,
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
            VeriWorkly
          </div>

          <div
            style={{
              fontSize: title.length > 40 ? 60 : 84,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: showDescription ? 28 : 0,
              maxWidth: "1000px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {showDescription && (
            <div
              style={{
                fontSize: 34,
                color: "#4b5563",
                maxWidth: "800px",
                lineHeight: 1.4,
                fontWeight: 500,
                display: "flex",
              }}
            >
              {displayDescription}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: 0.4,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          veriworkly.com
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new Response(`Error generating image`, { status: 500 });
  }
}
