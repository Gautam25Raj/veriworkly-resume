import { Container } from "@veriworkly/ui";

export default function StatsLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="from-accent/10 pointer-events-none absolute inset-x-0 top-0 h-64" />

      <Container className="relative py-12 md:py-16">
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-4">
            <div className="bg-border h-12 w-full max-w-md animate-pulse rounded-2xl" />
            <div className="bg-border h-4 w-64 animate-pulse rounded-full" />
          </div>

          <div className="bg-border h-10 w-40 animate-pulse rounded-full" />
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-border/40 border-border/50 h-32 animate-pulse rounded-3xl border"
            />
          ))}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-border h-12 animate-pulse rounded-2xl" />
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-border/40 border-border/50 h-20 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
