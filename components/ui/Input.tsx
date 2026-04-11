import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-background text-foreground flex h-11 w-full rounded-2xl border px-4 py-2 text-sm transition-all duration-200",
          "placeholder:text-muted-foreground/40",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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

Input.displayName = "Input";

export { Input };
