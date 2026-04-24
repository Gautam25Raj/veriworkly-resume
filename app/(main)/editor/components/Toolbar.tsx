"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

import ToolbarHeader from "@/app/(main)/editor/components/toolbar/ToolbarHeader";
import ToolbarActionsMenu from "@/app/(main)/editor/components/toolbar/ToolbarActionsMenu";
import ToolbarDownloadMenu from "@/app/(main)/editor/components/toolbar/ToolbarDownloadMenu";

import {
  listResumeShareLinks,
  createResumeShareLink,
  exportResumeViaServer,
} from "@/features/resume/services/share-links";
import {
  saveResume,
  createResume,
  deleteResume,
  exportResumeAsHtml,
  exportResumeAsJson,
  exportResumeAsDocx,
  exportResumeAsText,
  importResumeFromFile,
  exportResumeAsMarkdown,
} from "@/features/resume/services/resume-service";
import { useResume } from "@/features/resume/hooks/use-resume";
import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";
import { buildExportHtml } from "@/features/resume/utils/build-export-html";

import { ApiRequestError } from "@/utils/fetchApiData";

interface ToolbarProps {
  resumeId: string;
  resumePreviewId: string;
}

const Toolbar = ({ resumeId, resumePreviewId }: ToolbarProps) => {
  const router = useRouter();

  const { resetResume, resume, saveToStorage, setResume } = useResume();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("Autosave ready");

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [shareBusy, setShareBusy] = useState(false);
  const [shareExpiry, setShareExpiry] = useState("");
  const [sharePassword, setSharePassword] = useState("");
  const [shareNoExpiry, setShareNoExpiry] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);

  function getSaveFailureMessage(reason: "quota-exceeded" | "unknown") {
    if (reason === "quota-exceeded") {
      return "Storage is full. Remove older resumes or exports and try again.";
    }

    return "Unable to save locally right now. Please try again.";
  }

  async function onImportResume(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const importedResume = await importResumeFromFile(file);
      const saveResult = saveResume(importedResume);

      if (!saveResult.ok) {
        setMessage(getSaveFailureMessage(saveResult.reason));
        return;
      }

      setResume(importedResume);

      router.push(`/editor/${importedResume.id}`);

      setMessage("JSON imported successfully");
    } catch {
      setMessage("Import failed. Please use a valid JSON file");
    }
  }

  function onDeleteResume() {
    const nextResume = deleteResume(resume.id);

    if (!nextResume) {
      const fallback = createResume();

      setResume(fallback);

      router.push(`/editor/${fallback.id}`);
      setMessage("Current resume removed. Fresh resume created.");

      return;
    }

    setResume(nextResume);

    router.push(`/editor/${nextResume.id}`);

    setMessage("Resume deleted");
    trackUsageEvent({ event: "resume_deleted" });

    setDeleteConfirmOpen(false);
    setDeleteConfirmText("");
  }

  function openDeleteModal() {
    setDeleteConfirmOpen(true);
    setDeleteConfirmText("");
  }

  async function onDownloadPdf() {
    await onDownloadServerExport("pdf");
  }

  async function onDownloadImage(format: "png" | "jpg") {
    await onDownloadServerExport(format);
  }

  async function onDownloadServerExport(format: "pdf" | "png" | "jpg") {
    setActiveDownload(format);

    try {
      const renderHtml = buildExportHtml(resumePreviewId);
      await exportResumeViaServer(resume, format, renderHtml);
      setMessage(`${format.toUpperCase()} downloaded successfully`);
      trackUsageEvent({ event: "resume_exported_server" });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : `Could not export ${format.toUpperCase()}.`,
      );
    } finally {
      setActiveDownload(null);
    }
  }

  async function onDownloadDocx() {
    setActiveDownload("docx");

    try {
      await exportResumeAsDocx(resume);
      setMessage("DOCX downloaded successfully");
      trackUsageEvent({ event: "resume_exported" });
    } catch {
      setMessage("Could not generate DOCX. Try again.");
    } finally {
      setActiveDownload(null);
    }
  }

  function onDownloadMarkdown() {
    exportResumeAsMarkdown(resume);
    setMessage("Markdown downloaded successfully");
    trackUsageEvent({ event: "resume_exported" });
  }

  function onDownloadHtml() {
    exportResumeAsHtml(resume, resumePreviewId);
    setMessage("HTML downloaded successfully");
    trackUsageEvent({ event: "resume_exported" });
  }

  function onDownloadText() {
    exportResumeAsText(resume);
    setMessage("Plain text downloaded successfully");
    trackUsageEvent({ event: "resume_exported" });
  }

  function onDownloadJson() {
    exportResumeAsJson(resume);
    setMessage("JSON downloaded successfully");
    trackUsageEvent({ event: "resume_exported" });
  }

  async function onCreateShareLink() {
    setShareBusy(true);
    setShareError(null);

    try {
      const shareLink = await createResumeShareLink(resume, {
        resumeTitle: resume.basics.fullName || "Shared Resume",
        password: sharePassword.trim() || undefined,
        expiresAt: shareNoExpiry
          ? null
          : shareExpiry
            ? new Date(shareExpiry).toISOString()
            : null,
        noExpiry: shareNoExpiry,
      });

      const nextShareUrl = `${window.location.origin}/share/${shareLink.token}`;
      setShareUrl(nextShareUrl);

      await navigator.clipboard.writeText(nextShareUrl);

      setMessage("Share link created and copied to clipboard");
      trackUsageEvent({ event: "share_link_created" });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 409) {
        try {
          const links = await listResumeShareLinks(resume.id);
          const existing = links[0];

          if (existing) {
            const existingUrl = `${window.location.origin}/share/${existing.token}`;
            setShareUrl(existingUrl);
          }
        } catch {
          // Ignore secondary list errors here and still show the primary conflict message.
        }

        setShareError(
          "A share link already exists for this resume. Revoke the current link from the dashboard share modal before creating a new one.",
        );
        return;
      }

      setShareError(
        error instanceof Error
          ? error.message
          : "Could not create share link. Try again.",
      );
    } finally {
      setShareBusy(false);
    }
  }

  function openShareModal() {
    setShareModalOpen(true);
    setShareError(null);
    setShareUrl(null);
  }

  return (
    <div className="border-border bg-card/95 flex flex-wrap items-center justify-between gap-3 rounded-3xl border p-4 shadow-sm backdrop-blur">
      <ToolbarHeader
        message={message}
        onBack={() => router.push("/dashboard")}
      />

      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push(`/editor/${resumeId}/preview`)}
          size="sm"
          variant="secondary"
        >
          Full Preview
        </Button>

        <Button
          onClick={() => {
            const saveResult = saveToStorage({ flush: true });

            if (!saveResult.ok) {
              setMessage(getSaveFailureMessage(saveResult.reason));
              return;
            }

            setMessage("Draft saved locally");
          }}
          size="sm"
          variant="secondary"
        >
          Save
        </Button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="application/json"
          onChange={(event) => onImportResume(event.target.files?.[0])}
        />

        <ToolbarDownloadMenu
          onDownloadPdf={onDownloadPdf}
          onDownloadPng={() => onDownloadImage("png")}
          onDownloadJpg={() => onDownloadImage("jpg")}
          onDownloadDocx={onDownloadDocx}
          onDownloadMarkdown={onDownloadMarkdown}
          onDownloadHtml={onDownloadHtml}
          onDownloadText={onDownloadText}
          onDownloadJson={onDownloadJson}
          activeDownload={activeDownload}
        />

        <ToolbarActionsMenu
          onDelete={openDeleteModal}
          onImport={() => fileInputRef.current?.click()}
          onExport={() => {
            onDownloadJson();
          }}
          onShare={openShareModal}
          onReset={() => {
            resetResume();
            setMessage("Resume reset to defaults");
          }}
        />
      </div>

      <Modal
        onClose={() => {
          setDeleteConfirmText("");
          setDeleteConfirmOpen(false);
        }}
        open={deleteConfirmOpen}
      >
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Delete Resume?</Modal.Title>

            <Modal.Description>
              This will permanently remove the current resume. Type DELETE to
              continue.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body>
            <div className="space-y-4">
              <Input
                onChange={(event) => setDeleteConfirmText(event.target.value)}
                placeholder="Type DELETE"
                value={deleteConfirmText}
              />

              <Button
                disabled={deleteConfirmText !== "DELETE"}
                onClick={onDeleteResume}
                size="sm"
              >
                Permanently Delete
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        onClose={() => {
          if (shareBusy) {
            return;
          }

          setShareModalOpen(false);
          setShareError(null);
        }}
        open={shareModalOpen}
      >
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Create Share Link</Modal.Title>

            <Modal.Description>
              Create a public link for this resume with optional password and
              expiry.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body>
            <div className="space-y-4">
              <Input
                value={sharePassword}
                onChange={(event) => setSharePassword(event.target.value)}
                type="password"
                placeholder="Optional password"
                autoComplete="new-password"
              />

              <label className="text-muted flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={shareNoExpiry}
                  onChange={(event) => setShareNoExpiry(event.target.checked)}
                />
                No expiry
              </label>

              <Input
                value={shareExpiry}
                onChange={(event) => setShareExpiry(event.target.value)}
                type="datetime-local"
                disabled={shareNoExpiry}
              />

              {shareError ? (
                <p className="text-destructive text-sm">{shareError}</p>
              ) : null}

              {shareUrl ? (
                <div className="space-y-2">
                  <p className="text-muted text-xs font-semibold uppercase">
                    Share URL
                  </p>
                  <Input value={shareUrl} readOnly />
                </div>
              ) : null}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShareModalOpen(false)}
              disabled={shareBusy}
            >
              Close
            </Button>

            <Button onClick={onCreateShareLink} loading={shareBusy}>
              Create Link
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Toolbar;
