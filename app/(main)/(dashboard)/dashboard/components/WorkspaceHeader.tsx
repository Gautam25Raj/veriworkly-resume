import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onCreate: () => void;
}

const WorkspaceHeader = ({ onCreate }: HeaderProps) => (
  <Card className="border-border/50 flex flex-wrap items-center justify-between gap-4 p-6 shadow-sm">
    <div>
      <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
        Resume Workspace
      </p>

      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Your resumes
      </h1>

      <p className="text-muted mt-1 text-sm">
        Manage, preview, and safely delete drafts.
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" onClick={onCreate}>
        Create Resume
      </Button>
    </div>
  </Card>
);

export default WorkspaceHeader;
