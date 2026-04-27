"use client";

import {
  Cloud,
  Monitor,
  History,
  CloudOff,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Modal, Button } from "@veriworkly/ui";
import { cn } from "@/lib/utils";

interface SyncDetailsModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resume: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  telemetry: any;
  syncingResumeId: string | null;
  onClose: () => void;
  onResolveUseLocal: (id: string) => void;
  onResolveUseCloud: (id: string) => void;
  onKeepLocalOnly: (id: string) => void;
  onSyncNow: (id: string) => void;
  onNotice: (msg: string) => void;
}

const SyncDetailsModal = ({
  resume,
  telemetry,
  syncingResumeId,
  onClose,
  onResolveUseLocal,
  onResolveUseCloud,
  onKeepLocalOnly,
  onSyncNow,
  onNotice,
}: SyncDetailsModalProps) => {
  const router = useRouter();
  const isSyncing = syncingResumeId === resume.id;
  const isConflicted = resume.sync.status === "conflicted";

  if (!resume) return null;

  const statusConfig = {
    synced: {
      label: "Synced",
      color: "text-emerald-500",
      bg: "md:bg-emerald-500/10",
      icon: Cloud,
    },
    syncing: {
      label: "Syncing",
      color: "text-accent",
      bg: "md:bg-accent/10",
      icon: RefreshCw,
    },
    conflicted: {
      label: "Conflict",
      color: "text-orange-500",
      bg: "md:bg-orange-500/10",
      icon: AlertTriangle,
    },
    pending: {
      label: "Pending",
      color: "text-zinc-400",
      bg: "md:bg-zinc-500/10",
      icon: History,
    },
    disabled: {
      label: "Local only",
      color: "text-zinc-500",
      bg: "md:bg-zinc-500/10",
      icon: CloudOff,
    },
  };

  const currentStatus = !resume.sync.enabled
    ? statusConfig.disabled
    : statusConfig[resume.sync.status as keyof typeof statusConfig] ||
      statusConfig.disabled;

  const StatusIcon = currentStatus.icon;

  return (
    <Modal open={true} onClose={onClose}>
      <Modal.Content className="overflow-hidden p-0">
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-4 pt-2 md:pt-4",
            currentStatus.bg,
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset",
                currentStatus.color.replace("text", "ring"),
              )}
            >
              <StatusIcon
                className={cn(
                  "h-4 w-4",
                  currentStatus.color,
                  currentStatus.label === "Syncing" && "animate-spin",
                )}
              />
            </div>

            <div>
              <h2 className="text-sm font-bold tracking-tight">Sync Status</h2>

              <p
                className={cn(
                  "text-[10px] font-bold tracking-widest uppercase",
                  currentStatus.color,
                )}
              >
                {currentStatus.label}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 text-xs"
          >
            Close
          </Button>
        </div>

        <Modal.Body className="space-y-5 p-4">
          <div className="space-y-1.5">
            <label className="text-muted text-[10px] font-bold tracking-widest uppercase">
              Target Resume
            </label>

            <div className="rounded-lg border bg-zinc-500/5 px-3 py-2 text-sm font-medium">
              {resume.title}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 rounded-lg border p-2.5">
              <p className="text-muted flex items-center gap-1.5 text-[10px] font-bold tracking-tighter uppercase">
                <Cloud className="h-3 w-3" /> Last Synced
              </p>

              <p className="text-xs font-medium">
                {resume.sync.lastSyncedAt
                  ? new Date(resume.sync.lastSyncedAt).toLocaleDateString()
                  : "Never"}
              </p>
            </div>

            <div className="space-y-1 rounded-lg border p-2.5">
              <p className="text-muted flex items-center gap-1.5 text-[10px] font-bold tracking-tighter uppercase">
                <Monitor className="h-3 w-3" /> Last Attempt
              </p>

              <p className="text-xs font-medium">
                {telemetry?.lastAttemptAt
                  ? new Date(telemetry.lastAttemptAt).toLocaleTimeString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {telemetry?.lastErrorMessage && (
            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3">
              <p className="text-destructive mb-1 text-[10px] font-bold tracking-widest uppercase">
                Last Error
              </p>

              <p className="text-destructive/80 text-xs leading-relaxed font-medium">
                {telemetry.lastErrorMessage}
              </p>
            </div>
          )}

          {isConflicted && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-start gap-3 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                <div className="space-y-1">
                  <p className="text-sm leading-none font-bold">
                    Conflict Detected
                  </p>

                  <p className="text-xs leading-snug opacity-80">
                    The version in the cloud is different from your local
                    version. How would you like to resolve this?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => onResolveUseLocal(resume.id)}
                  className="h-9 justify-between border-orange-500/30 hover:bg-orange-500/10"
                >
                  <span className="text-xs">Overwrite Cloud with Local</span>
                  <Monitor className="h-3.5 w-3.5 opacity-50" />
                </Button>

                <Button
                  size="sm"
                  onClick={() => onResolveUseCloud(resume.id)}
                  className="h-9 justify-between border-orange-500/30 hover:bg-orange-500/10"
                >
                  <span className="text-xs">Use Cloud Version</span>
                  <Cloud className="h-3.5 w-3.5 opacity-50" />
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[10px] font-bold tracking-tighter uppercase"
                    onClick={() => {
                      onNotice(
                        "Resolve fields in editor, then click Sync Now.",
                      );
                      router.push(`/editor/${resume.id}`);
                    }}
                  >
                    Merge Manually
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onKeepLocalOnly(resume.id)}
                    className="text-[10px] font-bold tracking-tighter uppercase"
                  >
                    Keep Local Only
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {!isConflicted && (
            <Button
              size="sm"
              variant="secondary"
              className="text-xs"
              onClick={() => router.push("/profile")}
            >
              Open Profile
            </Button>
          )}

          <Button
            size="sm"
            loading={isSyncing}
            className="shadow-md"
            onClick={() => onSyncNow(resume.id)}
          >
            {isConflicted ? "Retry Sync" : "Sync Now"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default SyncDetailsModal;
