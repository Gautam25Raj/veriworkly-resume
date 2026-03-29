"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ToolbarHeaderProps {
  message: string;
  onBack: () => void;
}

const ToolbarHeader = ({ message, onBack }: ToolbarHeaderProps) => {
  return (
    <div className="flex items-start gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={onBack}
        title="Back to dashboard"
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div>
        <p className="text-foreground text-sm font-semibold">Resume Editor</p>
        <p className="text-muted text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ToolbarHeader;
