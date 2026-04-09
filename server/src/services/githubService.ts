import { config } from "#config";

import { prisma } from "#utils/prisma";
import { ApiError } from "#utils/errors";
import { cacheDel, cacheGet, cacheSet } from "#utils/redis";

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

const PROJECT_URL = config.github.projectUrl;
const REDIS_STATS_KEY = `github:stats:${PROJECT_URL}`;

export async function getGitHubStats() {
  const cached = await cacheGet(REDIS_STATS_KEY);
  if (cached) return cached;

  const latest = await prisma.gitHubSync.findUnique({
    where: { projectUrl: PROJECT_URL },
  });

  if (!latest) return null;

  const response = {
    projectName: latest.projectName,
    stats: {
      total: latest.issueCount,
      todo: latest.todoCount,
      inProgress: latest.inProgressCount,
      done: latest.doneCount,
      completionRate:
        latest.issueCount === 0
          ? "0.00"
          : ((latest.doneCount / latest.issueCount) * 100).toFixed(2),
    },
    syncedAt: latest.syncedAt,
  };

  await cacheSet(REDIS_STATS_KEY, response, 43200);
  return response;
}

function classifyIssue(issue: GitHubIssuePayload): GitHubStatus {
  if (issue.state === "closed") return "done";

  const labels = issue.labels.map((label) => label.name.toLowerCase());
  if (labels.includes("done")) return "done";
  if (labels.some((l) => l === "in-progress" || l === "in progress" || l === "active")) {
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

  return {
    issues: snapshots,
    todoIssues: snapshots.filter((item) => item.status === "todo"),
    inProgressIssues: snapshots.filter((item) => item.status === "in-progress"),
    doneIssues: snapshots.filter((item) => item.status === "done"),
  };
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
      throw new ApiError(502, "GitHub API communication failed", {
        status: response.status,
        body: errorBody,
      });
    }

    const payload = (await response.json()) as GitHubIssuePayload[];
    if (payload.length === 0) break;

    collected.push(...payload.filter((item) => !item.title.startsWith("[Bot]")));
    if (payload.length < perPage) break;
    page += 1;
  }

  return collected;
}

export async function getGitHubIssues(query: any) {
  const queryKey = `github:issues:${PROJECT_URL}:${Buffer.from(JSON.stringify(query)).toString("base64")}`;
  const cached = await cacheGet(queryKey);
  if (cached) return cached;

  const where: any = {
    sync: { projectUrl: PROJECT_URL },
  };

  if (query.status) where.status = query.status;
  if (query.kind && query.kind !== "all") where.kind = query.kind;

  const [total, items] = await Promise.all([
    prisma.gitHubSyncItem.count({ where }),
    prisma.gitHubSyncItem.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: query.offset || 0,
      take: query.limit || 20,
    }),
  ]);

  const result = { items, total, limit: query.limit, offset: query.offset };
  await cacheSet(queryKey, result, 300);

  return result;
}

export async function shouldSyncGitHubStats() {
  const latest = await prisma.gitHubSync.findUnique({
    where: { projectUrl: PROJECT_URL },
    select: { syncedAt: true },
  });

  if (!latest) return true;

  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
  return Date.now() - new Date(latest.syncedAt).getTime() >= TWELVE_HOURS_MS;
}

export async function syncGitHubStatsFromGitHub() {
  const { owner, repo, token } = config.github;

  const rawIssues = await fetchAllGitHubIssues(owner, repo, token);
  const snapshot = buildGitHubIssuesSnapshot(rawIssues);

  const syncRecord = await prisma.$transaction(
    async (tx) => {
      const sync = await tx.gitHubSync.upsert({
        where: { projectUrl: PROJECT_URL },

        create: {
          projectName: `${owner}/${repo}`,
          projectUrl: PROJECT_URL,
          issueCount: rawIssues.length,
          todoCount: snapshot.todoIssues.length,
          inProgressCount: snapshot.inProgressIssues.length,
          doneCount: snapshot.doneIssues.length,
          data: { lastSyncedBy: "System" },
          nextSyncAt: new Date(Date.now() + 43200000),
        },

        update: {
          issueCount: rawIssues.length,
          todoCount: snapshot.todoIssues.length,
          inProgressCount: snapshot.inProgressIssues.length,
          doneCount: snapshot.doneIssues.length,
          syncedAt: new Date(),
        },
      });

      for (const item of snapshot.issues) {
        const githubId = item.id.replace("gh-", "");

        await tx.gitHubSyncItem.upsert({
          where: {
            syncId_githubId: {
              syncId: sync.id,
              githubId,
            },
          },
          create: {
            syncId: sync.id,
            githubId,
            number: item.number,
            title: item.title,
            status: item.status,
            kind: item.kind,
            url: item.url,
            labels: item.labels,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          },
          update: {
            title: item.title,
            status: item.status,
            labels: item.labels,
            updatedAt: new Date(item.updatedAt),
          },
        });
      }

      return sync;
    },
    {
      timeout: 30000,
    },
  );

  await cacheDel(REDIS_STATS_KEY);
  return syncRecord;
}
