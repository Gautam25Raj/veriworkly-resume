"use client";

import {
  Save,
  Upload,
  FileJson,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

import type { MasterProfile } from "@/types/resume";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";

import { cn } from "@/lib/utils";

import { ApiRequestError } from "@/utils/fetchApiData";

type ProfileAdvancedProps = {
  profile: MasterProfile;
  onSave: (profile: MasterProfile) => Promise<void>;
  isSaving?: boolean;
};

const ProfileAdvanced = ({
  profile,
  onSave,
  isSaving,
}: ProfileAdvancedProps) => {
  const [jsonValue, setJsonValue] = useState(() =>
    JSON.stringify(profile, null, 2),
  );
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      JSON.parse(jsonValue);

      setIsJsonValid(true);
      setErrorMessage(null);
    } catch {
      setIsJsonValid(false);
    }
  }, [jsonValue]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonValue);

      await onSave(parsed);

      setStatusMessage("Profile updated successfully!");
      setErrorMessage(null);

      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 409) {
        setErrorMessage(
          "Conflict: This profile was updated elsewhere. Please refresh.",
        );
        return;
      }
      setErrorMessage(
        error instanceof SyntaxError
          ? `Syntax Error: ${error.message}`
          : "Save failed",
      );
    }
  };

  const handleReset = () => {
    if (confirm("Discard all changes and reset to current profile?")) {
      setJsonValue(JSON.stringify(profile, null, 2));
      setErrorMessage(null);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      const blob = new Blob([jsonValue], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `master-profile-${new Date().toISOString().split("T")[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);

      setStatusMessage("Backup file generated.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b bg-zinc-500/3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 text-accent flex h-8 w-8 items-center justify-center rounded-lg">
              <FileJson className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold">Raw JSON Schema</h3>

              <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                Direct Data Manipulation
              </p>
            </div>
          </div>

          <Badge className="h-5 px-2 text-[10px]">
            {isJsonValid ? "Valid JSON" : "Invalid Syntax"}
          </Badge>
        </div>

        <div className="space-y-4 p-4">
          <TextArea
            rows={22}
            value={jsonValue}
            onChange={(e) => setJsonValue(e.target.value)}
            className={cn(
              "hide-scrollbar font-mono text-[13px] leading-relaxed transition-all focus:ring-1",
              "selection:bg-accent/30 bg-zinc-950 text-zinc-300 selection:text-white",
              !isJsonValid && "border-red-500/50 focus:ring-red-500/50",
            )}
          />

          {errorMessage && (
            <div className="animate-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />

              <p className="text-xs leading-normal font-medium text-red-600">
                {errorMessage}
              </p>
            </div>
          )}

          {statusMessage && (
            <div className="animate-in slide-in-from-top-2 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

              <p className="text-xs leading-normal font-medium text-emerald-600">
                {statusMessage}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t bg-zinc-500/3 p-4 sm:flex-row">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !isJsonValid}
              className="flex-1 gap-2 px-6 sm:flex-none"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Commit Changes"}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleReset}
              title="Reset to original"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              size="sm"
              className="flex-1 gap-2 text-xs sm:flex-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" /> Import
            </Button>

            <Button
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 gap-2 text-xs sm:flex-none"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </Card>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/json"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          try {
            const text = await file.text();
            JSON.parse(text);
            setJsonValue(text);
            setStatusMessage(
              "JSON imported successfully. Review before committing.",
            );
          } catch {
            setErrorMessage("Import failed: The file is not a valid JSON.");
          } finally {
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};

export default ProfileAdvanced;
