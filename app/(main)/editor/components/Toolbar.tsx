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
  saveResume,
  createResume,
  deleteResume,
  exportResumeAsJson,
  importResumeFromFile,
} from "@/features/resume/services/resume-service";
import { useResume } from "@/features/resume/hooks/use-resume";
import { generatePDF } from "@/features/resume/utils/generate-pdf";

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
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  async function onImportResume(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const importedResume = await importResumeFromFile(file);

      setResume(importedResume);
      saveResume(importedResume);

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
    setDeleteConfirmOpen(false);
    setDeleteConfirmText("");
  }

  function openDeleteModal() {
    setDeleteConfirmOpen(true);
    setDeleteConfirmText("");
  }

  async function onDownloadPdf() {
    setIsDownloadingPdf(true);

    const didDownload = await generatePDF(
      resumePreviewId,
      resume.basics.fullName || "resume",
    );

    setMessage(
      didDownload
        ? "PDF downloaded successfully"
        : "Could not generate PDF. Try again.",
    );

    setIsDownloadingPdf(false);
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
            saveResume(resume);
            saveToStorage();
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
          isDownloadingPdf={isDownloadingPdf}
        />

        <ToolbarActionsMenu
          onDelete={openDeleteModal}
          onImport={() => fileInputRef.current?.click()}
          onExport={() => {
            exportResumeAsJson(resume);
            setMessage("JSON export downloaded");
          }}
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
    </div>
  );
};

export default Toolbar;
