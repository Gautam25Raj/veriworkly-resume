import { Card } from "@veriworkly/ui";

export default function TemplatePreviewLoading() {
  return (
    <div className="space-y-10 py-10">
      <div className="space-y-4">
        <div className="bg-border h-3 w-36 animate-pulse rounded" />
        <div className="bg-border h-12 w-full max-w-2xl animate-pulse rounded" />
        <div className="bg-border h-4 w-full max-w-xl animate-pulse rounded" />
      </div>

      <section aria-label="Template Preview Loading">
        <Card className="overflow-hidden p-2 md:p-4">
          <div className="bg-background rounded-xl p-4 md:p-6">
            <div className="bg-border h-[70vh] w-full animate-pulse rounded-2xl" />
          </div>
        </Card>
      </section>
    </div>
  );
}
