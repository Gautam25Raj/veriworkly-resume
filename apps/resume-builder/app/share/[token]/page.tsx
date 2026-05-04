import type { Metadata } from "next";

import ShareResumeClient from "./share-resume-client";

export const metadata: Metadata = {
  title: "Shared Resume | VeriWorkly",
  description: "View a shared resume link.",
  robots: { index: false, follow: false },
};

export default async function SharedResumePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <ShareResumeClient token={token} />;
}
