import { Card } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

const EmptyState = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed py-20 text-center">
      <div className="bg-accent/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <span className="text-accent text-2xl">📄</span>
      </div>

      <h2 className="text-foreground text-xl font-semibold">No resumes yet</h2>

      <p className="text-muted mt-2 max-w-70 text-sm">
        Start by creating your first professional resume. It only takes a few
        minutes.
      </p>

      <Button
        size="sm"
        variant="primary"
        className="mt-6"
        onClick={onCreate}
        aria-label="Create your first resume"
      >
        Create your first resume
      </Button>
    </Card>
  );
};

export default EmptyState;
