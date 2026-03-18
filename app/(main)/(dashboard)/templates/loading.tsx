const TemplatesLoading = () => {
  return (
    <div className="space-y-12 py-10">
      <header className="space-y-4">
        <div className="bg-border h-3 w-32 animate-pulse rounded" />
        <div className="bg-border h-12 w-full max-w-3xl animate-pulse rounded" />
        <div className="bg-border h-4 w-full max-w-2xl animate-pulse rounded" />
        <div className="bg-border h-4 w-full max-w-xl animate-pulse rounded" />
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card space-y-5 rounded-3xl border p-6"
          >
            <div className="bg-border h-52 w-full animate-pulse rounded-2xl" />
            <div className="bg-border h-7 w-2/3 animate-pulse rounded" />
            <div className="bg-border h-4 w-full animate-pulse rounded" />
            <div className="bg-border h-4 w-4/5 animate-pulse rounded" />
            <div className="bg-border h-11 w-40 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesLoading;
