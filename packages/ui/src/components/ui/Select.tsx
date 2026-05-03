import type { SelectHTMLAttributes } from "react";

import { cn } from "../../utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "border-border bg-background text-foreground focus:border-accent/40 focus:ring-accent/20 h-11 w-full rounded-2xl border px-4 text-sm shadow-sm transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
