import type { MasterProfile } from "@/types/resume";

import { masterProfileDbSchema } from "@/features/resume/schemas/master-profile-db-schema";

export function stringifyProfile(profile: MasterProfile) {
  return JSON.stringify(profile, null, 2);
}

export function parseMasterProfileJson(value: string) {
  const parsed = JSON.parse(value);
  const validated = masterProfileDbSchema.safeParse(parsed);

  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    throw new Error(firstIssue?.message ?? "Profile JSON does not match expected schema.");
  }

  return validated.data as MasterProfile;
}

export function buildProfileExportName() {
  return `master-profile-${new Date().toISOString().split("T")[0]}.json`;
}
