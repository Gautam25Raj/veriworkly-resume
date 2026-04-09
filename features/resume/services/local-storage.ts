import type { ResumeData } from "@/types/resume";

import {
  RESUME_STORAGE_KEY,
  RESUME_ACTIVE_ID_STORAGE_KEY,
  RESUME_COLLECTION_STORAGE_KEY,
} from "@/lib/constants";

import {
  parseResumeDataInput,
  parseResumeCollectionInput,
  type ResumeCollection,
} from "@/features/resume/schemas/resume-storage-schema";
import {
  safeSetLocalStorageItem,
  type LocalStorageWriteResult,
} from "@/features/resume/services/storage/safe-local-storage";

export interface SaveResumeOptions {
  debounceMs?: number;
  flush?: boolean;
}

export type SaveResumeResult =
  | { ok: true; queued: boolean }
  | { ok: false; reason: "quota-exceeded" | "unknown" };

export const RESUME_STORAGE_UPDATED_EVENT = "veriworkly:resume-storage-updated";

let pendingResume: ResumeData | null = null;
let pendingSaveTimer: number | null = null;

function toComparableResumePayload(resume: ResumeData | null | undefined) {
  if (!resume) {
    return null;
  }

  const { updatedAt, sync, ...payload } = resume;
  void updatedAt;
  void sync;

  return payload;
}

function hasResumePayloadChanged(
  previousResume: ResumeData | null | undefined,
  nextResume: ResumeData,
) {
  const previousPayload = toComparableResumePayload(previousResume);
  const nextPayload = toComparableResumePayload(nextResume);

  return JSON.stringify(previousPayload) !== JSON.stringify(nextPayload);
}

function isBrowser() {
  return typeof window !== "undefined";
}

function emitResumeStorageUpdatedEvent() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(RESUME_STORAGE_UPDATED_EVENT));
}

function toCollection(items: Record<string, ResumeData>): ResumeCollection {
  return parseResumeCollectionInput({
    version: 1,
    items,
  });
}

function clearPendingSaveTimer() {
  if (pendingSaveTimer === null || !isBrowser()) {
    return;
  }

  window.clearTimeout(pendingSaveTimer);
  pendingSaveTimer = null;
}

function writeCollection(
  collection: ResumeCollection,
): LocalStorageWriteResult {
  if (!isBrowser()) return { ok: true };

  const payload = JSON.stringify(collection);

  const firstAttempt = safeSetLocalStorageItem(
    window.localStorage,
    RESUME_COLLECTION_STORAGE_KEY,
    payload,
  );

  if (firstAttempt.ok || firstAttempt.reason !== "quota-exceeded") {
    return firstAttempt;
  }

  window.localStorage.removeItem(RESUME_STORAGE_KEY);

  return safeSetLocalStorageItem(
    window.localStorage,
    RESUME_COLLECTION_STORAGE_KEY,
    payload,
  );
}

function persistResume(resume: ResumeData): SaveResumeResult {
  if (!isBrowser()) return { ok: true, queued: false };

  const normalizedResume = parseResumeDataInput(resume);

  if (!normalizedResume) {
    return { ok: false, reason: "unknown" };
  }

  const collection = loadResumeCollectionFromLocalStorage();

  const existingResume = collection.items[normalizedResume.id];
  const shouldMarkPending =
    normalizedResume.sync.enabled &&
    hasResumePayloadChanged(existingResume, normalizedResume);

  const resumeToPersist: ResumeData = shouldMarkPending
    ? {
        ...normalizedResume,
        sync: {
          ...normalizedResume.sync,
          status: "pending",
          lastSyncedAt:
            existingResume?.sync.lastSyncedAt ??
            normalizedResume.sync.lastSyncedAt,
        },
      }
    : normalizedResume;

  collection.items[resumeToPersist.id] = resumeToPersist;

  const collectionSaveResult = saveResumeCollectionToLocalStorage(collection);

  if (!collectionSaveResult.ok)
    return {
      ok: false,
      reason: collectionSaveResult.reason,
    };

  setActiveResumeIdInLocalStorage(resumeToPersist.id);

  const legacyWriteResult = safeSetLocalStorageItem(
    window.localStorage,
    RESUME_STORAGE_KEY,
    JSON.stringify(resumeToPersist),
  );

  if (!legacyWriteResult.ok && legacyWriteResult.reason === "quota-exceeded") {
    window.localStorage.removeItem(RESUME_STORAGE_KEY);
  }

  return { ok: true, queued: false };
}

export function getActiveResumeIdFromLocalStorage() {
  if (!isBrowser()) return null;

  return window.localStorage.getItem(RESUME_ACTIVE_ID_STORAGE_KEY);
}

export function setActiveResumeIdInLocalStorage(resumeId: string) {
  if (!isBrowser()) return;

  safeSetLocalStorageItem(
    window.localStorage,
    RESUME_ACTIVE_ID_STORAGE_KEY,
    resumeId,
  );
}

export function loadResumeCollectionFromLocalStorage() {
  if (!isBrowser()) {
    return toCollection({});
  }

  const rawCollection = window.localStorage.getItem(
    RESUME_COLLECTION_STORAGE_KEY,
  );

  if (!rawCollection) {
    const legacy = loadLegacyResumeFromLocalStorage();

    if (!legacy) {
      return toCollection({});
    }

    const migratedCollection = toCollection({
      [legacy.id]: legacy,
    });

    saveResumeCollectionToLocalStorage(migratedCollection);
    setActiveResumeIdInLocalStorage(legacy.id);

    return migratedCollection;
  }

  try {
    return parseResumeCollectionInput(JSON.parse(rawCollection));
  } catch {
    window.localStorage.removeItem(RESUME_COLLECTION_STORAGE_KEY);
    return toCollection({});
  }
}

export function saveResumeCollectionToLocalStorage(
  collection: ResumeCollection,
) {
  if (!isBrowser()) {
    return { ok: true } as const;
  }

  const normalizedCollection = parseResumeCollectionInput(collection);
  const writeResult = writeCollection(normalizedCollection);

  if (writeResult.ok) {
    emitResumeStorageUpdatedEvent();
  }

  return writeResult;
}

function loadLegacyResumeFromLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(RESUME_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return parseResumeDataInput(JSON.parse(rawValue));
  } catch {
    window.localStorage.removeItem(RESUME_STORAGE_KEY);
    return null;
  }
}

export function flushPendingResumeSaveToLocalStorage() {
  clearPendingSaveTimer();

  if (!pendingResume) {
    return { ok: true, queued: false } as const;
  }

  const resumeToSave = pendingResume;
  pendingResume = null;

  return persistResume(resumeToSave);
}

export function saveResumeToLocalStorage(
  resume: ResumeData,
  options?: SaveResumeOptions,
): SaveResumeResult {
  if (!isBrowser()) {
    return { ok: true, queued: false };
  }

  const normalizedResume = parseResumeDataInput(resume);

  if (!normalizedResume) {
    return { ok: false, reason: "unknown" };
  }

  if (options?.flush) {
    pendingResume = null;
    return persistResume(normalizedResume);
  }

  const debounceMs = Math.max(0, options?.debounceMs ?? 0);

  if (debounceMs > 0) {
    pendingResume = normalizedResume;
    clearPendingSaveTimer();
    pendingSaveTimer = window.setTimeout(() => {
      flushPendingResumeSaveToLocalStorage();
    }, debounceMs);

    return {
      ok: true,
      queued: true,
    };
  }

  return persistResume(normalizedResume);
}

export function loadResumeFromLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  const collection = loadResumeCollectionFromLocalStorage();
  const activeId = getActiveResumeIdFromLocalStorage();

  if (activeId && collection.items[activeId]) {
    return collection.items[activeId];
  }

  const firstResume = Object.values(collection.items)[0] ?? null;

  if (firstResume) {
    setActiveResumeIdInLocalStorage(firstResume.id);
  }

  return firstResume;
}

export function loadResumeByIdFromLocalStorage(resumeId: string) {
  const collection = loadResumeCollectionFromLocalStorage();
  return collection.items[resumeId] ?? null;
}

export function listResumesFromLocalStorage() {
  const collection = loadResumeCollectionFromLocalStorage();

  return Object.values(collection.items).sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function deleteResumeFromLocalStorage(resumeId: string) {
  if (!isBrowser()) {
    return null;
  }

  const collection = loadResumeCollectionFromLocalStorage();

  if (!collection.items[resumeId]) {
    return getActiveResumeIdFromLocalStorage();
  }

  delete collection.items[resumeId];
  const saveResult = saveResumeCollectionToLocalStorage(collection);

  if (!saveResult.ok) {
    return getActiveResumeIdFromLocalStorage();
  }

  emitResumeStorageUpdatedEvent();

  const remainingIds = Object.keys(collection.items);
  const nextId = remainingIds[0] ?? null;

  if (nextId) {
    setActiveResumeIdInLocalStorage(nextId);
    safeSetLocalStorageItem(
      window.localStorage,
      RESUME_STORAGE_KEY,
      JSON.stringify(collection.items[nextId]),
    );
  } else {
    window.localStorage.removeItem(RESUME_ACTIVE_ID_STORAGE_KEY);
    window.localStorage.removeItem(RESUME_STORAGE_KEY);
  }

  return nextId;
}

export function clearResumeFromLocalStorage() {
  if (!isBrowser()) {
    return;
  }

  pendingResume = null;
  clearPendingSaveTimer();

  window.localStorage.removeItem(RESUME_STORAGE_KEY);
  window.localStorage.removeItem(RESUME_COLLECTION_STORAGE_KEY);
  window.localStorage.removeItem(RESUME_ACTIVE_ID_STORAGE_KEY);

  emitResumeStorageUpdatedEvent();
}
