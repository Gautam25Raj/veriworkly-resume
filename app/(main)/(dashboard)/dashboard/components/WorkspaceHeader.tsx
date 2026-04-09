import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const WorkspaceHeader = ({ onCreate, onRefresh, refreshing }: HeaderProps) => (
  <Card className="border-border/50 flex flex-wrap items-center justify-between gap-4 p-4 shadow-sm sm:p-6">
    <div>
      <p className="text-muted text-xs font-semibold tracking-[0.2em] uppercase">
        Resume Workspace
      </p>

      <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
        Your resumes
      </h1>

      <p className="text-muted mt-1 text-sm">
        Create, share, and manage your resume drafts.
      </p>
    </div>

    <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
      <Button
        size="sm"
        variant="ghost"
        onClick={onRefresh}
        loading={refreshing}
      >
        Refresh Cloud
      </Button>

      <Button size="sm" variant="secondary" onClick={onCreate}>
        Create Resume
      </Button>
    </div>
  </Card>
);

export default WorkspaceHeader;
