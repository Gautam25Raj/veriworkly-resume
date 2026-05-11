export default function TemplatePreviewLoading() {
  return (
    <div className="space-y-10 py-10">
      <div className="space-y-4">
        <div className="bg-accent/10 h-3 w-36 animate-pulse rounded-full" />
        <div className="bg-border h-12 w-full max-w-2xl animate-pulse rounded-2xl" />
        <div className="bg-border h-4 w-full max-w-xl animate-pulse rounded-full" />
      </div>

      <section aria-label="Template Preview Loading" className="space-y-8">
        <div className="border-border/50 bg-accent/5 relative mx-auto aspect-3/4 w-full max-w-4xl animate-pulse overflow-hidden rounded-2xl border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-accent/20 border-t-accent h-12 w-12 animate-spin rounded-full border-4" />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="bg-border h-14 w-64 animate-pulse rounded-full" />
        </div>
      </section>
    </div>
  );
}
