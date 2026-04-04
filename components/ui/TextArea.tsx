import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "border-border bg-background text-foreground placeholder:text-muted focus:border-accent/40 focus:ring-accent/20 min-h-32 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}
