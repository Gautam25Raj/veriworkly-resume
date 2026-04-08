import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { MASTER_PROFILE_STORAGE_KEY } from "@/lib/constants";

import {
  parseResumeDataInput,
  parseResumeDataForExport,
} from "@/features/resume/schemas/resume-storage-schema";
import { defaultResume } from "@/features/resume/constants/default-resume";
import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import { safeSetLocalStorageItem } from "@/features/resume/services/storage/safe-local-storage";

export type MasterProfileData = Omit<ResumeData, "id" | "sync" | "updatedAt">;

interface MasterProfileState {
  updatedAt: string;
  profile: MasterProfileData;
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
    customSections: profileData.customSections,
    sections: profileData.sections,
    customization: profileData.customization,
  };
}

function normalizeProfile(
  value: Partial<MasterProfileData> | null | undefined,
) {
  const baseProfile = getDefaultProfile();

  return normalizeResumeData({
    ...baseProfile,
    ...value,
    sync: defaultResume.sync,
    id: defaultResume.id,
    updatedAt: new Date().toISOString(),
  } as ResumeData);
}

function toMasterProfileData(value: unknown) {
  const parsedResume = parseResumeDataInput(value);

  if (!parsedResume) {
    return null;
  }

  const parsed = parseResumeDataForExport(parsedResume);

  return {
    templateId: parsed.templateId,
    basics: parsed.basics,
    links: parsed.links,
    summary: parsed.summary,
    experience: parsed.experience,
    education: parsed.education,
    projects: parsed.projects,
    skills: parsed.skills,
    customSections: parsed.customSections,
    sections: parsed.sections,
    customization: parsed.customization,
  };
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
