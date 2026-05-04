import { z } from "zod";

import type { MasterProfileData, ResumeData } from "@/types/resume";

import { fetchApiData } from "@/utils/fetchApiData";

import { MASTER_PROFILE_STORAGE_KEY } from "@/lib/constants";

import { defaultResume } from "@/features/resume/constants/default-resume";
import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import { masterProfileDbSchema } from "@/features/resume/schemas/master-profile-db-schema";
import { safeSetLocalStorageItem } from "@/features/resume/services/storage/safe-local-storage";

interface MasterProfileState {
  updatedAt: string;
  profile: MasterProfileData;
}

interface MasterProfileSummaryState {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  emailVerified: boolean;
  autoSyncEnabled: boolean;
  shareResumeCount: number;
}

export interface MasterProfileBundleState {
  updatedAt: string;
  profile: MasterProfileData;
  summary: MasterProfileSummaryState | null;
}

const masterProfileStateSchema = z
  .object({
    updatedAt: z.string().optional(),
    profile: z.unknown(),
  })
  .passthrough();

function isBrowser() {
  return typeof window !== "undefined";
}

function getDefaultProfile(): MasterProfileData {
  const profileData = structuredClone(defaultResume) as ResumeData;

  return {
    templateId: profileData.templateId,
    basics: profileData.basics,
    links: profileData.links,
    summary: profileData.summary,
    experience: profileData.experience,
    education: profileData.education,
    projects: profileData.projects,
    skills: profileData.skills,
    languages: [],
    interests: [],
    awards: [],
    certificates: [],
    publications: [],
    volunteer: [],
    references: [],
    achievements: [],
    customSections: profileData.customSections,
    sections: profileData.sections,
    customization: profileData.customization,
    updatedAt: profileData.updatedAt,
  };
}

function normalizeProfile(
  value: Partial<MasterProfileData> | null | undefined,
) {
  const baseProfile = getDefaultProfile();

  const nextProfile = {
    ...baseProfile,
    ...value,
    basics: {
      ...baseProfile.basics,
      ...value?.basics,
    },
    links: {
      ...baseProfile.links,
      ...value?.links,
      items: value?.links?.items ?? baseProfile.links.items,
    },
    experience: value?.experience?.length
      ? value.experience
      : baseProfile.experience,
    education: value?.education?.length
      ? value.education
      : baseProfile.education,
    projects: value?.projects?.length ? value.projects : baseProfile.projects,
    skills: value?.skills?.length ? value.skills : baseProfile.skills,
    languages: value?.languages?.length
      ? value.languages
      : baseProfile.languages,
    interests: value?.interests?.length
      ? value.interests
      : baseProfile.interests,
    awards: value?.awards?.length ? value.awards : baseProfile.awards,
    certificates: value?.certificates?.length
      ? value.certificates
      : baseProfile.certificates,
    publications: value?.publications?.length
      ? value.publications
      : baseProfile.publications,
    volunteer: value?.volunteer?.length
      ? value.volunteer
      : baseProfile.volunteer,
    references: value?.references?.length
      ? value.references
      : baseProfile.references,
    achievements: value?.achievements?.length
      ? value.achievements
      : baseProfile.achievements,
    customSections: value?.customSections?.length
      ? value.customSections
      : baseProfile.customSections,
    sections: value?.sections?.length ? value.sections : baseProfile.sections,
    customization: {
      ...baseProfile.customization,
      ...value?.customization,
    },
    updatedAt: value?.updatedAt ?? new Date().toISOString(),
  };

  return masterProfileDbSchema.parse(nextProfile);
}

function toMasterProfileData(value: unknown) {
  const parsed = masterProfileDbSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return normalizeProfile(parsed.data);
}

export function loadMasterProfileFromLocalStorage(): MasterProfileState {
  if (!isBrowser()) {
    return {
      updatedAt: defaultResume.updatedAt,
      profile: getDefaultProfile(),
    };
  }

  const rawValue = window.localStorage.getItem(MASTER_PROFILE_STORAGE_KEY);

  if (!rawValue) {
    return {
      updatedAt: defaultResume.updatedAt,
      profile: getDefaultProfile(),
    };
  }

  try {
    const parsed = masterProfileStateSchema.safeParse(JSON.parse(rawValue));

    if (!parsed.success) {
      window.localStorage.removeItem(MASTER_PROFILE_STORAGE_KEY);
      return {
        updatedAt: defaultResume.updatedAt,
        profile: getDefaultProfile(),
      };
    }

    const parsedProfile = toMasterProfileData(parsed.data.profile);

    if (!parsedProfile) {
      window.localStorage.removeItem(MASTER_PROFILE_STORAGE_KEY);
      return {
        updatedAt: defaultResume.updatedAt,
        profile: getDefaultProfile(),
      };
    }

    return {
      updatedAt: parsed.data.updatedAt ?? defaultResume.updatedAt,
      profile: normalizeProfile(parsedProfile),
    };
  } catch {
    window.localStorage.removeItem(MASTER_PROFILE_STORAGE_KEY);
    return {
      updatedAt: defaultResume.updatedAt,
      profile: getDefaultProfile(),
    };
  }
}

export function saveMasterProfileToLocalStorage(profile: MasterProfileData) {
  if (!isBrowser()) {
    return;
  }

  const payload: MasterProfileState = {
    updatedAt: new Date().toISOString(),
    profile: normalizeProfile(profile),
  };

  safeSetLocalStorageItem(
    window.localStorage,
    MASTER_PROFILE_STORAGE_KEY,
    JSON.stringify(payload),
  );
}

export function resetMasterProfileToLocalStorage() {
  saveMasterProfileToLocalStorage(getDefaultProfile());
}

export function deriveResumeFromMasterProfile(resumeId: string) {
  const { profile } = loadMasterProfileFromLocalStorage();

  return normalizeResumeData({
    ...profile,
    id: resumeId,
    updatedAt: new Date().toISOString(),
    sync: {
      ...defaultResume.sync,
      enabled: false,
      status: "local-only",
      cloudResumeId: null,
      lastSyncedAt: null,
    },
  });
}

interface MasterProfileApiRecord {
  profile: {
    id: string;
    userId: string;
    content: unknown;
    createdAt: string;
    updatedAt: string;
  };
  summary: MasterProfileSummaryState | null;
}

interface MasterProfileUpdatedRecord {
  id: string;
  userId: string;
  content: unknown;
  createdAt: string;
  updatedAt: string;
}

function parseSavedMasterProfileResponse(
  value: MasterProfileApiRecord | MasterProfileUpdatedRecord,
  fallbackProfile: MasterProfileData,
) {
  const profileRecord = "profile" in value ? value.profile : value;

  const parsedProfile = toMasterProfileData(profileRecord.content);

  return {
    updatedAt:
      profileRecord.updatedAt ??
      parsedProfile?.updatedAt ??
      fallbackProfile.updatedAt ??
      new Date().toISOString(),
    profile: parsedProfile ?? normalizeProfile(fallbackProfile),
    summary: "summary" in value ? (value.summary ?? null) : null,
  } satisfies MasterProfileBundleState;
}

export async function loadMasterProfileFromDatabase() {
  try {
    const profileRecord = await fetchApiData<MasterProfileApiRecord>(
      "/profiles/master",
      {
        method: "GET",
      },
    );

    const profile = toMasterProfileData(profileRecord.profile.content);

    if (!profile) {
      return null;
    }

    return {
      updatedAt:
        profileRecord.profile.updatedAt ??
        profile.updatedAt ??
        new Date().toISOString(),
      profile,
      summary: profileRecord.summary ?? null,
    } satisfies MasterProfileBundleState;
  } catch {
    return null;
  }
}

export async function saveMasterProfileToDatabase(
  profile: MasterProfileData,
  expectedUpdatedAt?: string,
) {
  const normalized = normalizeProfile(profile);

  const payload = await fetchApiData<
    MasterProfileApiRecord | MasterProfileUpdatedRecord
  >("/profiles/master", {
    method: "PUT",
    body: JSON.stringify({ profile: normalized, expectedUpdatedAt }),
  });

  return parseSavedMasterProfileResponse(payload, normalized);
}
