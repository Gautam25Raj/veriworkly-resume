import { config } from "#config";

import { prisma } from "#utils/prisma";
import { ApiError } from "#utils/errors";
import { cacheDel, cacheGet, cacheSet } from "#utils/redis";

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string }>;
  state: "open" | "closed";
}

/**
 * Fetch the latest GitHub statistics from cache or the database.
 * * returns: Formatted stats object or null if no sync has ever occurred.
 */

export async function getGitHubStats() {
  const cacheKey = "github:stats";
  const cached = await cacheGet(cacheKey);

  if (cached) return cached;

  const sync = await prisma.gitHubSync.findFirst({
    orderBy: { syncedAt: "desc" },
  });

  if (!sync) return null;

  const response = {
    projectName: sync.projectName,
    projectUrl: sync.projectUrl,
    stats: {
      totalIssues: sync.issueCount,
      todo: sync.todoCount,
      inProgress: sync.inProgressCount,
      done: sync.doneCount,
    },
    data: sync.data,
    syncedAt: sync.syncedAt,
  };

  await cacheSet(cacheKey, response, config.cache.githubStatsTtlSeconds);
  return response;
}

/**
 * Persist synced GitHub data to the database and invalidate the cache.
 * * data: The processed sync information and metadata.
 */

export async function syncGitHubData(data: {
  projectName: string;
  projectUrl: string;
  issueCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  data: unknown;
  etag?: string;
  lastSyncStatus?: string;
  lastError?: string;
  nextSyncAt?: Date;
}) {
  const payload = {
    ...data,
    data: data.data as object,
    syncedAt: new Date(),
  };

  const sync = await prisma.gitHubSync.upsert({
    where: { projectUrl: data.projectUrl },
    create: payload,
    update: payload,
  });

  await cacheDel("github:stats");
  return sync;
}

/**
 * Determine if a new sync is required based on the last sync timestamp.
 * * returns: Boolean indicating if 12 hours have passed since the last sync.
 */

export async function shouldSyncGitHubStats() {
  const latest = await prisma.gitHubSync.findFirst({
    select: { syncedAt: true },
    orderBy: { syncedAt: "desc" },
  });

  if (!latest) return true;

  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  return Date.now() - new Date(latest.syncedAt).getTime() >= TWELVE_HOURS_MS;
}

/**
 * Internal helper to classify GitHub issues based on state and labels.
 */

function classifyIssue(issue: GitHubIssue): "todo" | "in-progress" | "done" {
  if (issue.state === "closed") return "done";

  const labels = issue.labels;

  if (labels.some((l) => l.name.toLowerCase() === "done")) return "done";

  if (
    labels.some((l) => {
      const n = l.name.toLowerCase();
      return n === "in-progress" || n === "in progress";
    })
  )
    return "in-progress";

  return "todo";
}

/**
 * Processes raw GitHub issues into categorized snapshots for the frontend.
 */

function buildGitHubIssuesSnapshot(issues: GitHubIssue[]) {
  const todoIssues: any[] = [];
  const inProgressIssues: any[] = [];
  const doneIssues: any[] = [];

  for (const issue of issues) {
    const status = classifyIssue(issue);

    const snapshot = {
      id: `gh-${issue.id}`,
      title: issue.title,
      status,
      url: issue.html_url,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      labels: issue.labels.map((l) => l.name),
    };

    if (status === "todo") todoIssues.push(snapshot);
    else if (status === "in-progress") inProgressIssues.push(snapshot);
    else doneIssues.push(snapshot);
  }

  return { todoIssues, inProgressIssues, doneIssues };
}

/**
 * Orchestrates the full GitHub synchronization process.
 * Includes ETag handling to minimize bandwidth and API rate limit usage.
 */

export async function syncGitHubStatsFromGitHub() {
  const { owner, repo, token, projectUrl } = config.github;

  if (!owner || !repo || !token || !projectUrl) {
    throw new ApiError(500, "GitHub sync is not fully configured");
  }

  const latest = await prisma.gitHubSync.findUnique({
    where: { projectUrl },
  });

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (latest?.etag) headers["If-None-Match"] = latest.etag;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`,
    { headers },
  );

  // Handle Cache Hit (304)
  if (response.status === 304 && latest) {
    return await syncGitHubData({
      ...latest,
      etag: latest.etag ?? undefined,
      lastSyncStatus: "not-modified",
      lastError: latest.lastError ?? undefined,
      nextSyncAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    });
  }

  if (!response.ok) {
    const errorBody = (await response.text()).slice(0, 500);

    await syncGitHubData({
      projectName: latest?.projectName || `${owner}/${repo}`,
      projectUrl,
      issueCount: latest?.issueCount || 0,
      todoCount: latest?.todoCount || 0,
      inProgressCount: latest?.inProgressCount || 0,
      doneCount: latest?.doneCount || 0,
      data: latest?.data || {},
      lastSyncStatus: "failed",
      lastError: errorBody,
      nextSyncAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    throw new ApiError(502, "GitHub sync failed", { status: response.status, body: errorBody });
  }

  const payload = (await response.json()) as GitHubIssue[];

  const issues = payload.filter((item) => !item.title.startsWith("[Bot]"));
  const snapshot = buildGitHubIssuesSnapshot(issues);

  return await syncGitHubData({
    projectName: `${owner}/${repo}`,
    projectUrl,
    issueCount: issues.length,
    todoCount: snapshot.todoIssues.length,
    inProgressCount: snapshot.inProgressIssues.length,
    doneCount: snapshot.doneIssues.length,
    data: { owner, repo, syncedAt: new Date().toISOString(), ...snapshot },
    etag: response.headers.get("etag") ?? undefined,
    lastSyncStatus: "success",
    nextSyncAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  });
}
