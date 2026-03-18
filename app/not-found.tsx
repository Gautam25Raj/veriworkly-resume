import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

const NotFound = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <Container className="flex flex-col items-center text-center">
        <p className="text-accent text-sm font-bold tracking-[0.2em] uppercase">
          404 Error
        </p>

        <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Page not found
        </h1>

        <p className="text-muted mt-6 max-w-md text-base leading-7">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, or the URL might be incorrect.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild variant="primary">
            <Link href="/dashboard">Go back to Dashboard</Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="/templates">View Templates</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default NotFound;
