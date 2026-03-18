"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import DestructiveModal from "@/components/ui/modals/DestructiveModal";

import {
  createResume,
  deleteResumeById,
  listSavedResumes,
  type ResumeListItem,
} from "@/features/resume/services/resume-service";

import ResumeCard from "./ResumeCard";
import EmptyState from "./EmptyState";

const EMPTY_RESUMES: ResumeListItem[] = [];

let cachedResumes: ResumeListItem[] = EMPTY_RESUMES;
let cachedResumesKey = "";

function subscribeToResumeChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener("focus", handleChange);
  window.addEventListener("visibilitychange", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("focus", handleChange);
    window.removeEventListener("visibilitychange", handleChange);
  };
}

function getResumeSnapshot() {
  const nextResumes = listSavedResumes();
  const nextKey = JSON.stringify(nextResumes);

  if (nextKey === cachedResumesKey) {
    return cachedResumes;
  }

  cachedResumes = nextResumes;
  cachedResumesKey = nextKey;

  return cachedResumes;
}

function getServerResumeSnapshot(): ResumeListItem[] {
  return EMPTY_RESUMES;
}

const DashboardWorkspace = () => {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const resumes = useSyncExternalStore(
    subscribeToResumeChanges,
    getResumeSnapshot,
    getServerResumeSnapshot,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const deleteTarget = useMemo(
    () => resumes.find((r) => r.id === deleteTargetId),

    [resumes, deleteTargetId],
  );

  const handleCreate = () => {
    const nextResume = createResume(`Resume ${resumes.length + 1}`);
    router.push(`/editor/${nextResume.id}`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;

    deleteResumeById(deleteTargetId);
    setDeleteTargetId(null);
  };

  return (
    <div
      role="region"
      className="space-y-6 py-8"
      aria-label="Resume management dashboard"
    >
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <header>
          <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
            Resume Workspace
          </p>

          <h1 className="text-foreground text-2xl font-semibold">
            Your resumes
          </h1>

          <p className="text-muted mt-1 text-sm">
            Manage, preview, and safely delete drafts from one place.
          </p>
        </header>

        <Button size="sm" variant="secondary" onClick={handleCreate}>
          Create Resume
        </Button>
      </Card>

      <div className="sr-only" aria-live="polite">
        {isHydrated
          ? `${resumes.length} resumes available`
          : "Loading resumes..."}
      </div>

      {isHydrated && (
        <>
          {resumes.length === 0 ? (
            <EmptyState onCreate={handleCreate} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={setDeleteTargetId}
                />
              ))}
            </div>
          )}

          <DestructiveModal
            open={Boolean(deleteTargetId)}
            onConfirm={handleConfirmDelete}
            onClose={() => setDeleteTargetId(null)}
            entityName={deleteTarget?.title ?? "resume"}
          />
        </>
      )}
    </div>
  );
};

export default DashboardWorkspace;
