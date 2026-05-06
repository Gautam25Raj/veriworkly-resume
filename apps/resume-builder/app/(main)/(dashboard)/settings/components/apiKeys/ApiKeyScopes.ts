export const AVAILABLE_API_KEY_SCOPES = [
  "user:read",
  "user:write",
  "resume:read",
  "resume:write",
  "roadmap:read",
  "roadmap:write",
  "github:read",
  "github:write",
] as const;

export const API_KEY_SCOPE_OPTIONS = [
  {
    value: "user:read",
    label: "Profile access",
    description: "Read your account profile and identity details.",
  },
  {
    value: "user:write",
    label: "Profile updates",
    description: "Update user-facing profile fields.",
  },
  {
    value: "resume:read",
    label: "Resume read",
    description: "View resume content and metadata.",
  },
  {
    value: "resume:write",
    label: "Resume write",
    description: "Create, edit, and publish resume data.",
  },
  {
    value: "roadmap:read",
    label: "Roadmap read",
    description: "Inspect roadmap items and release planning data.",
  },
  {
    value: "roadmap:write",
    label: "Roadmap write",
    description: "Update roadmap items and progress states.",
  },
  {
    value: "github:read",
    label: "GitHub read",
    description: "Read synced GitHub issue and stats data.",
  },
  {
    value: "github:write",
    label: "GitHub write",
    description: "Trigger GitHub sync and write GitHub-backed data.",
  },
] as const;

const SCOPE_GROUPS = [
  { key: "user", label: "Profile" },
  { key: "resume", label: "Resume" },
  { key: "roadmap", label: "Roadmap" },
  { key: "github", label: "GitHub" },
] as const;

export type ApiKeyScopeSummary = {
  label: string;
  access: string;
};

export function summarizeApiKeyScopes(scopes: string[]): ApiKeyScopeSummary[] {
  const selected = new Set(scopes);

  return SCOPE_GROUPS.flatMap((group) => {
    const readScope = `${group.key}:read`;
    const writeScope = `${group.key}:write`;

    const hasRead = selected.has(readScope);
    const hasWrite = selected.has(writeScope);

    if (!hasRead && !hasWrite) {
      return [];
    }

    return {
      label: group.label,
      access: hasRead && hasWrite ? "Read / Write" : hasWrite ? "Write" : "Read",
    };
  });
}
