import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { templateSummaries } from "@/config/templates";
import { ResumeListItem } from "@/features/resume/services/resume-service";

interface ResumeCardProps {
  resume: ResumeListItem;
  onDelete: (id: string) => void;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
  const template =
    templateSummaries.find((t) => t.id === resume.templateId) ??
    templateSummaries[0];

  const dateObj = new Date(resume.updatedAt);
  const isValidDate = !isNaN(dateObj.getTime());

  return (
    <div className="group relative h-full">
      <Link
        href={`/editor/${resume.id}`}
        className="focus-visible:ring-accent block h-full rounded-3xl outline-none focus-visible:ring-2"
      >
        <Card className="border-border group-hover:border-accent/30 h-full space-y-4 border transition-colors duration-300">
          <div
            className="h-2 w-full rounded-full transition-opacity group-hover:opacity-80"
            style={{ backgroundColor: template.accentColor }}
          />

          <div className="space-y-1">
            <h3 className="text-foreground truncate text-lg font-semibold">
              {resume.title}
            </h3>

            <p className="text-muted truncate text-sm">
              {resume.role || "Role not set"}
            </p>

            <p className="text-muted text-xs">Template: {template.name}</p>
          </div>

          <p className="text-muted/60 text-xs" suppressHydrationWarning>
            Updated{" "}
            {isValidDate
              ? dateObj.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Recently"}
          </p>
        </Card>
      </Link>

      <div className="absolute right-4 bottom-4">
        <Button
          size="sm"
          variant="ghost"
          aria-label={`Delete ${resume.title}`}
          className="text-muted hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(resume.id);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ResumeCard;
