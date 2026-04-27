import { Container } from "@veriworkly/ui";

export default function AppLoading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <Container className="w-full max-w-2xl">
        <div className="border-border bg-card space-y-4 rounded-3xl border p-8">
          <div className="bg-border h-4 w-24 animate-pulse rounded" />
          <div className="bg-border h-10 w-3/4 animate-pulse rounded" />
          <div className="bg-border h-4 w-full animate-pulse rounded" />
          <div className="bg-border h-4 w-5/6 animate-pulse rounded" />
          <div className="mt-4 flex gap-3">
            <div className="bg-border h-11 w-36 animate-pulse rounded-full" />
            <div className="bg-border h-11 w-32 animate-pulse rounded-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
