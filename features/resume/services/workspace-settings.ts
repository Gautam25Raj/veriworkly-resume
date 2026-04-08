import { WORKSPACE_SETTINGS_STORAGE_KEY } from "@/lib/constants";

import { z } from "zod";

import { safeSetLocalStorageItem } from "@/features/resume/services/storage/safe-local-storage";

function isBrowser() {
  return typeof window !== "undefined";
}

export interface WorkspaceSettings {
  autoSyncEnabled: boolean;
}

const defaultWorkspaceSettings: WorkspaceSettings = {
  autoSyncEnabled: false,
};

const workspaceSettingsSchema = z
  .object({
    autoSyncEnabled: z.boolean().optional(),
  })
  .passthrough();

export function loadWorkspaceSettingsFromLocalStorage() {
  if (!isBrowser()) {
    return defaultWorkspaceSettings;
  }

  const rawValue = window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY);

  if (!rawValue) {
    return defaultWorkspaceSettings;
  }

  try {
    const parsed = workspaceSettingsSchema.safeParse(JSON.parse(rawValue));

    if (!parsed.success) {
      window.localStorage.removeItem(WORKSPACE_SETTINGS_STORAGE_KEY);
      return defaultWorkspaceSettings;
    }

    return {
      autoSyncEnabled: Boolean(parsed.data.autoSyncEnabled),
    };
  } catch {
    window.localStorage.removeItem(WORKSPACE_SETTINGS_STORAGE_KEY);
    return defaultWorkspaceSettings;
  }
}

export function saveWorkspaceSettingsToLocalStorage(
  settings: WorkspaceSettings,
) {
  if (!isBrowser()) {
    return;
  }

  const validatedSettings = workspaceSettingsSchema.parse(settings);

  safeSetLocalStorageItem(
    window.localStorage,
    WORKSPACE_SETTINGS_STORAGE_KEY,
    JSON.stringify(validatedSettings),
  );
}

export function setAutoSyncEnabledInLocalStorage(autoSyncEnabled: boolean) {
  saveWorkspaceSettingsToLocalStorage({ autoSyncEnabled });
}
