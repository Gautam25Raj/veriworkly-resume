"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loadResumeById } from "@/features/resume/services/resume-service";
import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";
import {
  createResumeShareLink,
  listResumeShareLinks,
  revokeResumeShareLink,
  type ResumeShareLinkItem,
} from "@/features/resume/services/share-links";

interface ShareResumeModalProps {
  resumeId: string | null;
  resumeTitle?: string;
  onClose: () => void;
  onNotice: (msg: string) => void;
}

export default function ShareResumeModal({
  resumeId,
  resumeTitle,
  onClose,
  onNotice,
}: ShareResumeModalProps) {
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("");
  const [noExpiry, setNoExpiry] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLinks, setShareLinks] = useState<ResumeShareLinkItem[]>([]);
  const [linksLoading, setLinksLoading] = useState(false);

  const refreshShareLinks = useCallback(async (id: string) => {
    setLinksLoading(true);
    try {
      const links = await listResumeShareLinks(id);
      setShareLinks(links);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load share links.",
      );
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
      await navigator.clipboard.writeText(nextShareUrl);

      setShareUrl(nextShareUrl);
      onNotice("Share link created and copied to clipboard.");
      trackUsageEvent({ event: "share_link_created" });
      await refreshShareLinks(resumeId);
    } catch (err) {
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
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Share Resume</Modal.Title>
          <Modal.Description>
            Create a share link for {resumeTitle ?? "this resume"}.
          </Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-4">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Optional password"
              autoComplete="new-password"
            />
            <label className="text-muted flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={noExpiry}
                onChange={(e) => setNoExpiry(e.target.checked)}
              />
              No expiry
            </label>
            <Input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              type="datetime-local"
              disabled={noExpiry}
            />

            {error && <p className="text-destructive text-sm">{error}</p>}

            {shareUrl && (
              <div className="space-y-2">
                <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                  Share Link
                </p>
                <Input value={shareUrl} readOnly />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
                Existing Share Links
              </p>
              {linksLoading ? (
                <p className="text-muted text-sm">Loading links...</p>
              ) : shareLinks.length === 0 ? (
                <p className="text-muted text-sm">No active share links yet.</p>
              ) : (
                <div className="space-y-2">
                  {shareLinks.map((link) => {
                    const linkUrl = `${window.location.origin}/share/${link.token}`;
                    return (
                      <div
                        key={link.id}
                        className="space-y-2 rounded-xl border border-zinc-700/20 bg-zinc-500/5 p-3"
                      >
                        <p className="text-foreground truncate text-sm font-medium">
                          {link.resumeTitle}
                        </p>
                        <p className="text-muted text-xs">
                          {link.expiresAt
                            ? `Expires ${new Date(link.expiresAt).toLocaleString()}`
                            : "No expiry"}
                          {link.passwordRequired && " • Password protected"}
                          {` • ${link.viewCount} views`}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              await navigator.clipboard.writeText(linkUrl);
                              onNotice("Share link copied.");
                            }}
                          >
                            Copy
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={linkUrl} target="_blank" rel="noreferrer">
                              Open
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRevoke(link.id)}
                          >
                            Revoke
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={busy}>
            Close
          </Button>
          <Button loading={busy} onClick={handleCreate}>
            Create Link
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
