"use client";

import type { ResumeData } from "@/types/resume";

import { backendApiUrl } from "@/lib/constants";
import { ApiRequestError } from "@/utils/fetchApiData";

async function throwApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  throw new ApiRequestError(
    payload.message || fallbackMessage,
    response.status,
  );
}

type CreateResumeShareLinkOptions = {
  resumeTitle?: string;
  password?: string;
  expiresAt?: string | null;
  noExpiry?: boolean;
};

type CreateResumeShareLinkResult = {
  id: string;
  token: string;
  expiresAt: string | null;
};

export type ResumeShareLinkItem = {
  id: string;
  token: string;
  resumeTitle: string;
  expiresAt: string | null;
  passwordRequired: boolean;
  viewCount: number;
  lastViewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createResumeShareLink(
  resume: ResumeData,
  options: CreateResumeShareLinkOptions = {},
): Promise<CreateResumeShareLinkResult> {
  const response = await fetch(backendApiUrl(`/shares/resumes/${resume.id}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      resumeId: resume.id,
      snapshot: resume,
      resumeTitle:
        options.resumeTitle || resume.basics.fullName || "Shared Resume",
      password: options.password || undefined,
      expiresAt: options.expiresAt ?? null,
      noExpiry: options.noExpiry ?? false,
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to create share link");
  }

  const payload = (await response.json()) as {
    data: CreateResumeShareLinkResult;
  };

  return payload.data;
}

export async function listResumeShareLinks(
  resumeId: string,
): Promise<ResumeShareLinkItem[]> {
  const response = await fetch(backendApiUrl(`/shares/resumes/${resumeId}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to load share links");
  }

  const payload = (await response.json()) as { data: ResumeShareLinkItem[] };

  return payload.data;
}

export async function revokeResumeShareLink(
  resumeId: string,
  shareLinkId: string,
) {
  const response = await fetch(
    backendApiUrl(`/shares/resumes/${resumeId}/links/${shareLinkId}`),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    await throwApiError(response, "Failed to revoke share link");
  }
}

export async function exportResumeViaServer(
  resume: ResumeData,
  format: "pdf" | "png" | "jpg",
  renderHtml?: string | null,
) {
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const queueResponse = await fetch(
    backendApiUrl(`/exports/resumes/${resume.id}/jobs`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        format,
        snapshot: resume,
        renderHtml: renderHtml || undefined,
      }),
    },
  );

  if (!queueResponse.ok) {
    const payload = (await queueResponse.json().catch(() => ({}))) as {
      message?: string;
    };

    throw new Error(payload.message || "Could not queue server export");
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
      backendApiUrl(`/exports/jobs/${jobId}`),
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

      throw new Error(payload.message || "Could not read export status");
    }

    const statusPayload = (await statusResponse.json()) as {
      data: {
        status: "queued" | "processing" | "completed" | "failed";
        ready?: boolean;
        errorMessage?: string | null;
      };
    };

    if (statusPayload.data.status === "failed") {
      throw new Error(
        statusPayload.data.errorMessage || "Server export failed",
      );
    }

    if (statusPayload.data.status === "completed") {
      break;
    }

    await sleep(2000);
  }

  if (Date.now() >= pollTimeoutAt) {
    throw new Error("Server export is taking too long. Please retry.");
  }

  let response: Response | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(backendApiUrl(`/exports/jobs/${jobId}/download`), {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      break;
    }

    if (response.status !== 409) {
      break;
    }

    await sleep(2000);
  }

  if (!response || !response.ok) {
    const payload = (await response?.json().catch(() => ({}))) as {
      message?: string;
    };

    throw new Error(payload.message || "Server export failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${(resume.basics.fullName || "resume").trim().replace(/\s+/g, "-").toLowerCase()}.${format}`;

  anchor.click();

  URL.revokeObjectURL(url);
}
