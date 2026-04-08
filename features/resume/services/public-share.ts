"use client";

import type { ResumeData } from "@/types/resume";

import { backendApiUrl } from "@/lib/constants";

export type ShareLinkPayload = {
  passwordRequired: boolean;
  resumeTitle: string;
  expiresAt: string | null;
  snapshot?: ResumeData;
  viewCount?: number;
};

export async function fetchShareLink(token: string) {
  const response = await fetch(backendApiUrl(`/share-links/${token}`), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Shared resume not found");
  }

  const payload = (await response.json()) as { data: ShareLinkPayload };
  return payload.data;
}

export async function verifyShareLink(token: string, password: string) {
  const response = await fetch(backendApiUrl(`/share-links/${token}/verify`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(payload.message || "Invalid password");
  }

  const payload = (await response.json()) as { data: ShareLinkPayload };
  return payload.data;
}

export async function downloadPublicShareExport(
  token: string,
  format: "pdf" | "png" | "jpg",
  password?: string,
) {
  const queueResponse = await fetch(
    backendApiUrl(`/share-links/${token}/export/jobs`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        format,
        password,
      }),
    },
  );

  if (!queueResponse.ok) {
    const payload = (await queueResponse.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(payload.message || "Could not queue shared export");
  }

  const queued = (await queueResponse.json()) as {
    data: {
      jobId: string;
    };
  };

  const jobId = queued.data.jobId;
  const pollTimeoutAt = Date.now() + 60_000;

  while (Date.now() < pollTimeoutAt) {
    const statusResponse = await fetch(
      backendApiUrl(`/share-links/${token}/export/jobs/${jobId}`),
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!statusResponse.ok) {
      const payload = (await statusResponse.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new Error(payload.message || "Could not read shared export status");
    }

    const statusPayload = (await statusResponse.json()) as {
      data: {
        status: "queued" | "processing" | "completed" | "failed";
        errorMessage?: string | null;
      };
    };

    if (statusPayload.data.status === "failed") {
      throw new Error(
        statusPayload.data.errorMessage || "Shared export failed",
      );
    }

    if (statusPayload.data.status === "completed") {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (Date.now() >= pollTimeoutAt) {
    throw new Error("Shared export is taking too long. Please retry.");
  }

  const response = await fetch(
    backendApiUrl(`/share-links/${token}/export/jobs/${jobId}/download`),
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(payload.message || "Could not download shared export");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `shared-resume.${format}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
