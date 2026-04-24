"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

import {
  syncResumeNow,
  keepResumeLocalOnly,
  startResumeSyncWorker,
  getResumeSyncTelemetry,
  resolveConflictUseCloud,
  resolveConflictUseLocal,
  getResumeSyncTelemetryByIds,
  RESUME_SYNC_OUTBOX_UPDATED_EVENT,
  hydrateCloudResumesToLocalStorage,
} from "@/features/resume/services/resume-sync";
import {
  type ResumeListItem,
  createResume,
  deleteResumeById,
} from "@/features/resume/services/resume-service";
import { listSavedResumes } from "@/features/resume/services/resume-core";
import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";
import { RESUME_STORAGE_UPDATED_EVENT } from "@/features/resume/services/local-storage";

import {
  RESUME_ACTIVE_ID_STORAGE_KEY,
  RESUME_COLLECTION_STORAGE_KEY,
} from "@/lib/constants";

import { useUserStore } from "@/store/useUserStore";

import ResumeGrid from "./ResumeGrid";
import WorkspaceHeader from "./WorkspaceHeader";

import DestructiveModal from "@/components/ui/modals/DestructiveModal";
import ShareResumeModal from "@/components/ui/modals/ShareResumeModal";
import SyncDetailsModal from "@/components/ui/modals/SyncDetailsModal";

const EMPTY_RESUMES: ResumeListItem[] = [];
let resumeCache = { data: EMPTY_RESUMES, key: "" };
let resumeItemCacheById = new Map<string, ResumeListItem>();
const SYNC_OUTBOX_STORAGE_KEY = "veriworkly:resume-sync-outbox";

const isSameResumeListItem = (left: ResumeListItem, right: ResumeListItem) =>
  left.id === right.id &&
  left.title === right.title &&
  left.templateId === right.templateId &&
  left.role === right.role &&
  left.updatedAt === right.updatedAt &&
  left.sync.enabled === right.sync.enabled &&
  left.sync.status === right.sync.status &&
  left.sync.cloudResumeId === right.sync.cloudResumeId &&
  left.sync.lastSyncedAt === right.sync.lastSyncedAt;

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(RESUME_STORAGE_UPDATED_EVENT, onStoreChange);
  window.addEventListener(RESUME_SYNC_OUTBOX_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(RESUME_STORAGE_UPDATED_EVENT, onStoreChange);
    window.removeEventListener(RESUME_SYNC_OUTBOX_UPDATED_EVENT, onStoreChange);
  };
};

const getResumeSnapshot = () => {
  if (typeof window === "undefined") {
    return resumeCache.data;
  }

  const storage = window.localStorage;

  const nextKey = [
    storage.getItem(RESUME_COLLECTION_STORAGE_KEY) ?? "",
    storage.getItem(RESUME_ACTIVE_ID_STORAGE_KEY) ?? "",
    storage.getItem(SYNC_OUTBOX_STORAGE_KEY) ?? "",
  ].join("::");

  if (nextKey !== resumeCache.key) {
    const nextList = listSavedResumes();
    const nextItemCacheById = new Map<string, ResumeListItem>();

    const stabilizedList = nextList.map((item) => {
      const cachedItem = resumeItemCacheById.get(item.id);

      if (cachedItem && isSameResumeListItem(cachedItem, item)) {
        nextItemCacheById.set(item.id, cachedItem);
        return cachedItem;
      }

      nextItemCacheById.set(item.id, item);
      return item;
    });

    resumeItemCacheById = nextItemCacheById;
    resumeCache = {
      data: stabilizedList,
      key: nextKey,
    };
  }

  return resumeCache.data;
};

const DashboardWorkspace = () => {
  const router = useRouter();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const [shareTargetId, setShareTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [syncDetailsTargetId, setSyncDetailsTargetId] = useState<string | null>(
    null,
  );

  const [isRefreshingCloud, setIsRefreshingCloud] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [syncingResumeId, setSyncingResumeId] = useState<string | null>(null);

  const resumes = useSyncExternalStore(
    subscribe,
    getResumeSnapshot,
    () => EMPTY_RESUMES,
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    startResumeSyncWorker({ enabled: true, idleDelayMs: 12_000 });

    void hydrateCloudResumesToLocalStorage({ minIntervalMs: 2 * 60 * 1000 });
  }, [isLoggedIn]);

  useEffect(() => {
    trackUsageEvent({ event: "dashboard_opened" });
  }, []);

  const deleteTarget = useMemo(
    () => resumes.find((r) => r.id === deleteTargetId),
    [resumes, deleteTargetId],
  );

  const shareTarget = useMemo(
    () => resumes.find((r) => r.id === shareTargetId),
    [resumes, shareTargetId],
  );

  const syncTarget = useMemo(
    () => resumes.find((r) => r.id === syncDetailsTargetId),
    [resumes, syncDetailsTargetId],
  );

  const syncTargetTelemetry = useMemo(
    () => (syncTarget ? getResumeSyncTelemetry(syncTarget.id) : null),
    [syncTarget],
  );

  const syncTelemetryById = useMemo(
    () => getResumeSyncTelemetryByIds(resumes.map((resume) => resume.id)),
    [resumes],
  );

  const handleOpen = useCallback(
    (id: string) => {
      router.push(`/editor/${id}`);
    },
    [router],
  );

  const handleCreate = useCallback(() => {
    const nextResume = createResume();

    trackUsageEvent({ event: "resume_created" });

    router.push(`/editor/${nextResume.id}`);
  }, [router]);

  const handleRefreshCloud = useCallback(async () => {
    setIsRefreshingCloud(true);
    setSyncNotice(null);

    try {
      const result = await hydrateCloudResumesToLocalStorage({ force: true });
      setSyncNotice(result.message);
    } finally {
      setIsRefreshingCloud(false);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;

    deleteResumeById(deleteTargetId);
    trackUsageEvent({ event: "resume_deleted" });
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  const handleSyncNow = useCallback(async (resumeId: string) => {
    setSyncingResumeId(resumeId);

    const result = await syncResumeNow(resumeId);

    setSyncNotice(result.message);
    trackUsageEvent({
      event: result.ok ? "resume_sync_success" : "resume_sync_failed",
    });
    setSyncingResumeId(null);
  }, []);

  const handleKeepLocalOnly = useCallback((resumeId: string) => {
    const result = keepResumeLocalOnly(resumeId);

    setSyncNotice(result.message);
    trackUsageEvent({
      event: result.ok
        ? "resume_sync_local_only"
        : "resume_sync_local_only_failed",
    });
    setSyncDetailsTargetId(null);
  }, []);

  const handleResolveUseLocal = useCallback(async (resumeId: string) => {
    setSyncingResumeId(resumeId);
    const result = await resolveConflictUseLocal(resumeId);

    setSyncNotice(result.message);
    setSyncingResumeId(null);
  }, []);

  const handleResolveUseCloud = useCallback(async (resumeId: string) => {
    setSyncingResumeId(resumeId);
    const result = await resolveConflictUseCloud(resumeId);

    setSyncNotice(result.message);
    setSyncingResumeId(null);
  }, []);

  return (
    <div role="region" className="space-y-6 py-8" aria-label="Resume dashboard">
      <WorkspaceHeader
        onCreate={handleCreate}
        onRefresh={handleRefreshCloud}
        refreshing={isRefreshingCloud}
      />

      <ResumeGrid
        resumes={resumes}
        onOpen={handleOpen}
        onCreate={handleCreate}
        onSyncNow={handleSyncNow}
        onShare={setShareTargetId}
        onDelete={setDeleteTargetId}
        syncingResumeId={syncingResumeId}
        syncTelemetryById={syncTelemetryById}
        onSyncDetails={setSyncDetailsTargetId}
      />

      {syncNotice && (
        <p className="text-muted rounded-2xl border border-zinc-700/20 bg-zinc-500/5 px-4 py-3 text-sm">
          {syncNotice}
        </p>
      )}

      <DestructiveModal
        open={Boolean(deleteTargetId)}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
        entityName={deleteTarget?.title ?? "resume"}
      />

      {shareTargetId && (
        <ShareResumeModal
          resumeId={shareTargetId}
          onNotice={setSyncNotice}
          resumeTitle={shareTarget?.title}
          onClose={() => setShareTargetId(null)}
        />
      )}

      {syncDetailsTargetId && syncTarget && (
        <SyncDetailsModal
          resume={syncTarget}
          onNotice={setSyncNotice}
          onSyncNow={handleSyncNow}
          telemetry={syncTargetTelemetry}
          syncingResumeId={syncingResumeId}
          onKeepLocalOnly={handleKeepLocalOnly}
          onResolveUseCloud={handleResolveUseCloud}
          onResolveUseLocal={handleResolveUseLocal}
          onClose={() => setSyncDetailsTargetId(null)}
        />
      )}
    </div>
  );
};

export default DashboardWorkspace;
