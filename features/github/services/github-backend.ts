import { fetchApiData } from "@/utils/fetchApiData";

export type GitHubStatus = "todo" | "in-progress" | "done";
export type GitHubItemKind = "issue" | "pull-request";
export type GitHubFilterKind = GitHubItemKind | "all";
export type GitHubFilterStatus = GitHubStatus | "all";

export interface GitHubIssueItem {
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

export interface GitHubProjectStats {
  projectName: string;
  projectUrl: string;
  stats: {
    totalItems: number;
    issues: number;
    pullRequests: number;
    todo: number;
    inProgress: number;
    done: number;
    completionRate: string;
  };
  syncedAt: string;
  nextSyncAt?: string | null;
}

export interface GitHubIssuePage {
  items: GitHubIssueItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  pagination: {
    mode: "offset";
    nextOffset: number | null;
    nextCursor: string | null;
  };
  syncedAt: string | null;
}

export async function fetchGitHubStatsFromBackend(options?: RequestInit) {
  return fetchApiData<GitHubProjectStats>("/github/stats", {
    ...options,
    cache: "no-store",
  });
}

export async function fetchGitHubIssuesFromBackend(query: {
  status?: GitHubFilterStatus;
  kind?: GitHubFilterKind;
  limit?: number;
  offset?: number;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "all" && value !== null) {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString() ? `?${params.toString()}` : "";

  return fetchApiData<GitHubIssuePage>(`/github/issues${queryString}`, {
    cache: "no-store",
  });
}
