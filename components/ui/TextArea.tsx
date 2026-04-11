import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-border bg-background text-foreground flex min-h-30 w-full resize-none rounded-2xl border px-4 py-3 text-sm transition-all duration-200",
          "placeholder:text-muted-foreground/40",
          "hover:border-border-hover outline-none",
          "focus-visible:ring-4",
          error
            ? "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/10"
            : "border-border focus-visible:border-accent/40 focus-visible:ring-accent/10",
          "disabled:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
