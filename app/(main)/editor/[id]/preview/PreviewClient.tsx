"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

import { Card } from "@/components/ui/Card";
import { useResume } from "@/features/resume/hooks/use-resume";
import { loadResumeById } from "@/features/resume/services/resume-service";
import { getTemplateById } from "@/templates";

interface PreviewClientProps {
  resumeId: string;
}

export function PreviewClient({ resumeId }: PreviewClientProps) {
  const { resume, setResume } = useResume();
  const routeResume = useMemo(() => loadResumeById(resumeId), [resumeId]);

  useEffect(() => {
    if (!routeResume) {
      return;
    }

    setResume(routeResume);
  }, [routeResume, setResume]);

  const Template = getTemplateById(resume.templateId).Component;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="border-border bg-card/95 sticky top-4 z-20 flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-muted text-[11px] font-semibold tracking-[0.22em] uppercase">
            Resume Preview
          </p>
          <p className="text-foreground text-sm font-medium">
            {resume.basics.fullName || "Untitled Resume"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="text-foreground hover:bg-card inline-flex h-9 items-center justify-center rounded-full bg-transparent px-3 text-sm font-medium transition"
            href={`/editor/${resumeId}`}
          >
            Back to editor
          </Link>
          <Link
            className="bg-card text-foreground ring-border hover:bg-background inline-flex h-9 items-center justify-center rounded-full px-3 text-sm font-medium ring-1 transition ring-inset"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {!routeResume ? (
        <Card className="space-y-3 text-center">
          <h1 className="text-foreground text-xl font-semibold">
            Resume not found
          </h1>
          <p className="text-muted text-sm">
            This resume may have been deleted. Return to dashboard to pick
            another one.
          </p>
          <div>
            <Link
              className="bg-card text-foreground ring-border hover:bg-background inline-flex h-9 items-center justify-center rounded-full px-3 text-sm font-medium ring-1 transition ring-inset"
              href="/dashboard"
            >
              Go to dashboard
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-4">
          <div className="bg-background rounded-3xl p-4 md:p-6">
            <div className="mx-auto w-full max-w-[850px]">
              <Template resume={resume} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
