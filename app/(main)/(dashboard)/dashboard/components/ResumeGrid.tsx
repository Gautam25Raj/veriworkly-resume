"use client";

import { memo } from "react";
import ResumeCard from "./ResumeCard";
import EmptyState from "./EmptyState";

import { ResumeListItem } from "@/features/resume/services/resume-service";
import type { ResumeSyncTelemetry } from "@/features/resume/services/resume-sync";

interface GridProps {
  resumes: ResumeListItem[];
  syncTelemetryById: Record<string, ResumeSyncTelemetry>;
  onOpen: (id: string) => void;
  onShare: (id: string) => void;
  onSyncNow: (id: string) => void;
  onSyncDetails: (id: string) => void;
  syncingResumeId: string | null;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const ResumeGrid = ({
  resumes,
  syncTelemetryById,
  onOpen,
  onShare,
  onSyncNow,
  onSyncDetails,
  syncingResumeId,
  onDelete,
  onCreate,
}: GridProps) => {
  if (resumes.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          syncTelemetry={syncTelemetryById[resume.id] ?? null}
          syncing={syncingResumeId === resume.id}
          // Notice we pass the raw function references directly now
          onOpen={onOpen}
          onShare={onShare}
          onSyncNow={onSyncNow}
          onSyncDetails={onSyncDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Memoize the grid itself so it doesn't re-render unless the resume list changes
export default memo(ResumeGrid);
