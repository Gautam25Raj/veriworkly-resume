import { cn } from "../../utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-border bg-background text-muted inline-block rounded-full border px-3 py-1 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
