"use client";

import {
  Download,
  Loader2,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

type ExportNotice = {
  tone: "success" | "error";
  text: string;
};

interface ShareHeaderBarProps {
  title: string;
  expiresAt: string | null;
  downloadingFormat: string | null;
  exportNotice: ExportNotice | null;
  onDownload: (format: "pdf" | "png" | "jpg") => void;
}

const exportFormats: Array<"pdf" | "png" | "jpg"> = ["pdf", "png", "jpg"];

export const ShareHeaderBar = ({
  title,
  expiresAt,
  downloadingFormat,
  exportNotice,
  onDownload,
}: ShareHeaderBarProps) => {
  const expiryLabel = expiresAt
    ? `Expires ${new Date(expiresAt).toLocaleDateString()}`
    : "No Expiry";
  const isExporting = Boolean(downloadingFormat);

  return (
    <header className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:pt-6">
      <div className="border-border bg-card relative overflow-hidden rounded-xl border-2 px-5 py-4 md:rounded-full md:px-8 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-foreground text-background inline-block px-2 py-0.5 text-[10px] font-bold tracking-[0.25em] uppercase dark:bg-zinc-100 dark:text-zinc-900">
                  Public Resume
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-tight uppercase">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {expiryLabel}
                  </span>

                  {isExporting && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-tight text-blue-600 uppercase dark:text-blue-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Exporting {downloadingFormat}
                      </span>
                    </>
                  )}
                </div>

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>

            <h1 className="text-foreground truncate text-xl leading-tight font-bold tracking-tight md:text-2xl">
              {title || "Shared Resume"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <div className="border-border bg-background flex items-center overflow-hidden rounded-full border-2 dark:border-zinc-800">
              {exportFormats.map((format, index) => {
                const isActive = downloadingFormat === format;

                return (
                  <Button
                    size="sm"
                    key={format}
                    variant="secondary"
                    disabled={isExporting}
                    onClick={() => onDownload(format)}
                    className={cn(
                      "h-8 rounded-none px-3 text-[10px] font-bold tracking-widest uppercase transition-colors",
                      index !== 0 &&
                        "border-border border-l dark:border-zinc-800",
                      isActive &&
                        "bg-foreground text-background hover:bg-foreground hover:text-background dark:bg-zinc-100 dark:text-zinc-900",
                    )}
                  >
                    {!downloadingFormat && (
                      <Download className="mr-1.5 h-2.5 w-2.5" />
                    )}
                    {format}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="h-10 rounded-full px-5 text-[12px] font-bold tracking-wide"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <ThemeToggle className="border-border hover:bg-foreground/5 h-10 w-10 rounded-full border-2 px-0 dark:border-zinc-800" />
            </div>
          </div>
        </div>

        {exportNotice && (
          <div
            className={cn(
              "animate-in fade-in slide-in-from-top-2 mt-5 flex items-center gap-2.5 border-l-4 p-3 text-[12px] font-bold tracking-wide uppercase",
              exportNotice.tone === "success"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-destructive bg-destructive/10 text-destructive dark:text-destructive-foreground",
            )}
          >
            {exportNotice.tone === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {exportNotice.text}
          </div>
        )}
      </div>
    </header>
  );
};
