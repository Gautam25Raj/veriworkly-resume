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
  type ResumeListItem,
  createResume,
  listSavedResumes,
  deleteResumeById,
} from "@/features/resume/services/resume-service";
import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";

import ResumeGrid from "./ResumeGrid";
import WorkspaceHeader from "./WorkspaceHeader";

import DestructiveModal from "@/components/ui/modals/DestructiveModal";

const EMPTY_RESUMES: ResumeListItem[] = [];

let resumeCache = { data: EMPTY_RESUMES, key: "" };

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("focus", onStoreChange);
  window.addEventListener("visibilitychange", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
    window.removeEventListener("visibilitychange", onStoreChange);
  };
};

const getResumeSnapshot = () => {
  const next = listSavedResumes();
  const nextKey = JSON.stringify(next);

  if (nextKey !== resumeCache.key) {
    resumeCache = { data: next, key: nextKey };
  }

  return resumeCache.data;
};

const DashboardWorkspace = () => {
  const router = useRouter();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const resumes = useSyncExternalStore(
    subscribe,
    getResumeSnapshot,
    () => EMPTY_RESUMES,
  );

  const deleteTarget = useMemo(
    () => resumes.find((r) => r.id === deleteTargetId),
    [resumes, deleteTargetId],
  );

  const handleCreate = useCallback(() => {
    const nextResume = createResume();

    trackUsageEvent({ event: "resume_created" });

    router.push(`/editor/${nextResume.id}`);
  }, [router]);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTargetId) return;

    deleteResumeById(deleteTargetId);

    trackUsageEvent({ event: "resume_deleted" });
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  useEffect(() => {
    trackUsageEvent({ event: "dashboard_opened" });
  }, []);

  return (
    <div role="region" className="space-y-6 py-8" aria-label="Resume dashboard">
      <WorkspaceHeader onCreate={handleCreate} />

      <ResumeGrid
        resumes={resumes}
        onCreate={handleCreate}
        onDelete={setDeleteTargetId}
      />

      <DestructiveModal
        open={Boolean(deleteTargetId)}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
        entityName={deleteTarget?.title ?? "resume"}
      />
    </div>
  );
};

export default DashboardWorkspace;
