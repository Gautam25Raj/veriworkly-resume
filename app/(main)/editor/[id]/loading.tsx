export default function EditorByIdLoading() {
  return (
    <div className="space-y-4 py-2">
      <div className="border-border bg-card h-20 animate-pulse rounded-3xl border" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-border bg-card h-[68vh] animate-pulse rounded-3xl border" />
        <div className="border-border bg-card h-[68vh] animate-pulse rounded-3xl border" />
      </div>
    </div>
  );
}
