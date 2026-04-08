"use client";

import type { ResumeData } from "@/types/resume";
import type { ResumeSyncStatus } from "@/types/resume";

import {
  RESUME_STORAGE_UPDATED_EVENT,
  setActiveResumeIdInLocalStorage,
  getActiveResumeIdFromLocalStorage,
  saveResumeCollectionToLocalStorage,
  loadResumeCollectionFromLocalStorage,
} from "@/features/resume/services/local-storage";
import {
  saveResume,
  loadResumeById,
} from "@/features/resume/services/resume-service";
import { parseResumeDataInput } from "@/features/resume/schemas/resume-storage-schema";

import { backendApiUrl } from "@/lib/constants";

type SyncResult = {
  ok: boolean;
  message: string;
  reason?:
    | "conflict"
    | "auth"
    | "forbidden"
    | "not-found"
    | "network"
    | "unknown";
};

interface HydrateCloudResumesOptions {
  force?: boolean;
  minIntervalMs?: number;
}

interface SyncNowOptions {
  force?: boolean;
}

interface ResumeSyncWorkerOptions {
  enabled: boolean;
  idleDelayMs?: number;
}

interface SyncOutboxItem {
  resumeId: string;
  state: "pending" | "syncing" | "conflicted";
  attempts: number;
  nextAttemptAt: number;
  updatedAt: number;
}

interface SyncOutboxState {
  items: Record<string, SyncOutboxItem>;
}

export interface ResumeSyncTelemetry {
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string | null;
}

interface SyncTelemetryState {
  byResumeId: Record<string, ResumeSyncTelemetry>;
}

type CloudResumeRecord = {
  id: string;
  title: string;
  content: unknown;
  template: string;
  isPublic: boolean;
  syncEnabled: boolean;
  syncStatus: string;
  cloudResumeId: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CloudResumeResponse = {
  data: CloudResumeRecord[] | CloudResumeRecord;
};

const CLOUD_HYDRATE_META_KEY = "veriworkly:cloud-hydrate-meta";
const SYNC_OUTBOX_STORAGE_KEY = "veriworkly:resume-sync-outbox";
const SYNC_TELEMETRY_STORAGE_KEY = "veriworkly:resume-sync-telemetry";
export const RESUME_SYNC_OUTBOX_UPDATED_EVENT =
  "veriworkly:resume-sync-outbox-updated";

const DEFAULT_AUTO_SYNC_IDLE_DELAY_MS = 12_000;
const DEFAULT_MIN_HYDRATE_INTERVAL_MS = 2 * 60 * 1000;

let workerTickTimer: number | null = null;

let workerEnabled = false;
let listenersAttached = false;
let workerTickInFlight = false;
let workerIdleDelayMs = DEFAULT_AUTO_SYNC_IDLE_DELAY_MS;

function isBrowser() {
  return typeof window !== "undefined";
}

function emitResumeSyncOutboxUpdate() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(RESUME_SYNC_OUTBOX_UPDATED_EVENT));
}

function toIsoOrNull(value: number | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function toTimestamp(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function loadSyncOutboxState(): SyncOutboxState {
  if (!isBrowser()) {
    return { items: {} };
  }

  const raw = window.localStorage.getItem(SYNC_OUTBOX_STORAGE_KEY);

  if (!raw) {
    return { items: {} };
  }

  try {
    const parsed = JSON.parse(raw) as SyncOutboxState;

    if (!parsed || typeof parsed !== "object" || !parsed.items) {
      return { items: {} };
    }

    return {
      items: parsed.items,
    };
  } catch {
    return { items: {} };
  }
}

function saveSyncOutboxState(state: SyncOutboxState) {
  if (!isBrowser()) return;

  window.localStorage.setItem(SYNC_OUTBOX_STORAGE_KEY, JSON.stringify(state));
  emitResumeSyncOutboxUpdate();
}

function loadSyncTelemetryState(): SyncTelemetryState {
  if (!isBrowser()) return { byResumeId: {} };

  const raw = window.localStorage.getItem(SYNC_TELEMETRY_STORAGE_KEY);

  if (!raw) {
    return { byResumeId: {} };
  }

  try {
    const parsed = JSON.parse(raw) as SyncTelemetryState;

    if (!parsed || typeof parsed !== "object" || !parsed.byResumeId) {
      return { byResumeId: {} };
    }

    return parsed;
  } catch {
    return { byResumeId: {} };
  }
}

function saveSyncTelemetryState(state: SyncTelemetryState) {
  if (!isBrowser()) return;

  window.localStorage.setItem(
    SYNC_TELEMETRY_STORAGE_KEY,
    JSON.stringify(state),
  );

  emitResumeSyncOutboxUpdate();
}

function updateSyncTelemetry(
  resumeId: string,
  patch: Partial<ResumeSyncTelemetry>,
) {
  const state = loadSyncTelemetryState();
  const existing = state.byResumeId[resumeId] ?? {
    lastAttemptAt: null,
    lastSuccessAt: null,
    lastErrorAt: null,
    lastErrorMessage: null,
  };

  state.byResumeId[resumeId] = {
    ...existing,
    ...patch,
  };

  saveSyncTelemetryState(state);
}

function clearOutboxItem(resumeId: string) {
  const state = loadSyncOutboxState();

  if (!state.items[resumeId]) return;

  delete state.items[resumeId];
  saveSyncOutboxState(state);
}

function computeRetryDelayMs() {
  return workerIdleDelayMs;
}

function upsertOutboxItem(
  resumeId: string,
  input?: Partial<SyncOutboxItem> & { delayMs?: number },
) {
  const now = Date.now();

  const state = loadSyncOutboxState();

  const existing = state.items[resumeId];
  const delayMs = Math.max(0, input?.delayMs ?? workerIdleDelayMs);
  const nextAttemptAt = input?.nextAttemptAt ?? now + delayMs;

  state.items[resumeId] = {
    resumeId,
    state: input?.state ?? existing?.state ?? "pending",
    attempts: input?.attempts ?? existing?.attempts ?? 0,
    nextAttemptAt,
    updatedAt: now,
  };

  saveSyncOutboxState(state);
}

function queuePendingResumesForSync() {
  const collection = loadResumeCollectionFromLocalStorage();

  const pendingResumes = Object.values(collection.items).filter(
    (resume) => resume.sync.enabled && resume.sync.status === "pending",
  );

  for (const resume of pendingResumes) {
    upsertOutboxItem(resume.id);
  }
}

function scheduleWorkerTick(delayMs: number) {
  if (!isBrowser()) {
    return;
  }

  if (workerTickTimer !== null) {
    window.clearTimeout(workerTickTimer);
    workerTickTimer = null;
  }

  workerTickTimer = window.setTimeout(
    () => {
      workerTickTimer = null;
      void runWorkerTick();
    },
    Math.max(0, delayMs),
  );
}

function getNextDueOutboxItem() {
  const now = Date.now();

  const state = loadSyncOutboxState();

  const items = Object.values(state.items)
    .filter((item) => item.state !== "conflicted")
    .sort((left, right) => left.nextAttemptAt - right.nextAttemptAt);

  if (items.length === 0) return null;

  const first = items[0];

  return {
    item: first,
    delayMs: Math.max(0, first.nextAttemptAt - now),
  };
}

function setLocalSyncState(
  resumeId: string,
  status: ResumeSyncStatus,
  options?: { keepEnabled?: boolean },
) {
  const resume = loadResumeById(resumeId);

  if (!resume) return;

  const nextSyncedAt = status === "synced" ? new Date().toISOString() : null;

  saveResume({
    ...resume,
    sync: {
      ...resume.sync,
      enabled: options?.keepEnabled === false ? resume.sync.enabled : true,
      status,
      cloudResumeId: resume.sync.cloudResumeId ?? resume.id,
      lastSyncedAt: nextSyncedAt ?? resume.sync.lastSyncedAt,
    },
  });
}

async function runWorkerTick() {
  if (!workerEnabled || workerTickInFlight) {
    return;
  }

  const due = getNextDueOutboxItem();

  if (!due) return;

  if (due.delayMs > 0) {
    scheduleWorkerTick(due.delayMs);
    return;
  }

  workerTickInFlight = true;

  try {
    const currentResume = loadResumeById(due.item.resumeId);

    if (!currentResume || !currentResume.sync.enabled) {
      clearOutboxItem(due.item.resumeId);
      return;
    }

    await syncResumeNow(due.item.resumeId);
  } finally {
    workerTickInFlight = false;

    const nextDue = getNextDueOutboxItem();

    if (workerEnabled && nextDue) {
      scheduleWorkerTick(nextDue.delayMs);
    }
  }
}

function attachWorkerListeners() {
  if (!isBrowser() || listenersAttached) {
    return;
  }

  const requeueAndRun = () => {
    if (!workerEnabled) {
      return;
    }

    queuePendingResumesForSync();
    const nextDue = getNextDueOutboxItem();

    if (nextDue) {
      scheduleWorkerTick(nextDue.delayMs);
    }
  };

  window.addEventListener(RESUME_STORAGE_UPDATED_EVENT, requeueAndRun);
  window.addEventListener("online", requeueAndRun);
  window.addEventListener("focus", requeueAndRun);
  window.addEventListener("visibilitychange", requeueAndRun);

  listenersAttached = true;
}

function getCloudHydrateMeta() {
  if (!isBrowser()) {
    return {
      lastHydratedAt: 0,
      lastServerCursor: null as string | null,
    };
  }

  const raw = window.localStorage.getItem(CLOUD_HYDRATE_META_KEY);

  if (!raw) {
    return {
      lastHydratedAt: 0,
      lastServerCursor: null as string | null,
    };
  }

  try {
    const parsed = JSON.parse(raw) as {
      lastHydratedAt?: number;
      lastServerCursor?: string | null;
    };

    return {
      lastHydratedAt: Number(parsed.lastHydratedAt) || 0,
      lastServerCursor:
        typeof parsed.lastServerCursor === "string" && parsed.lastServerCursor
          ? parsed.lastServerCursor
          : null,
    };
  } catch {
    return {
      lastHydratedAt: 0,
      lastServerCursor: null as string | null,
    };
  }
}

function getLastCloudHydrateAt() {
  return getCloudHydrateMeta().lastHydratedAt;
}

function setLastCloudHydrateMeta(meta: {
  lastHydratedAt: number;
  lastServerCursor?: string | null;
}) {
  if (!isBrowser()) return;

  const current = getCloudHydrateMeta();

  window.localStorage.setItem(
    CLOUD_HYDRATE_META_KEY,
    JSON.stringify({
      lastHydratedAt: meta.lastHydratedAt,
      lastServerCursor:
        meta.lastServerCursor === undefined
          ? current.lastServerCursor
          : meta.lastServerCursor,
    }),
  );
}

function shouldHydrateCloudResumes(options?: HydrateCloudResumesOptions) {
  if (options?.force) return true;

  const minIntervalMs = Math.max(
    0,
    options?.minIntervalMs ?? DEFAULT_MIN_HYDRATE_INTERVAL_MS,
  );

  if (minIntervalMs === 0) {
    return true;
  }

  const elapsedMs = Date.now() - getLastCloudHydrateAt();

  return elapsedMs >= minIntervalMs;
}

function toKnownSyncStatus(
  value: string | undefined,
  fallback: ResumeSyncStatus,
): ResumeSyncStatus {
  if (
    value === "local-only" ||
    value === "pending" ||
    value === "syncing" ||
    value === "synced" ||
    value === "conflicted"
  ) {
    return value;
  }

  return fallback;
}

function applyCloudSyncMetadata(
  resume: ResumeData,
  record: CloudResumeRecord,
): ResumeData {
  const fallbackStatus = resume.sync.enabled ? "pending" : "local-only";

  return {
    ...resume,
    sync: {
      ...resume.sync,
      enabled: record.syncEnabled,
      status: toKnownSyncStatus(record.syncStatus, fallbackStatus),
      cloudResumeId: record.cloudResumeId ?? resume.sync.cloudResumeId,
      lastSyncedAt: record.lastSyncedAt ?? resume.sync.lastSyncedAt,
    },
  };
}

function emitResumeStorageUpdate() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event("storage"));
}

function mergeCloudResumesIntoLocalStorage(records: CloudResumeRecord[]) {
  let mergedCount = 0;

  const collection = loadResumeCollectionFromLocalStorage();
  const activeResumeId = getActiveResumeIdFromLocalStorage();

  for (const record of records) {
    const cloudResume = parseResumeDataInput(record.content);

    if (!cloudResume) continue;

    const localResume = collection.items[cloudResume.id];
    const localUpdatedAt = toTimestamp(localResume?.updatedAt);

    const cloudUpdatedAt = Math.max(
      toTimestamp(cloudResume.updatedAt),
      toTimestamp(record.updatedAt),
    );

    const shouldPreferCloud = !localResume || cloudUpdatedAt > localUpdatedAt;

    if (!shouldPreferCloud) continue;

    const normalizedCloudResume = applyCloudSyncMetadata(cloudResume, record);

    collection.items[normalizedCloudResume.id] = normalizedCloudResume;
    mergedCount += 1;
  }

  if (mergedCount === 0) return { ok: true, mergedCount: 0 } as const;

  const saveResult = saveResumeCollectionToLocalStorage(collection);

  if (!saveResult.ok) return { ok: false, mergedCount: 0 } as const;

  if (activeResumeId && collection.items[activeResumeId]) {
    setActiveResumeIdInLocalStorage(activeResumeId);
  } else {
    const nextActiveId = Object.keys(collection.items)[0];

    if (nextActiveId) {
      setActiveResumeIdInLocalStorage(nextActiveId);
    }
  }

  emitResumeStorageUpdate();

  return { ok: true, mergedCount } as const;
}

async function fetchCloudResumeRecords(path: string) {
  const response = await fetch(backendApiUrl(path), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as CloudResumeResponse;

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [payload.data];
}

function toFriendlySyncMessage(status: number) {
  if (status === 409) {
    return {
      message: "Conflict detected. Cloud has newer changes.",
      reason: "conflict" as const,
    };
  }

  if (status === 401) {
    return {
      message: "Login required to sync this resume.",
      reason: "auth" as const,
    };
  }

  if (status === 403) {
    return {
      message: "You are not allowed to sync this resume.",
      reason: "forbidden" as const,
    };
  }

  if (status === 404) {
    return {
      message: "Resume not found in cloud sync service.",
      reason: "not-found" as const,
    };
  }

  return {
    message: "Sync failed. Please try again.",
    reason: "unknown" as const,
  };
}

function buildResumesListPath() {
  const cloudMeta = getCloudHydrateMeta();

  if (!cloudMeta.lastServerCursor) {
    return "/resumes";
  }

  return `/resumes?updatedSince=${encodeURIComponent(cloudMeta.lastServerCursor)}`;
}

export function getResumeSyncTelemetry(resumeId: string): ResumeSyncTelemetry {
  const telemetry = loadSyncTelemetryState();

  return (
    telemetry.byResumeId[resumeId] ?? {
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastErrorAt: null,
      lastErrorMessage: null,
    }
  );
}

export function getResumeSyncTelemetryByIds(
  resumeIds: string[],
): Record<string, ResumeSyncTelemetry> {
  const telemetry = loadSyncTelemetryState();
  const result: Record<string, ResumeSyncTelemetry> = {};

  for (const resumeId of resumeIds) {
    result[resumeId] = telemetry.byResumeId[resumeId] ?? {
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastErrorAt: null,
      lastErrorMessage: null,
    };
  }

  return result;
}

export function getWorkspaceSyncTelemetry() {
  const telemetry = loadSyncTelemetryState();
  const values = Object.values(telemetry.byResumeId);
  const maxAttempt = Math.max(
    ...values.map((item) => toTimestamp(item.lastAttemptAt)),
    0,
  );
  const maxSuccess = Math.max(
    ...values.map((item) => toTimestamp(item.lastSuccessAt)),
    0,
  );

  return {
    lastAttemptAt: toIsoOrNull(maxAttempt),
    lastSuccessAt: toIsoOrNull(maxSuccess),
  };
}

export function startResumeSyncWorker(options: ResumeSyncWorkerOptions) {
  workerEnabled = options.enabled;
  workerIdleDelayMs = Math.max(
    2_000,
    options.idleDelayMs ?? DEFAULT_AUTO_SYNC_IDLE_DELAY_MS,
  );

  attachWorkerListeners();

  if (!workerEnabled) {
    if (workerTickTimer !== null && isBrowser()) {
      window.clearTimeout(workerTickTimer);
      workerTickTimer = null;
    }
    return;
  }

  queuePendingResumesForSync();

  const nextDue = getNextDueOutboxItem();

  if (nextDue) {
    scheduleWorkerTick(nextDue.delayMs);
  }
}

export async function syncResumeNow(
  resumeId: string,
  options?: SyncNowOptions,
): Promise<SyncResult> {
  const resume = loadResumeById(resumeId);

  if (!resume) {
    return {
      ok: false,
      message: "Resume not found locally.",
      reason: "not-found",
    };
  }

  if (!resume.sync.enabled && !options?.force) {
    clearOutboxItem(resumeId);
    return {
      ok: false,
      message: "Resume is local-only. Enable sync before syncing.",
      reason: "unknown",
    };
  }

  setLocalSyncState(resumeId, "syncing");
  updateSyncTelemetry(resumeId, {
    lastAttemptAt: new Date().toISOString(),
  });
  upsertOutboxItem(resumeId, {
    state: "syncing",
    delayMs: 0,
  });

  try {
    const response = await fetch(backendApiUrl(`/resumes/${resumeId}/sync`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        syncEnabled: true,
        syncStatus: "synced",
        force: Boolean(options?.force),
        clientUpdatedAt: resume.updatedAt,
        cloudResumeId: resume.sync.cloudResumeId ?? resume.id,
        lastSyncedAt: new Date().toISOString(),
        resume,
      }),
    });

    if (!response.ok) {
      const failure = toFriendlySyncMessage(response.status);

      if (failure.reason === "conflict") {
        setLocalSyncState(resumeId, "conflicted");
        upsertOutboxItem(resumeId, {
          state: "conflicted",
          attempts: 0,
          nextAttemptAt: Date.now() + workerIdleDelayMs,
        });
      } else {
        const existing = loadSyncOutboxState().items[resumeId];
        const attempts = (existing?.attempts ?? 0) + 1;
        const retryIn = computeRetryDelayMs();

        setLocalSyncState(resumeId, "pending");
        upsertOutboxItem(resumeId, {
          state: "pending",
          attempts,
          nextAttemptAt: Date.now() + retryIn,
        });
      }

      updateSyncTelemetry(resumeId, {
        lastErrorAt: new Date().toISOString(),
        lastErrorMessage: failure.message,
      });

      return {
        ok: false,
        message: failure.message,
        reason: failure.reason,
      };
    }

    setLocalSyncState(resumeId, "synced");
    clearOutboxItem(resumeId);
    updateSyncTelemetry(resumeId, {
      lastSuccessAt: new Date().toISOString(),
      lastErrorAt: null,
      lastErrorMessage: null,
    });
    emitResumeStorageUpdate();

    return {
      ok: true,
      message: "Resume synced successfully.",
    };
  } catch {
    const existing = loadSyncOutboxState().items[resumeId];
    const attempts = (existing?.attempts ?? 0) + 1;
    const retryIn = computeRetryDelayMs();

    setLocalSyncState(resumeId, "pending");
    upsertOutboxItem(resumeId, {
      state: "pending",
      attempts,
      nextAttemptAt: Date.now() + retryIn,
    });
    updateSyncTelemetry(resumeId, {
      lastErrorAt: new Date().toISOString(),
      lastErrorMessage:
        "Could not reach sync service. Check your network and retry.",
    });
    emitResumeStorageUpdate();

    const nextDue = getNextDueOutboxItem();

    if (workerEnabled && nextDue) {
      scheduleWorkerTick(nextDue.delayMs);
    }

    return {
      ok: false,
      message: "Could not reach sync service. Check your network and retry.",
      reason: "network",
    };
  }
}

export async function syncAllPendingResumes(): Promise<SyncResult> {
  const resumes = loadResumeCollectionFromLocalStorage();
  const pendingResumes = Object.values(resumes.items).filter(
    (resume) => resume.sync.enabled && resume.sync.status !== "synced",
  );

  if (pendingResumes.length === 0) {
    return {
      ok: true,
      message: "No pending resumes to sync.",
    };
  }

  let syncedCount = 0;

  for (const resume of pendingResumes) {
    const result = await syncResumeNow(resume.id, { force: false });

    if (result.ok) {
      syncedCount += 1;
    }
  }

  return {
    ok: syncedCount === pendingResumes.length,
    message:
      syncedCount === pendingResumes.length
        ? `Synced ${syncedCount} resume${syncedCount === 1 ? "" : "s"} to the cloud.`
        : `Synced ${syncedCount} of ${pendingResumes.length} resumes to the cloud.`,
  };
}

export async function hydrateCloudResumesToLocalStorage(
  options?: HydrateCloudResumesOptions,
): Promise<SyncResult> {
  if (!shouldHydrateCloudResumes(options)) {
    return {
      ok: true,
      message: "Skipped cloud refresh because local cache is still fresh.",
    };
  }

  const records = await fetchCloudResumeRecords(buildResumesListPath());

  if (!records) {
    return {
      ok: false,
      message: "Unable to load cloud resumes right now.",
    };
  }

  const merged = mergeCloudResumesIntoLocalStorage(records);

  if (!merged.ok) {
    return {
      ok: false,
      message: "Unable to merge cloud resumes into local storage.",
    };
  }

  setLastCloudHydrateMeta({
    lastHydratedAt: Date.now(),
    lastServerCursor: new Date().toISOString(),
  });

  return {
    ok: true,
    message:
      merged.mergedCount === 0
        ? "No cloud resumes to merge."
        : `Merged ${merged.mergedCount} cloud resume${merged.mergedCount === 1 ? "" : "s"}.`,
  };
}

export async function hydrateCloudResumeByIdToLocalStorage(
  resumeId: string,
): Promise<SyncResult> {
  const records = await fetchCloudResumeRecords(`/resumes/${resumeId}`);

  if (!records || records.length === 0) {
    return {
      ok: false,
      message: "Cloud resume not found.",
    };
  }

  const merged = mergeCloudResumesIntoLocalStorage(records);

  if (!merged.ok) {
    return {
      ok: false,
      message: "Unable to merge the cloud resume.",
    };
  }

  return {
    ok: true,
    message: "Cloud resume loaded successfully.",
  };
}

export function keepResumeLocalOnly(resumeId: string): SyncResult {
  const resume = loadResumeById(resumeId);

  if (!resume) {
    return {
      ok: false,
      message: "Resume not found locally.",
    };
  }

  saveResume({
    ...resume,
    sync: {
      ...resume.sync,
      enabled: false,
      status: "local-only",
      cloudResumeId: null,
    },
  });

  clearOutboxItem(resumeId);

  emitResumeStorageUpdate();

  return {
    ok: true,
    message: "Resume moved to local-only mode.",
  };
}

export async function resolveConflictUseLocal(
  resumeId: string,
): Promise<SyncResult> {
  return syncResumeNow(resumeId, { force: true });
}

export async function resolveConflictUseCloud(
  resumeId: string,
): Promise<SyncResult> {
  const result = await hydrateCloudResumeByIdToLocalStorage(resumeId);

  if (result.ok) {
    clearOutboxItem(resumeId);
  }

  return result;
}
