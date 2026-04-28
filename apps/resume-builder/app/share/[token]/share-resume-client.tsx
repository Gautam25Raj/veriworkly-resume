"use client";

import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";

import type { TemplateComponent } from "@/types/template";

import { Button } from "@veriworkly/ui";
import { loadTemplateComponentById } from "@/templates";

import {
  type ShareLinkPayload,
  fetchShareLink,
  verifyShareLink,
  downloadPublicShareExport,
} from "@/features/resume/services/public-share";
import { buildExportHtml } from "@/features/resume/utils/build-export-html";
import { ensureResumeFontStylesheet } from "@/features/resume/utils/resume-font-loader";

import {
  ResumeCanvas,
  ShareHeaderBar,
  FullScreenMessage,
  PasswordGateModal,
} from "./components";

interface TemplateState {
  loading: boolean;
  error: string | null;
  component: TemplateComponent | null;
}

const ShareResumeClient = ({ token }: { token: string }) => {
  const exportInFlightRef = useRef(false);

  const sharePreviewId = `share-resume-preview-${token}`;

  const [dataState, setDataState] = useState<{
    loading: boolean;
    error: string | null;
    payload: ShareLinkPayload | null;
  }>({
    loading: true,
    error: null,
    payload: null,
  });

  const [templateState, setTemplateState] = useState<TemplateState>({
    loading: false,
    error: null,
    component: null,
  });

  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [exportNotice, setExportNotice] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(
    null,
  );

  const resume = dataState.payload?.snapshot;

  useEffect(() => {
    let isActive = true;

    fetchShareLink(token)
      .then((payload) => {
        if (isActive) setDataState({ loading: false, error: null, payload });
      })
      .catch((err: unknown) => {
        if (isActive) {
          setDataState({
            loading: false,
            error: err instanceof Error ? err.message : "Unable to load resume",
            payload: null,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  useEffect(() => {
    let isActive = true;

    if (!resume) {
      setTemplateState({ loading: false, error: null, component: null });
      return;
    }

    if (resume.customization?.fontFamily) {
      ensureResumeFontStylesheet(resume.customization.fontFamily);
    }

    setTemplateState((prev) => ({ ...prev, loading: true, error: null }));

    loadTemplateComponentById(resume.templateId)
      .then((component) => {
        if (isActive)
          setTemplateState({ loading: false, error: null, component });
      })
      .catch((err: unknown) => {
        if (isActive) {
          setTemplateState({
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Unable to load resume template",
            component: null,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [resume]);

  const handleUnlock = useCallback(async () => {
    if (!password) return;

    setVerifying(true);
    setDataState((prev) => ({ ...prev, error: null }));

    try {
      const payload = await verifyShareLink(token, password);

      setDataState({ loading: false, error: null, payload });
    } catch (err: unknown) {
      setDataState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Invalid password",
      }));
    } finally {
      setVerifying(false);
    }
  }, [token, password]);

  const handleDownload = useCallback(
    async (format: "pdf" | "png" | "jpg") => {
      if (exportInFlightRef.current) return;

      exportInFlightRef.current = true;
      setDownloadingFormat(format);
      setExportNotice(null);

      try {
        const renderHtml = buildExportHtml(sharePreviewId);

        await downloadPublicShareExport(
          token,
          format,
          password || undefined,
          renderHtml,
        );

        setExportNotice({
          tone: "success",
          text: `${format.toUpperCase()} export downloaded`,
        });
      } catch (err: unknown) {
        const rawMessage =
          err instanceof Error ? err.message : "Download failed";

        const safeMessage = /failed to fetch|networkerror|load failed/i.test(
          rawMessage,
        )
          ? "Unable to export right now. Please try again in a few seconds."
          : rawMessage;

        setExportNotice({ tone: "error", text: safeMessage });
      } finally {
        exportInFlightRef.current = false;
        setDownloadingFormat(null);
      }
    },
    [token, password, sharePreviewId],
  );

  if (dataState.loading) {
    return (
      <FullScreenMessage
        title="Loading Resume"
        description="Fetching the verified document..."
        icon={<Loader2 className="text-accent animate-spin" />}
      />
    );
  }

  if (dataState.error && !dataState.payload) {
    return (
      <FullScreenMessage
        title="Resume Unavailable"
        description={dataState.error}
        icon={<AlertCircle className="text-destructive" />}
        action={
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        }
      />
    );
  }

  if (!dataState.payload) return null;

  if (dataState.payload.passwordRequired) {
    return (
      <PasswordGateModal
        password={password}
        error={dataState.error}
        verifying={verifying}
        onUnlock={handleUnlock}
        onPasswordChange={setPassword}
      />
    );
  }

  if (!resume) {
    return (
      <FullScreenMessage
        title="Empty Content"
        description="The resume data is missing."
      />
    );
  }

  if (templateState.error) {
    return (
      <FullScreenMessage
        title="Template Error"
        description={templateState.error}
        icon={<AlertCircle className="text-destructive" />}
        action={
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        }
      />
    );
  }

  if (templateState.loading || !templateState.component) {
    return (
      <FullScreenMessage
        title="Loading Template"
        description="Preparing the selected template architecture..."
        icon={<Loader2 className="text-accent animate-spin" />}
      />
    );
  }

  return (
    <main className="bg-background surface-grid selection:bg-accent/20 relative min-h-screen">
      <ShareHeaderBar
        title={dataState.payload.resumeTitle}
        expiresAt={dataState.payload.expiresAt}
        exportNotice={exportNotice}
        onDownload={handleDownload}
        downloadingFormat={downloadingFormat}
      />

      <ResumeCanvas
        resume={resume}
        sharePreviewId={sharePreviewId}
        templateComponent={templateState.component}
      />
    </main>
  );
};

export default ShareResumeClient;
