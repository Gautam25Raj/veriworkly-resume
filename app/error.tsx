"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>

        <p className="text-muted mt-4 max-w-md text-sm leading-6">
          An unexpected error occurred. This might be due to a corrupted local
          storage or a temporary glitch.
        </p>

        <div className="mt-10 flex gap-4">
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>

          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </Container>
    </main>
  );
}
