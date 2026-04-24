"use client";

import {
  Eye,
  Lock,
  Copy,
  Globe,
  Link2,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

import {
  type ResumeShareLinkItem,
  listResumeShareLinks,
  createResumeShareLink,
  revokeResumeShareLink,
} from "@/features/resume/services/share-links";
import { loadResumeById } from "@/features/resume/services/resume-service";
import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";

import { ApiRequestError } from "@/utils/fetchApiData";

interface ShareResumeModalProps {
  resumeId: string | null;
  resumeTitle?: string;
  onClose: () => void;
  onNotice: (msg: string) => void;
}

interface LinkItem {
  token: string;
  passwordRequired?: boolean;
  viewCount: number;
  expiresAt: string | null;
}

const ActiveLinkRow = ({
  link,
  onRevoke,
  onCopy,
}: {
  link: LinkItem;
  onRevoke: () => void;
  onCopy: (m: string) => void;
}) => {
  const url = `${window.location.origin}/share/${link.token}`;

  return (
    <div className="bg-card hover:bg-accent/5 flex items-center justify-between rounded-lg border p-2 transition-colors sm:p-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-foreground max-w-30 truncate font-mono text-xs font-bold tracking-tight sm:max-w-none">
            {link.token}
          </p>
          {link.passwordRequired && (
            <Lock className="text-accent h-3 w-3 shrink-0" />
          )}
        </div>

        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase">
          <span className="flex items-center gap-0.5">
            <Eye className="h-3 w-3" /> {link.viewCount}
          </span>
          <span className="opacity-30">•</span>
          <span
            className={
              link.expiresAt ? "text-orange-500/80" : "text-emerald-500/80"
            }
          >
            {link.expiresAt ? "Expiring" : "Permanent"}
          </span>
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          title="Copy Link"
          className="h-8 w-8 p-0 sm:h-7 sm:w-7"
          onClick={() => {
            navigator.clipboard.writeText(url);
            onCopy("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onRevoke}
          title="Revoke Access"
          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 sm:h-7 sm:w-7"
        >
          <Trash2 className="h-4 w-4 text-red-500 sm:h-3.5 sm:w-3.5" />
        </Button>
      </div>
    </div>
  );
};

const ShareResumeModal = ({
  resumeId,
  onClose,
  onNotice,
}: ShareResumeModalProps) => {
  const [busy, setBusy] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [password, setPassword] = useState("");
  const [noExpiry, setNoExpiry] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [shareLinks, setShareLinks] = useState<ResumeShareLinkItem[]>([]);

  const [linksLoading, setLinksLoading] = useState(false);

  const refreshShareLinks = useCallback(async (id: string) => {
    setLinksLoading(true);

    try {
      const links = await listResumeShareLinks(id);
      setShareLinks(links);

      return links;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load share links.",
      );

      return null;
    } finally {
      setLinksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (resumeId) refreshShareLinks(resumeId);
  }, [resumeId, refreshShareLinks]);

  const handleCreate = async () => {
    if (!resumeId) return;

    const fullResume = loadResumeById(resumeId);

    if (!fullResume) {
      setError("Resume not found. Refresh and try again.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const shareLink = await createResumeShareLink(fullResume, {
        resumeTitle: fullResume.basics.fullName || "Shared Resume",
        password: password.trim() || undefined,
        expiresAt: noExpiry
          ? null
          : expiry
            ? new Date(expiry).toISOString()
            : null,
        noExpiry,
      });

      const nextShareUrl = `${window.location.origin}/share/${shareLink.token}`;
      setShareUrl(nextShareUrl);

      try {
        await navigator.clipboard.writeText(nextShareUrl);
        onNotice("Share link created and copied to clipboard.");
      } catch {
        onNotice("Share link created. Copy it from the field below.");
      }

      trackUsageEvent({ event: "share_link_created" });

      const refreshed = await refreshShareLinks(resumeId);

      if (!refreshed) {
        setError(
          "Share link was created successfully, but the links list could not be refreshed. You can still use the link shown above.",
        );
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        const refreshed = await refreshShareLinks(resumeId);

        if (refreshed && refreshed.length > 0) {
          const existing = refreshed[0];

          const existingUrl = `${window.location.origin}/share/${existing.token}`;

          setShareUrl(existingUrl);
          setError(
            "A share link already exists for this resume. Revoke the existing one below to create a new link.",
          );

          return;
        }

        setError(
          "A share link already exists for this resume. Revoke the existing one below to create a new link.",
        );
        return;
      }

      setError(
        err instanceof Error ? err.message : "Unable to create share link.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (linkId: string) => {
    if (!resumeId) return;

    try {
      await revokeResumeShareLink(resumeId, linkId);

      setShareLinks((prev) => prev.filter((item) => item.id !== linkId));
      onNotice("Share link revoked.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to revoke share link.",
      );
    }
  };

  const handleClose = () => {
    if (!busy) {
      setPassword("");
      setExpiry("");
      setNoExpiry(false);
      setShareUrl(null);
      setError(null);
      onClose();
    }
  };

  if (!resumeId) return null;
  return (
    <Modal open={true} onClose={handleClose}>
      <Modal.Content className="w-full overflow-hidden p-0 sm:rounded-xl">
        <div className="flex items-center gap-3 border-b px-4 pt-2 pb-4 md:bg-zinc-50/50 md:pt-4 dark:bg-zinc-900/50">
          <Link2 className="text-accent h-5 w-5" />
          <h2 className="text-base font-semibold">Share Resume</h2>
        </div>

        <div className="space-y-6 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Lock className="h-3.5 w-3.5" /> Password Protection
              </label>

              <Input
                inputSize="sm"
                type="password"
                className="h-9"
                value={password}
                placeholder="Optional"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Calendar className="h-3.5 w-3.5" /> Expiration Date
                </label>

                <Checkbox
                  label="None"
                  id="no-expiry"
                  checked={noExpiry}
                  onCheckedChange={setNoExpiry}
                />
              </div>

              <Input
                type="date"
                inputSize="sm"
                value={expiry}
                disabled={noExpiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="disabled:bg-muted h-9 disabled:opacity-50"
              />
            </div>
          </div>

          <Button
            size="sm"
            loading={busy}
            onClick={handleCreate}
            className="w-full shadow-sm"
          >
            Create Share Link
          </Button>

          {error && (
            <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="border-t pt-2">
            <h4 className="text-muted-foreground mb-3 flex items-center justify-between text-xs font-semibold">
              ACTIVE LINKS
              <Badge className="p-1.5 py-0.5 text-[10px]">
                {shareLinks.length}
              </Badge>
            </h4>

            <div className="max-h-48 space-y-2 overflow-y-auto">
              {linksLoading ? (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  Loading...
                </p>
              ) : shareLinks.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border-2 border-dashed py-8 text-center">
                  <Globe className="mx-auto mb-2 h-6 w-6 opacity-20" />
                  <p className="text-xs italic">No public links yet</p>
                </div>
              ) : (
                shareLinks.map((link) => (
                  <ActiveLinkRow
                    link={link}
                    key={link.id}
                    onCopy={onNotice}
                    onRevoke={() => handleRevoke(link.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleClose}
            className="w-full md:w-fit"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ShareResumeModal;
