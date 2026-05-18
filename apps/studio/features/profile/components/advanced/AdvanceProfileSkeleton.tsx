const AdvancedSkeleton = () => {
  return (
    <div className="border-border bg-card animate-pulse space-y-6 rounded-2xl border p-8">
      <div className="bg-muted h-4 w-24 rounded" />
      <div className="bg-muted h-10 w-64 rounded" />

      <div className="space-y-2">
        <div className="bg-muted h-4 w-full rounded" />
        <div className="bg-muted h-4 w-3/4 rounded" />
      </div>
    </div>
  );
};

export default AdvancedSkeleton;
