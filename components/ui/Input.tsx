import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-border bg-background text-foreground placeholder:text-muted focus:border-accent/40 focus:ring-accent/20 h-11 w-full rounded-2xl border px-4 text-sm shadow-sm transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
