"use client";

import { Eye, MoreVertical, RefreshCw, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Menu, MenuItem, MenuSeparator } from "@/components/ui/Menu";

interface ResumeCardMenuProps {
  resumeTitle: string;
  resumeId: string;
  syncing: boolean;
  hasConflict: boolean;
  onOpen: () => void;
  onShare: () => void;
  onSyncNow: () => void;
  onSyncDetails: () => void;
  onDelete: (id: string) => void;
}

const ResumeCardMenu = ({
  resumeTitle,
  resumeId,
  syncing,
  hasConflict,
  onOpen,
  onShare,
  onSyncNow,
  onSyncDetails,
  onDelete,
}: ResumeCardMenuProps) => {
  return (
    <Menu
      panelClassName="min-w-52"
      trigger={({ open, toggle, menuId }) => (
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          aria-label={`Resume actions for ${resumeTitle}`}
          className="h-9 w-9 rounded-full border border-zinc-700/10 bg-white/70 p-0 backdrop-blur-md transition hover:bg-white sm:h-8 sm:w-8 dark:bg-zinc-900/70 dark:hover:bg-zinc-900"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggle();
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      )}
    >
      {({ close }) => {
        const handleAction =
          (action: () => void) => (event: React.MouseEvent) => {
            event.preventDefault();
            close();
            action();
          };

        return (
          <>
            <MenuItem
              onClick={handleAction(hasConflict ? onSyncDetails : onOpen)}
            >
              <Eye className="h-4 w-4" />
              {hasConflict ? "Resolve Conflict" : "Open Resume"}
            </MenuItem>

            <MenuItem onClick={handleAction(onShare)}>
              <Share2 className="h-4 w-4" />
              Share Resume
            </MenuItem>

            <MenuItem disabled={syncing} onClick={handleAction(onSyncNow)}>
              <RefreshCw
                className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync Now"}
            </MenuItem>

            <MenuItem onClick={handleAction(onSyncDetails)}>
              <Eye className="h-4 w-4" />
              View Sync Details
            </MenuItem>

            <MenuSeparator />

            <MenuItem
              className="text-red-600 hover:text-red-700"
              onClick={handleAction(() => onDelete(resumeId))}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </MenuItem>
          </>
        );
      }}
    </Menu>
  );
};

export default ResumeCardMenu;
