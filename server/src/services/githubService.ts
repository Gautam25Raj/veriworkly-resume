import { config } from "#config";

import { prisma } from "#utils/prisma";
import { ApiError } from "#utils/errors";
import { cacheGet, cacheSet } from "#utils/redis";

export type GitHubStatus = "todo" | "in-progress" | "done";
export type GitHubItemKind = "issue" | "pull-request";

interface GitHubIssuePayload {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{ name: string }>;
  state: "open" | "closed";
  pull_request?: unknown;
}

export interface GitHubItemSnapshot {
  id: string;
  number: number;
  title: string;
  status: GitHubStatus;
  kind: GitHubItemKind;
  url: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}

export interface GitHubSyncSnapshot {
  owner: string;
  repo: string;
  syncedAt: string;
  issues: GitHubItemSnapshot[];
}

export interface GitHubQuery {
  status?: GitHubStatus;
  kind?: GitHubItemKind | "all";
  limit?: number;
  offset?: number;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
}

async function getLatestGitHubSync() {
  return prisma.gitHubSync.findFirst({
    orderBy: { syncedAt: "desc" },
  });
}

function isMissingSyncItemsTableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const withCode = error as { code?: string };

  return withCode.code === "P2021" && error.message.includes("GitHubSyncItem");
}

function isSyncItemWriteConversionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("GitHubSyncItem") &&
    error.message.includes("Unable to fit integer value")
  );
}

function getSnapshotItems(data: unknown): GitHubItemSnapshot[] {
  const snapshot = data as Partial<GitHubSyncSnapshot>;
  return snapshot.issues ?? [];
}

function filterSnapshotItems(items: GitHubItemSnapshot[], query: GitHubQuery) {
  return items.filter((item) => {
    if (query.status && item.status !== query.status) {
      return false;
    }

    if (query.kind && query.kind !== "all" && item.kind !== query.kind) {
      return false;
    }

    if (query.createdFrom || query.createdTo) {
      const createdAt = new Date(item.createdAt).getTime();

      if (query.createdFrom && createdAt < query.createdFrom.getTime()) {
        return false;
      }

      if (query.createdTo && createdAt > query.createdTo.getTime()) {
        return false;
      }
    }

    if (query.updatedFrom || query.updatedTo) {
      const updatedAt = new Date(item.updatedAt).getTime();

      if (query.updatedFrom && updatedAt < query.updatedFrom.getTime()) {
        return false;
      }

      if (query.updatedTo && updatedAt > query.updatedTo.getTime()) {
        return false;
      }
    }

    return true;
  });
}

async function ensureSyncItemsBackfilled(latest: { id: string; data: unknown }) {
  const gitHubSyncItemModel = (
    prisma as unknown as {
      gitHubSyncItem: {
        count: (args: unknown) => Promise<number>;
        createMany: (args: unknown) => Promise<unknown>;
      };
    }
  ).gitHubSyncItem;

  let currentCount = 0;

  try {
    currentCount = await gitHubSyncItemModel.count({
      where: {
        syncId: latest.id,
      },
    });
  } catch (error) {
    if (isMissingSyncItemsTableError(error)) {
      return;
    }

    throw error;
  }

  if (currentCount > 0) {
    return;
  }

  const items = getSnapshotItems(latest.data);

  if (items.length === 0) {
    return;
  }

  try {
    await gitHubSyncItemModel.createMany({
      data: toSyncItems(latest.id, items),
      skipDuplicates: true,
    });
  } catch (error) {
    if (isMissingSyncItemsTableError(error)) {
      return;
    }

    throw error;
  }
}

export async function getGitHubStats() {
  const latest = await getLatestGitHubSync();

  if (!latest) {
    return null;
  }

  await ensureSyncItemsBackfilled(latest);

  const cacheKey = `github:stats:${latest.id}:${latest.syncedAt.getTime()}`;
  const cached = await cacheGet(cacheKey);

  if (cached) {
    return cached;
  }

  const gitHubSyncItemModel = (
    prisma as unknown as {
      gitHubSyncItem: {
        count: (args: unknown) => Promise<number>;
      };
    }
  ).gitHubSyncItem;

  let issueCount = 0;
  let pullRequestCount = 0;

  try {
    [issueCount, pullRequestCount] = await Promise.all([
      gitHubSyncItemModel.count({
        where: {
          syncId: latest.id,
          kind: "issue",
        },
      }),
      gitHubSyncItemModel.count({
        where: {
          syncId: latest.id,
          kind: "pull-request",
        },
      }),
    ]);
  } catch (error) {
    if (!isMissingSyncItemsTableError(error)) {
      throw error;
    }

    const items = getSnapshotItems(latest.data);
    issueCount = items.filter((item) => item.kind === "issue").length;
    pullRequestCount = items.filter((item) => item.kind === "pull-request").length;
  }

  const response = {
    projectName: latest.projectName,
    projectUrl: latest.projectUrl,
    stats: {
      totalItems: latest.issueCount,
      totalIssues: latest.issueCount,
      issues: issueCount,
      pullRequests: pullRequestCount,
      todo: latest.todoCount,
      inProgress: latest.inProgressCount,
      done: latest.doneCount,
      completionRate:
        latest.issueCount === 0
          ? "0.00"
          : ((latest.doneCount / latest.issueCount) * 100).toFixed(2),
    },
    syncedAt: latest.syncedAt,
    nextSyncAt: latest.nextSyncAt,
  };

  await cacheSet(cacheKey, response, config.cache.githubStatsTtlSeconds);
  return response;
}

function classifyIssue(issue: GitHubIssuePayload): GitHubStatus {
  if (issue.state === "closed") {
    return "done";
  }

  const labels = issue.labels.map((label) => label.name.toLowerCase());

  if (labels.includes("done")) {
    return "done";
  }

  if (labels.some((label) => label === "in-progress" || label === "in progress")) {
    return "in-progress";
  }

  return "todo";
}

function buildGitHubIssuesSnapshot(issues: GitHubIssuePayload[]) {
  const snapshots = issues.map<GitHubItemSnapshot>((issue) => ({
    id: `gh-${issue.id}`,
    number: issue.number,
    title: issue.title,
    status: classifyIssue(issue),
    kind: issue.pull_request ? "pull-request" : "issue",
    url: issue.html_url,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    labels: issue.labels.map((label) => label.name),
  }));

  const todoIssues = snapshots.filter((item) => item.status === "todo");
  const inProgressIssues = snapshots.filter((item) => item.status === "in-progress");
  const doneIssues = snapshots.filter((item) => item.status === "done");

  return {
    issues: snapshots,
    todoIssues,
    inProgressIssues,
    doneIssues,
  };
}

function toSyncItems(syncId: string, items: GitHubItemSnapshot[]) {
  return items.map((item) => ({
    syncId,
    githubId: item.id.replace("gh-", ""),
    number: item.number,
    title: item.title,
    status: item.status,
    kind: item.kind,
    url: item.url,
    labels: item.labels,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

async function fetchAllGitHubIssues(owner: string, repo: string, token: string) {
  const collected: GitHubIssuePayload[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 500);
      throw new ApiError(502, "GitHub sync failed", {
        status: response.status,
        body: errorBody,
      });
    }

    const payload = (await response.json()) as GitHubIssuePayload[];
    collected.push(...payload.filter((item) => !item.title.startsWith("[Bot]")));

    if (payload.length < perPage) {
      break;
    }

    page += 1;
  }

  return collected;
}

async function syncGitHubData(data: {
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

  try {
    return await prisma.$transaction(async (tx) => {
      const gitHubSyncItemModel = (
        tx as unknown as {
          gitHubSyncItem: {
            deleteMany: (args: unknown) => Promise<unknown>;
            createMany: (args: unknown) => Promise<unknown>;
          };
        }
      ).gitHubSyncItem;

      const sync = await tx.gitHubSync.upsert({
        where: { projectUrl: data.projectUrl },
        create: payload,
        update: payload,
      });

      const items = getSnapshotItems(data.data);

      await gitHubSyncItemModel.deleteMany({
        where: { syncId: sync.id },
      });

      if (items.length > 0) {
        await gitHubSyncItemModel.createMany({
          data: toSyncItems(sync.id, items),
        });
      }

      return sync;
    });
  } catch (error) {
    if (!isMissingSyncItemsTableError(error) && !isSyncItemWriteConversionError(error)) {
      throw error;
    }

    return prisma.gitHubSync.upsert({
      where: { projectUrl: data.projectUrl },
      create: payload,
      update: payload,
    });
  }
}

export async function getGitHubIssues(query: GitHubQuery = {}) {
  const latest = await getLatestGitHubSync();

  if (!latest) {
    return {
      items: [],
      total: 0,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
      hasMore: false,
      pagination: {
        mode: "offset" as const,
        nextOffset: null,
        nextCursor: null,
      },
      syncedAt: null,
    };
  }

  await ensureSyncItemsBackfilled(latest);

  const limit = Math.max(1, Math.min(query.limit ?? 20, 100));
  const offset = Math.max(0, query.offset ?? 0);
  const cacheKey = [
    "github:issues",
    latest.id,
    latest.syncedAt.getTime(),
    query.status || "all",
    query.kind || "all",
    query.createdFrom?.toISOString() || "none",
    query.createdTo?.toISOString() || "none",
    query.updatedFrom?.toISOString() || "none",
    query.updatedTo?.toISOString() || "none",
    limit,
    offset,
  ].join(":");

  const cached = await cacheGet(cacheKey);

  if (cached) {
    return cached;
  }

  const where: {
    syncId: string;
    status?: GitHubStatus;
    kind?: GitHubItemKind;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
    updatedAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    syncId: latest.id,
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.kind && query.kind !== "all") {
    where.kind = query.kind;
  }

  if (query.createdFrom || query.createdTo) {
    where.createdAt = {
      gte: query.createdFrom,
      lte: query.createdTo,
    };
  }

  if (query.updatedFrom || query.updatedTo) {
    where.updatedAt = {
      gte: query.updatedFrom,
      lte: query.updatedTo,
    };
  }

  const gitHubSyncItemModel = (
    prisma as unknown as {
      gitHubSyncItem: {
        count: (args: unknown) => Promise<number>;
        findMany: (args: unknown) => Promise<
          Array<{
            githubId: string;
            number: number;
            title: string;
            status: string;
            kind: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            labels: string[];
          }>
        >;
      };
    }
  ).gitHubSyncItem;

  let total = 0;
  let pageItems: GitHubItemSnapshot[] = [];

  try {
    const [count, rawItems] = await Promise.all([
      gitHubSyncItemModel.count({ where }),
      gitHubSyncItemModel.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          githubId: true,
          number: true,
          title: true,
          status: true,
          kind: true,
          url: true,
          createdAt: true,
          updatedAt: true,
          labels: true,
        },
      }),
    ]);

    total = count;
    pageItems = rawItems.map<GitHubItemSnapshot>((item) => ({
      id: `gh-${item.githubId}`,
      number: item.number,
      title: item.title,
      status: item.status as GitHubStatus,
      kind: item.kind as GitHubItemKind,
      url: item.url,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      labels: item.labels,
    }));
  } catch (error) {
    if (!isMissingSyncItemsTableError(error)) {
      throw error;
    }

    const snapshotItems = filterSnapshotItems(getSnapshotItems(latest.data), query).sort(
      (left, right) => right.updatedAt.localeCompare(left.updatedAt),
    );

    total = snapshotItems.length;
    pageItems = snapshotItems.slice(offset, offset + limit);
  }

  const hasMore = offset + limit < total;

  const response = {
    items: pageItems,
    total,
    limit,
    offset,
    hasMore,
    pagination: {
      mode: "offset" as const,
      nextOffset: hasMore ? offset + limit : null,
      nextCursor: null as string | null,
    },
    syncedAt: latest.syncedAt,
  };

  await cacheSet(cacheKey, response, config.cache.githubStatsTtlSeconds);
  return response;
}

export async function shouldSyncGitHubStats() {
  const latest = await getLatestGitHubSync();

  if (!latest) {
    return true;
  }

  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  return Date.now() - new Date(latest.syncedAt).getTime() >= TWELVE_HOURS_MS;
}

export async function syncGitHubStatsFromGitHub() {
  const { owner, repo, token, projectUrl } = config.github;

  if (!owner || !repo || !token || !projectUrl) {
    throw new ApiError(500, "GitHub sync is not fully configured");
  }

  const latest = await prisma.gitHubSync.findUnique({
    where: { projectUrl },
  });

  const issues = await fetchAllGitHubIssues(owner, repo, token);
  const snapshot = buildGitHubIssuesSnapshot(issues);

  return syncGitHubData({
    projectName: `${owner}/${repo}`,
    projectUrl,
    issueCount: issues.length,
    todoCount: snapshot.todoIssues.length,
    inProgressCount: snapshot.inProgressIssues.length,
    doneCount: snapshot.doneIssues.length,
    data: {
      owner,
      repo,
      syncedAt: new Date().toISOString(),
      ...snapshot,
    },
    etag: latest?.etag ?? undefined,
    lastSyncStatus: "success",
    nextSyncAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  });
}
