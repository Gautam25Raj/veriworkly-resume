"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface SyncDetailsModalProps {
  resume: any;
  telemetry: any;
  syncingResumeId: string | null;
  onClose: () => void;
  onResolveUseLocal: (id: string) => void;
  onResolveUseCloud: (id: string) => void;
  onKeepLocalOnly: (id: string) => void;
  onSyncNow: (id: string) => void;
  onNotice: (msg: string) => void;
}

export default function SyncDetailsModal({
  resume,
  telemetry,
  syncingResumeId,
  onClose,
  onResolveUseLocal,
  onResolveUseCloud,
  onKeepLocalOnly,
  onSyncNow,
  onNotice,
}: SyncDetailsModalProps) {
  const router = useRouter();

  if (!resume) return null;

  return (
    <Modal open={true} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Sync Details</Modal.Title>

          <Modal.Description>
            Check the current cloud sync state for this resume.
          </Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-zinc-700/20 bg-zinc-500/5 p-3">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Resume
              </p>

              <p className="text-foreground mt-1 font-medium">{resume.title}</p>
            </div>

            <div className="space-y-1">
              <p className="text-muted">Status</p>

              <p className="text-foreground font-medium">
                {!resume.sync.enabled
                  ? "Local only"
                  : resume.sync.status === "synced"
                    ? "Synced"
                    : resume.sync.status === "syncing"
                      ? "Syncing"
                      : resume.sync.status === "pending"
                        ? "Pending"
                        : resume.sync.status === "conflicted"
                          ? "Conflict"
                          : "Local only"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-muted">Last Synced</p>

              <p className="text-foreground font-medium">
                {resume.sync.lastSyncedAt
                  ? new Date(resume.sync.lastSyncedAt).toLocaleString()
                  : "Not synced yet"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-muted">Last Sync Attempt</p>

              <p className="text-foreground font-medium">
                {telemetry?.lastAttemptAt
                  ? new Date(telemetry.lastAttemptAt).toLocaleString()
                  : "No attempt yet"}
              </p>
            </div>

            {telemetry?.lastErrorMessage && (
              <div className="space-y-1">
                <p className="text-muted">Last Sync Error</p>
                <p className="text-foreground font-medium">
                  {telemetry.lastErrorMessage}
                </p>
              </div>
            )}

            {resume.sync.status === "conflicted" && (
              <p className="text-sm text-red-600">
                A conflict was detected. Retry sync or review your cloud sync
                setup.
              </p>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {resume.sync.status === "conflicted" ? (
            <>
              <Button
                variant="secondary"
                onClick={() => onResolveUseLocal(resume.id)}
              >
                Use Local (Overwrite Cloud)
              </Button>

              <Button
                variant="secondary"
                onClick={() => onResolveUseCloud(resume.id)}
              >
                Use Cloud
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  onNotice(
                    "Resolve fields in editor, then click Sync Now to finish merge.",
                  );
                  router.push(`/editor/${resume.id}`);
                }}
              >
                Merge Manually
              </Button>

              <Button
                variant="secondary"
                onClick={() => onKeepLocalOnly(resume.id)}
              >
                Keep Local Only
              </Button>
            </>
          ) : (
            <Button variant="secondary" asChild>
              <Link href="/profile">Open Profile</Link>
            </Button>
          )}

          <Button
            loading={syncingResumeId === resume.id}
            onClick={() => onSyncNow(resume.id)}
          >
            Sync Now
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
