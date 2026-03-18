"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

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

const DashboardWorkspace = () => {
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);

  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    setResumes(listSavedResumes());
    setIsLoaded(true);
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

    setResumes((prev) => prev.filter((r) => r.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-6 py-8">
        <div className="bg-card border-border h-32 w-full rounded-3xl border" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border-border h-48 w-full rounded-3xl border"
            />
          ))}
        </div>
      </div>
    );
  }

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
        {resumes.length} resumes available
      </div>

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
    </div>
  );
};

export default DashboardWorkspace;
